/**
 * Daily translation pipeline.
 *
 *   1. fetch https://ethresear.ch/latest.rss
 *   2. for each item not already in state.json:
 *      - HTML → Markdown
 *      - Gemini translate (glossary injected via system prompt)
 *      - write content/posts/<date>-<slug>-<topic_id>.md with frontmatter
 *      - record topic_id in state.json
 *
 * Re-running is safe: posts already in state.json are skipped without an API
 * call (cost-efficient).
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import { fetchFeed, type RssItem } from "./lib/rss.js";
import { htmlToMarkdown } from "./lib/html2md.js";
import { GeminiTranslator, MODEL as GEMINI_MODEL } from "./lib/gemini.js";
import { loadGlossary, buildPromptGlossary } from "./lib/glossary.js";
import { slugFromLink, postFileName } from "./lib/slug.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const STATE_PATH = path.join(ROOT, "scripts", "state.json");
const POSTS_DIR = path.join(ROOT, "content", "posts");

interface State {
  topicIds: string[];
}

async function loadState(): Promise<State> {
  try {
    const raw = await fs.readFile(STATE_PATH, "utf8");
    const parsed = JSON.parse(raw) as State;
    return { topicIds: parsed.topicIds ?? [] };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { topicIds: [] };
    }
    throw err;
  }
}

async function saveState(state: State): Promise<void> {
  // Sort & dedupe for stable diffs across runs.
  const unique = Array.from(new Set(state.topicIds)).sort();
  await fs.writeFile(STATE_PATH, JSON.stringify({ topicIds: unique }, null, 2) + "\n", "utf8");
}

function normalizeCategoryTag(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderPost(
  item: RssItem,
  translated: { title: string; tags: string[]; body: string },
): string {
  const frontmatter = matter.stringify("", {
    title: translated.title,
    original_title: item.title,
    source_url: item.link,
    author: item.author,
    date: item.date,
    category: item.category,
    tags: Array.from(new Set([normalizeCategoryTag(item.category), ...translated.tags])).filter(Boolean),
    topic_id: item.topicId,
    translated_at: new Date().toISOString().slice(0, 10),
    translator: GEMINI_MODEL,
  });

  // Inject a small "原文" callout at the top of the body so readers can always
  // jump to the source without scrolling to the footer.
  const callout = `> [!note] 原文\n> [${item.title}](${item.link}) — ${item.author} (${item.date})\n`;

  return `${frontmatter}${callout}\n${translated.body}\n`;
}

interface RunOptions {
  /** If set, only translate at most this many new items (useful for local smoke tests). */
  limit?: number;
  /** If true, skip writing state and post files. */
  dryRun?: boolean;
}

function isRateLimitError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  return (err as { status?: unknown }).status === 429;
}

function parseArgs(argv: string[]): RunOptions {
  const opts: RunOptions = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--limit") {
      opts.limit = Number(argv[++i]);
    } else if (a === "--dry-run") {
      opts.dryRun = true;
    }
  }
  return opts;
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY env var is required");
  }

  const glossaryEntries = await loadGlossary(ROOT);
  const glossaryContext = buildPromptGlossary(glossaryEntries);
  console.log(`[fetch-and-translate] model: ${GEMINI_MODEL}, glossary terms: ${glossaryEntries.length} (prompt: ${glossaryContext.length} chars)`);

  const translator = new GeminiTranslator(apiKey, glossaryContext);
  const state = await loadState();
  const seen = new Set(state.topicIds);

  const items = await fetchFeed();
  console.log(`[fetch-and-translate] feed items: ${items.length}`);

  const newItems = items.filter((i) => !seen.has(i.topicId));
  console.log(`[fetch-and-translate] new items: ${newItems.length}`);

  const toProcess = opts.limit !== undefined ? newItems.slice(0, opts.limit) : newItems;
  await fs.mkdir(POSTS_DIR, { recursive: true });

  let written = 0;
  let failed = 0;
  let deferred = 0;
  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    try {
      console.log(`[fetch-and-translate] translating: [${item.topicId}] ${item.title}`);
      const sourceMd = htmlToMarkdown(item.html);
      const translated = await translator.translate(sourceMd, item.title);

      const slug = slugFromLink(item.link);
      const file = path.join(POSTS_DIR, postFileName(item.date, slug, item.topicId));
      const out = renderPost(item, translated);

      if (!opts.dryRun) {
        await fs.writeFile(file, out, "utf8");
        state.topicIds.push(item.topicId);
      }
      written++;
      console.log(`[fetch-and-translate]   -> ${path.relative(ROOT, file)}`);
    } catch (err) {
      if (isRateLimitError(err)) {
        // Gemini free-tier daily quota exhausted. Stop here without counting
        // this item as a failure — it stays out of state.json and will be
        // retried on the next scheduled run. Treating this as a hard failure
        // would force a non-zero exit, which (under `set -e` in the workflow)
        // skips the "Open PR" step and loses everything written above.
        deferred = toProcess.length - i;
        console.warn(
          `[fetch-and-translate] Gemini rate limit hit at [${item.topicId}] ${item.title}. ` +
            `Deferring ${deferred} remaining item(s) to the next run.`,
        );
        break;
      }
      failed++;
      console.error(`[fetch-and-translate] FAILED [${item.topicId}] ${item.title}:`, err);
    }
  }

  if (!opts.dryRun) {
    await saveState(state);
  }

  console.log(
    `[fetch-and-translate] done. written=${written} failed=${failed} ` +
      `deferred=${deferred} skipped=${items.length - newItems.length}`,
  );

  // Only treat the run as failed when nothing was written AND a non-rate-limit
  // error occurred. Partial success (some items translated, rest deferred to a
  // later run) must exit 0 so the workflow proceeds to commit & open a PR.
  if (written === 0 && failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
