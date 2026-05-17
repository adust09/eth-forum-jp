import { GoogleGenerativeAI } from "@google/generative-ai";

// Default model. gemini-2.5-pro is paid-tier only (free tier quota = 0), while
// gemini-2.5-flash has a generous free tier sufficient for daily ethresear.ch
// volume and is quality-adequate for natural-language translation.
// Override with GEMINI_MODEL env var if billing is enabled (e.g. "gemini-2.5-pro").
export const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const SYSTEM_PROMPT_TEMPLATE = `あなたは Ethereum リサーチ専門の翻訳者です。
入力された英語 Markdown を、原文のフォーマット（見出し・コードブロック・テーブル・画像・引用・リンク）を完全に保ったまま日本語に翻訳してください。

ルール:
1. 画像 (\`![alt](url)\`) は URL を変更せずそのまま残す。alt は日本語化する。
2. コードブロック内（\`\`\`...\`\`\` および \`...\` でくくられた部分）は翻訳しない。
3. 数式 (\`$...$\`, \`$$...$$\`) は翻訳しない。
4. URL とコード識別子・関数名・型名は変更しない。
5. ASCII アート / ダイアグラム（連続したスペースや矢印で組まれた図）は、ボックスや矢印の構造を壊さずに、内部のラベルだけを日本語に置換する。
6. GLOSSARY セクションで定義された用語が**初めて**出てきた箇所では、必ず Quartz ウィキリンク形式
   \`[[glossary/<slug>|<日本語表記>]]\` に置換する。2 回目以降の同一用語はそのまま日本語表記で OK。
7. 翻訳のトーンは「Ethereum リサーチを追う日本人エンジニア向け」。
   過剰な敬語を避け、専門用語は原語をカッコ書きで補う（例: 「リキッドステーキング (Liquid Staking)」）。
8. タイトルと推奨タグは別途、出力フォーマットの先頭に返す。

出力フォーマットを**厳密に**守ること（前後に余計な空行や説明を付けない）:

---TITLE---
<日本語タイトル 1 行>
---TAGS---
<タグ 1〜3 個、カンマ区切り、小文字 kebab-case>
---BODY---
<翻訳済み Markdown 全文>

GLOSSARY:
{{GLOSSARY}}`;

export interface TranslationResult {
  title: string;
  tags: string[];
  body: string;
}

const SECTION_RE = /^---TITLE---\s*\n([\s\S]*?)\n---TAGS---\s*\n([\s\S]*?)\n---BODY---\s*\n([\s\S]+)$/;

export function parseTranslationOutput(raw: string): TranslationResult {
  const trimmed = raw.trim();
  const m = trimmed.match(SECTION_RE);
  if (!m) {
    throw new Error(
      `Gemini output did not match expected ---TITLE---/---TAGS---/---BODY--- format. First 400 chars:\n${trimmed.slice(0, 400)}`,
    );
  }
  return {
    title: m[1].trim(),
    tags: m[2]
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0),
    body: m[3].trim(),
  };
}

export class GeminiTranslator {
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;
  private glossaryContext: string;

  constructor(apiKey: string, glossaryContext: string) {
    const client = new GoogleGenerativeAI(apiKey);
    const systemInstruction = SYSTEM_PROMPT_TEMPLATE.replace("{{GLOSSARY}}", glossaryContext);
    this.model = client.getGenerativeModel({
      model: MODEL,
      systemInstruction,
      generationConfig: {
        temperature: 0.3,
        // Long posts can be 30K+ tokens of Markdown; allow plenty of headroom.
        maxOutputTokens: 32768,
      },
    });
    this.glossaryContext = glossaryContext;
  }

  /** Build a user-facing message containing the source Markdown to translate. */
  private buildUserMessage(sourceMarkdown: string, originalTitle: string): string {
    return [
      `# 原文タイトル\n${originalTitle}`,
      "",
      "# 原文 Markdown",
      "",
      sourceMarkdown,
    ].join("\n");
  }

  async translate(sourceMarkdown: string, originalTitle: string): Promise<TranslationResult> {
    const userMessage = this.buildUserMessage(sourceMarkdown, originalTitle);
    const result = await this.model.generateContent(userMessage);
    const text = result.response.text();
    return parseTranslationOutput(text);
  }

  /** For diagnostics — confirms the configured glossary length without calling the API. */
  get glossaryLength(): number {
    return this.glossaryContext.length;
  }
}
