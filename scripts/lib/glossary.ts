import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface GlossaryEntry {
  /** Primary key (heading text, e.g. "PBS") */
  term: string;
  /** Slug for the file name (e.g. "PBS" or "Liquid-Staking") */
  slug: string;
  /** Japanese display name */
  ja: string;
  /** Alternative English/abbreviation forms */
  aliases: string[];
  /** Related terms (referenced by their `term`) */
  related: string[];
  /** Description body (Markdown) */
  desc: string;
}

const ENTRY_BLOCK_RE = /^##\s+(.+?)\s*$/gm;

export function termToSlug(term: string): string {
  return term
    .trim()
    .replace(/[（(].*?[)）]/g, "") // strip parenthetical
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type PropValue = string | string[];
type RawProps = Record<string, PropValue>;

/**
 * Parse the body between two `## term` headings. Expected format:
 *
 *   - ja: <single-line string>
 *   - aliases: [a, b, c]          # flow-style array
 *   - related: [x, y]
 *   - desc: |
 *       multi-line block scalar
 *       (continuation lines indented by >=2 spaces relative to `-`)
 *
 * Returns a plain key→value object.
 */
function parseEntryBody(body: string, termForErrors: string): RawProps {
  const props: RawProps = {};
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^-\s+(\w+):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    const inline = m[2];

    if (inline === "|" || inline === ">") {
      i++;
      const blockLines: string[] = [];
      while (i < lines.length) {
        const next = lines[i];
        if (/^\s{2,}/.test(next)) {
          blockLines.push(next.replace(/^\s{2,4}/, ""));
          i++;
        } else if (next.trim() === "") {
          blockLines.push("");
          i++;
        } else {
          break;
        }
      }
      while (blockLines.length > 0 && blockLines[blockLines.length - 1] === "") {
        blockLines.pop();
      }
      props[key] = blockLines.join("\n");
    } else if (inline.startsWith("[") && inline.endsWith("]")) {
      props[key] = inline
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      i++;
    } else if (inline.length > 0) {
      props[key] = inline;
      i++;
    } else {
      throw new Error(`empty value for "${key}" in glossary entry "${termForErrors}"`);
    }
  }
  return props;
}

function asString(v: PropValue | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asArray(v: PropValue | undefined): string[] | undefined {
  return Array.isArray(v) ? v : undefined;
}

export async function loadGlossary(rootDir: string): Promise<GlossaryEntry[]> {
  const filePath = path.join(rootDir, "glossary.md");
  const raw = await fs.readFile(filePath, "utf8");
  const { content } = matter(raw);

  const headings: { term: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  ENTRY_BLOCK_RE.lastIndex = 0;
  while ((m = ENTRY_BLOCK_RE.exec(content)) !== null) {
    headings.push({ term: m[1], start: m.index, end: m.index + m[0].length });
  }

  const entries: GlossaryEntry[] = [];
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const next = headings[i + 1];
    const body = content.slice(h.end, next ? next.start : content.length).trim();
    const props = parseEntryBody(body, h.term);
    const ja = asString(props.ja);
    if (!ja) {
      throw new Error(`glossary entry "${h.term}" is missing required \`ja\` field`);
    }
    entries.push({
      term: h.term.trim(),
      slug: termToSlug(h.term),
      ja: ja.trim(),
      aliases: asArray(props.aliases) ?? [],
      related: asArray(props.related) ?? [],
      desc: (asString(props.desc) ?? "").trim(),
    });
  }

  return entries;
}

/**
 * Build a compact glossary string for Gemini prompt injection.
 * One line per term, listing all surface forms and the canonical wikilink.
 */
export function buildPromptGlossary(entries: GlossaryEntry[]): string {
  const lines = entries.map((e) => {
    const surfaceForms = [e.term, ...e.aliases].map((s) => `"${s}"`).join(" / ");
    return `- ${surfaceForms} → [[glossary/${e.slug}|${e.ja}]]`;
  });
  return lines.join("\n");
}
