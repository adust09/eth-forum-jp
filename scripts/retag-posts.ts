/**
 * One-off backfill: re-tag existing translated posts against the controlled
 * vocabulary in scripts/lib/taxonomy.ts, so the Quartz graph view connects
 * articles through recurring tags instead of a long tail of single-use ones.
 *
 * Reads each content/posts/*.md, sends its title + body to Gemini for
 * classification (GeminiTagger), merges the result with the post's category
 * tag, canonicalises, and rewrites only the `tags:` frontmatter — every other
 * field is preserved. Writes are atomic (temp + rename) and per-file, so a
 * mid-run rate limit leaves already-processed files saved.
 *
 *   node --import tsx scripts/retag-posts.ts                 # all posts
 *   node --import tsx scripts/retag-posts.ts --limit 5       # first 5 posts
 *   node --import tsx scripts/retag-posts.ts --dry-run       # print, don't write
 *   node --import tsx scripts/retag-posts.ts --only oracles  # filename substring
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import { GeminiTagger } from "./lib/tagger.js";
import {
  buildPromptTaxonomy,
  canonicalizeTags,
  normalizeCategoryTag,
} from "./lib/taxonomy.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "content", "posts");

interface Options {
  limit?: number;
  dryRun?: boolean;
  only?: string;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--limit") opts.limit = Number(argv[++i]);
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--only") opts.only = argv[++i];
  }
  return opts;
}

function isRateLimitError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  return (err as { status?: unknown }).status === 429;
}

/** Atomic write: temp file in the same dir, then rename over the target. */
async function writeAtomic(file: string, content: string): Promise<void> {
  const tmp = `${file}.tmp-${process.pid}`;
  await fs.writeFile(tmp, content, "utf8");
  await fs.rename(tmp, file);
}

async function listPosts(only?: string): Promise<string[]> {
  const entries = await fs.readdir(POSTS_DIR);
  return entries
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .filter((f) => (only ? f.includes(only) : true))
    .sort()
    .map((f) => path.join(POSTS_DIR, f));
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY env var is required");

  const tagger = new GeminiTagger(apiKey, buildPromptTaxonomy());
  let files = await listPosts(opts.only);
  if (opts.limit !== undefined) files = files.slice(0, opts.limit);

  console.log(`[retag-posts] ${files.length} post(s) to process${opts.dryRun ? " (dry-run)" : ""}`);

  let updated = 0;
  let unchanged = 0;
  let failed = 0;
  let deferred = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rel = path.relative(ROOT, file);
    try {
      const raw = await fs.readFile(file, "utf8");
      const parsed = matter(raw);
      const data = parsed.data as Record<string, unknown>;
      const title = typeof data.title === "string" ? data.title : "";
      const category = typeof data.category === "string" ? data.category : "";

      const classified = await tagger.tag(title, parsed.content);
      const merged = canonicalizeTags([normalizeCategoryTag(category), ...classified]);

      if (merged.length === 0) {
        console.warn(`[retag-posts] ${rel}: classifier returned no usable tags, leaving as-is`);
        unchanged++;
        continue;
      }

      const before = Array.isArray(data.tags) ? (data.tags as string[]).join(",") : "";
      if (before === merged.join(",")) {
        unchanged++;
        console.log(`[retag-posts] = ${rel} (${merged.join(", ")})`);
        continue;
      }

      if (opts.dryRun) {
        console.log(`[retag-posts] ~ ${rel}\n    old: ${before}\n    new: ${merged.join(", ")}`);
      } else {
        const out = matter.stringify(parsed.content, { ...data, tags: merged });
        await writeAtomic(file, out);
        console.log(`[retag-posts] ~ ${rel} -> ${merged.join(", ")}`);
      }
      updated++;
    } catch (err) {
      if (isRateLimitError(err)) {
        deferred = files.length - i;
        console.warn(
          `[retag-posts] Gemini rate limit hit at ${rel}. ` +
            `${deferred} post(s) left — re-run later to continue (processed files are saved).`,
        );
        break;
      }
      failed++;
      console.error(`[retag-posts] FAILED ${rel}:`, err);
    }
  }

  console.log(
    `[retag-posts] done. updated=${updated} unchanged=${unchanged} failed=${failed} deferred=${deferred}`,
  );
  if (updated === 0 && failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
