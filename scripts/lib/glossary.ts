import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
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

/**
 * Lower-cased set of every surface form (term, aliases, slug) of the known
 * glossary. Used to dedupe auto-extracted candidates against what already
 * exists — and to prevent slug collisions that would overwrite a page.
 */
export function buildSurfaceFormSet(entries: GlossaryEntry[]): Set<string> {
  const set = new Set<string>();
  for (const e of entries) {
    set.add(e.term.toLowerCase());
    set.add(e.slug.toLowerCase());
    for (const a of e.aliases) set.add(a.toLowerCase());
  }
  return set;
}

/** Provenance recorded on auto-added entries so the source is auditable later. */
export interface EntryProvenance {
  /** Date the entry was auto-added (YYYY-MM-DD). */
  autoAdded: string;
  /** ethresear.ch topic id the term was extracted from. */
  sourceTopicId: string;
  /** Source post URL the term was extracted from. */
  sourceUrl: string;
}

export interface NewGlossaryItem {
  entry: GlossaryEntry;
  provenance: EntryProvenance;
}

/**
 * Render a single entry in glossary.md's hand-rolled format. `auto_*` keys are
 * provenance markers; `loadGlossary` ignores unknown keys, so they are inert.
 */
export function serializeEntry(entry: GlossaryEntry, provenance: EntryProvenance): string {
  const lines: string[] = [`## ${entry.term}`, `- ja: ${entry.ja}`];
  if (entry.aliases.length > 0) lines.push(`- aliases: [${entry.aliases.join(", ")}]`);
  if (entry.related.length > 0) lines.push(`- related: [${entry.related.join(", ")}]`);
  lines.push(`- auto_added: ${provenance.autoAdded}`);
  lines.push(`- auto_source_topic_id: ${provenance.sourceTopicId}`);
  lines.push(`- auto_source_url: ${provenance.sourceUrl}`);
  if (entry.desc) {
    lines.push("- desc: |");
    for (const l of entry.desc.split("\n")) {
      lines.push(l.length > 0 ? `  ${l}` : "");
    }
  }
  return lines.join("\n");
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Confirm a serialized entry parses back to the same values before writing it. */
function entryRoundTrips(entry: GlossaryEntry, serialized: string): boolean {
  const body = serialized.replace(/^##\s+.*\n/, "");
  try {
    const props = parseEntryBody(body, entry.term);
    return (
      asString(props.ja) === entry.ja &&
      arraysEqual(asArray(props.aliases) ?? [], entry.aliases) &&
      arraysEqual(asArray(props.related) ?? [], entry.related) &&
      (asString(props.desc) ?? "") === entry.desc
    );
  } catch {
    return false;
  }
}

/** Replace `last_updated:` inside the leading frontmatter block only. */
function bumpLastUpdated(raw: string, today: string): string {
  const fmMatch = raw.match(/^---\n[\s\S]*?\n---\n/);
  if (!fmMatch) {
    throw new Error("glossary.md is missing YAML frontmatter; cannot update last_updated");
  }
  const fm = fmMatch[0];
  if (!/^last_updated:.*$/m.test(fm)) {
    throw new Error("glossary.md frontmatter is missing a last_updated field");
  }
  const newFm = fm.replace(/^last_updated:.*$/m, `last_updated: ${today}`);
  return newFm + raw.slice(fm.length);
}

/**
 * Append new entries to glossary.md and bump `last_updated`. Each entry is
 * round-trip validated first; the file is written atomically (temp + rename)
 * so a mid-write failure cannot corrupt the source.
 */
export async function appendGlossaryEntries(
  rootDir: string,
  items: NewGlossaryItem[],
  today: string,
): Promise<void> {
  if (items.length === 0) return;

  const blocks: string[] = [];
  for (const { entry, provenance } of items) {
    const serialized = serializeEntry(entry, provenance);
    if (!entryRoundTrips(entry, serialized)) {
      console.warn(`[glossary] skipping entry that failed round-trip validation: ${entry.term}`);
      continue;
    }
    blocks.push(serialized);
  }
  if (blocks.length === 0) return;

  const filePath = path.join(rootDir, "glossary.md");
  const raw = await fs.readFile(filePath, "utf8");
  const withDate = bumpLastUpdated(raw, today);
  const next = `${withDate.replace(/\s*$/, "")}\n\n${blocks.join("\n\n")}\n`;

  const tmp = `${filePath}.tmp-${process.pid}`;
  await fs.writeFile(tmp, next, "utf8");
  await fs.rename(tmp, filePath);
}
