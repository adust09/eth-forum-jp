/**
 * Glossary term extraction.
 *
 * After a post is translated, a separate Gemini call scans the *source*
 * Markdown for Ethereum-research jargon that is not yet in the glossary and
 * returns structured candidates. The translation envelope is untouched — this
 * is an independent JSON call so an extraction failure can never corrupt a
 * translation result.
 *
 * Trust boundary: the model output is validated with Zod. `responseSchema`
 * only guides the model; the final guarantee comes from `ExtractedTermSchema`.
 */
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";
import { MODEL } from "./gemini.js";
import { termToSlug } from "./glossary.js";

/** Hard cap on candidates accepted per post (prompt asks for this too). */
export const MAX_TERMS_PER_POST = 5;

// A glossary scalar must be a single line. Alias/related items are additionally
// forbidden from containing the characters that delimit the flow array `[a, b]`.
const singleLine = (max: number) => z.string().min(1).max(max).regex(/^[^\n]+$/, "must be a single line");
const arrayItem = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[^\n,\[\]]+$/, "alias/related items must not contain newlines, commas, or brackets");

export const ExtractedTermSchema = z.object({
  term: singleLine(120).refine((t) => termToSlug(t).length > 0, "term must produce a non-empty slug"),
  ja: singleLine(120),
  aliases: z.array(arrayItem).max(20).default([]),
  related: z.array(arrayItem).max(20).default([]),
  desc: z.string().max(1000).default(""),
});

export type ExtractedTerm = z.infer<typeof ExtractedTermSchema>;

const SYSTEM_PROMPT = `あなたは Ethereum リサーチ専門の用語抽出アシスタントです。
与えられた英語の投稿本文から、用語集に登録する価値のある **Ethereum リサーチ固有の専門用語** を抽出してください。

ルール:
1. 抽出するのは Ethereum / L2 / コンセンサス / 暗号 / MEV 等の領域固有で、今後も繰り返し登場しうる専門用語のみ。
2. 一般的な英単語・普通名詞・一度きりの固有名詞は抽出しない。
3. 「既知の用語」リストに（表記ゆれを含め）既に含まれる語は抽出しない。
4. 抽出は **最大 5 件**。価値の高いものを優先し、迷うものは除外する。
5. 各用語に次を付与する:
   - term: 英語の主表記（正規形）
   - ja: 日本語表記（必要なら英語をカッコ書きで補う）
   - aliases: 英語の別表記・略語の配列（無ければ空配列）
   - related: 関連用語名の配列（無ければ空配列）
   - desc: 日本語 2〜3 文の簡潔な説明
6. 出力は JSON 配列のみ。該当する用語が無ければ空配列 [] を返す。`;

const RESPONSE_SCHEMA = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      term: { type: SchemaType.STRING },
      ja: { type: SchemaType.STRING },
      aliases: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      related: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      desc: { type: SchemaType.STRING },
    },
    required: ["term", "ja", "desc"],
  },
};

/**
 * Validate raw model output into a list of candidate terms.
 *
 * `.max(5)` would *reject* a longer array rather than truncate it, and a single
 * bad element would sink the whole response — so we parse the array, slice to
 * the cap, then validate each element individually and drop the failures.
 * Throws only when the payload is not valid JSON.
 */
export function parseExtractionOutput(raw: string): ExtractedTerm[] {
  let data: unknown;
  try {
    data = JSON.parse(raw.trim());
  } catch {
    throw new Error(`glossary extraction output is not valid JSON. First 200 chars:\n${raw.slice(0, 200)}`);
  }
  if (!Array.isArray(data)) {
    console.warn("[glossary-extract] extraction output was not a JSON array; ignoring");
    return [];
  }

  const out: ExtractedTerm[] = [];
  for (const element of data.slice(0, MAX_TERMS_PER_POST)) {
    const parsed = ExtractedTermSchema.safeParse(element);
    if (!parsed.success) {
      const reasons = parsed.error.issues.map((i) => i.message).join("; ");
      console.warn(`[glossary-extract] dropping invalid candidate: ${reasons}`);
      continue;
    }
    out.push(parsed.data);
  }
  return out;
}

export class GlossaryExtractor {
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  constructor(apiKey: string) {
    const client = new GoogleGenerativeAI(apiKey);
    this.model = client.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });
  }

  private buildUserMessage(sourceMarkdown: string, originalTitle: string, knownSurfaceForms: Set<string>): string {
    const known = Array.from(knownSurfaceForms).sort().join(", ") || "(なし)";
    return [
      `# 既知の用語（抽出対象から除外する）\n${known}`,
      "",
      `# 投稿タイトル\n${originalTitle}`,
      "",
      "# 投稿本文 (Markdown)",
      "",
      sourceMarkdown,
    ].join("\n");
  }

  async extract(
    sourceMarkdown: string,
    originalTitle: string,
    knownSurfaceForms: Set<string>,
  ): Promise<ExtractedTerm[]> {
    const userMessage = this.buildUserMessage(sourceMarkdown, originalTitle, knownSurfaceForms);
    const result = await this.model.generateContent(userMessage);
    return parseExtractionOutput(result.response.text());
  }
}
