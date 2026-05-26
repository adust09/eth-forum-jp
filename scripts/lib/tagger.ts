import { GoogleGenerativeAI } from "@google/generative-ai";
import { MODEL } from "./gemini.js";
import { canonicalizeTags } from "./taxonomy.js";

/**
 * Re-tagging classifier. Unlike `GeminiTranslator` (which produces a full
 * translation envelope), this reads an already-translated Japanese post and
 * returns only tags drawn from the controlled vocabulary. It is used by the
 * one-off `retag-posts.ts` backfill, not the daily pipeline (whose translator
 * already tags inline via the same taxonomy).
 */
const SYSTEM_PROMPT_TEMPLATE = `あなたは Ethereum リサーチ記事のタグ分類器です。
入力された日本語記事（タイトル＋本文）を読み、下記 TAXONOMY の統制語彙から該当するタグを選びます。

ルール:
- 記事内容に該当するものを必要なだけ選ぶ（記事により増減して良い。目安 3〜8 個）。
- すべて英語 lowercase kebab-case。日本語タグ・記号・空白は禁止。
- グラフ上で記事同士がつながるよう、汎用テーマタグ（例: consensus, scaling, zk, economics）を
  優先的に含める。
- TAXONOMY に無い概念でも記事の中心テーマなら、specific タグを**最大 2 個**まで追加して良い
  （同じく英語 kebab-case）。
- 出力はタグをカンマ区切りで **1 行だけ**。前置き・説明・改行を付けない。

TAXONOMY:
{{TAXONOMY}}`;

/** Cap the body sent for classification; the lede carries the topic, and full
 * posts can be 30K+ tokens. The title plus the opening is enough to tag well. */
const MAX_BODY_CHARS = 8000;

export class GeminiTagger {
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  constructor(apiKey: string, taxonomyContext: string) {
    const client = new GoogleGenerativeAI(apiKey);
    this.model = client.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_PROMPT_TEMPLATE.replace("{{TAXONOMY}}", taxonomyContext),
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 256,
      },
    });
  }

  /** Returns canonicalised tags for a translated post. */
  async tag(title: string, bodyMarkdown: string): Promise<string[]> {
    const body =
      bodyMarkdown.length > MAX_BODY_CHARS
        ? bodyMarkdown.slice(0, MAX_BODY_CHARS)
        : bodyMarkdown;
    const message = [`# タイトル\n${title}`, "", "# 本文", "", body].join("\n");
    const result = await this.model.generateContent(message);
    const firstLine = result.response.text().trim().split("\n")[0] ?? "";
    return canonicalizeTags(firstLine.split(",").map((t) => t.trim()));
  }
}
