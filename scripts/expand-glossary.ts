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
import process from "node:process";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import { loadGlossary, termToSlug, type GlossaryEntry } from "./lib/glossary.js";

const ROOT = path.resolve(import.meta.dirname, "..");

/** Normalize a YAML `last_updated` (gray-matter yields a Date for bare dates) to YYYY-MM-DD. */
function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value.trim())) {
    return value.trim().slice(0, 10);
  }
  throw new Error(`glossary.md frontmatter has a missing or invalid last_updated: ${String(value)}`);
}

function renderEntry(e: GlossaryEntry, date: string): string {
  const front = matter.stringify("", {
    title: e.term,
    aliases: [e.ja, ...e.aliases.filter((a) => a !== e.ja)],
    tags: ["glossary"],
    date,
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

function renderIndex(entries: GlossaryEntry[], date: string): string {
  const front = matter.stringify("", {
    title: "用語集",
    tags: ["glossary", "index"],
    date,
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

/**
 * Regenerate content/glossary/ from glossary.md. Renders every page in memory
 * first (so a malformed entry throws before any filesystem mutation), writes to
 * a temp dir, then swaps atomically — a failure leaves the existing pages intact.
 */
export async function expandGlossary(rootDir: string): Promise<void> {
  const outDir = path.join(rootDir, "content", "glossary");
  const entries = await loadGlossary(rootDir);

  const raw = await fs.readFile(path.join(rootDir, "glossary.md"), "utf8");
  const date = normalizeDate(matter(raw).data.last_updated);

  // Render everything up front; any bad entry fails here, before touching disk.
  const pages = new Map<string, string>();
  for (const e of entries) {
    pages.set(`${e.slug}.md`, renderEntry(e, date));
  }
  pages.set("index.md", renderIndex(entries, date));

  const tmpDir = `${outDir}.tmp-${process.pid}`;
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  for (const [name, content] of pages) {
    await fs.writeFile(path.join(tmpDir, name), content, "utf8");
  }

  // Atomic swap: move the live dir aside, move the new dir in, drop the backup.
  const backup = `${outDir}.bak-${process.pid}`;
  const outExists = await fs
    .access(outDir)
    .then(() => true)
    .catch(() => false);
  if (outExists) await fs.rename(outDir, backup);
  try {
    await fs.rename(tmpDir, outDir);
  } catch (err) {
    if (outExists) await fs.rename(backup, outDir); // restore on failure
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    throw err;
  }
  if (outExists) await fs.rm(backup, { recursive: true, force: true });

  console.log(`[expand-glossary] wrote ${entries.length} term pages + index to ${outDir}`);
}

const isEntrypoint =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isEntrypoint) {
  expandGlossary(ROOT).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
