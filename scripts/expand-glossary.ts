/**
 * Expand glossary.md (single source) into per-term pages under content/glossary/.
 * Each page gets:
 *   - frontmatter: title, aliases, tags, date
 *   - body: Japanese display name + description
 *   - "## 関連用語" section: wikilinks to related terms
 *   - "## 元の表記" section: lists English aliases for searchability
 * Also writes content/glossary/index.md with a sorted list of all terms.
 */
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { loadGlossary, termToSlug, type GlossaryEntry } from "./lib/glossary.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "content", "glossary");

function renderEntry(e: GlossaryEntry, today: string): string {
  const front = matter.stringify("", {
    title: e.term,
    aliases: [e.ja, ...e.aliases.filter((a) => a !== e.ja)],
    tags: ["glossary"],
    date: today,
  });

  const relatedLines = e.related
    .map((r) => `- [[glossary/${termToSlug(r)}|${r}]]`)
    .join("\n");

  const aliasLines = e.aliases.length > 0 ? e.aliases.map((a) => `- ${a}`).join("\n") : "(なし)";

  return `${front}**${e.ja}**

${e.desc || ""}

## 関連用語

${relatedLines || "(なし)"}

## 元の表記（英語）

${aliasLines}
`;
}

function renderIndex(entries: GlossaryEntry[], today: string): string {
  const front = matter.stringify("", {
    title: "用語集",
    tags: ["glossary", "index"],
    date: today,
  });
  const sorted = [...entries].sort((a, b) => a.term.localeCompare(b.term));
  const list = sorted
    .map((e) => `- [[glossary/${e.slug}|${e.term}]] — ${e.ja}`)
    .join("\n");
  return `${front}Ethereum Research 翻訳で使用している専門用語の一覧です。各記事中に出てくる英語表記は、ここで定義された日本語表記とウィキリンクされます。

${list}

---

用語を追加・修正するには、リポジトリ ルートの \`glossary.md\` を編集してください。
`;
}

async function main(): Promise<void> {
  const entries = await loadGlossary(ROOT);
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Wipe stale generated files first (anything other than index.md is regen).
  const existing = await fs.readdir(OUT_DIR).catch(() => [] as string[]);
  for (const f of existing) {
    if (f.endsWith(".md")) {
      await fs.unlink(path.join(OUT_DIR, f));
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  for (const e of entries) {
    const file = path.join(OUT_DIR, `${e.slug}.md`);
    await fs.writeFile(file, renderEntry(e, today), "utf8");
  }
  await fs.writeFile(path.join(OUT_DIR, "index.md"), renderIndex(entries, today), "utf8");

  console.log(`[expand-glossary] wrote ${entries.length} term pages + index to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
