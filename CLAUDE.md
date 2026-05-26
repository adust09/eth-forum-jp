# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A daily translation pipeline that turns posts from multiple Ethereum Discourse forums (currently [ethresear.ch](https://ethresear.ch/) and [ethereum-magicians.org](https://ethereum-magicians.org/)) into a Japanese-language [Quartz](https://quartz.jzhao.xyz/) graph site. There is no application server — everything is offline batch jobs + static-site generation + Cloudflare Workers Static Assets.

The set of forums is defined in `scripts/lib/sources.ts` (`SOURCES`); adding a Discourse forum is a one-line entry there. Each source has a stable `id` used both as the `state.json` ledger key and the post filename prefix — these ids are immutable once shipped.

End-to-end flow:

1. GitHub Actions (`.github/workflows/translate.yml`) runs daily at 00:00 UTC.
2. `scripts/fetch-and-translate.ts` pulls each source's `/latest.rss`, diffs against that source's slice in `scripts/state.json` (per-source topic-id ledger), translates new items via Gemini, and writes `content/posts/<source>-<date>-<slug>-<topic_id>.md`.
3. The action opens a PR. Merging to `main` triggers a Cloudflare Workers build that runs Quartz over `content/` and publishes `./public/`.

## Common commands

```sh
npm install                  # root deps (translation pipeline)
cp .env.example .env         # then fill in GEMINI_API_KEY
npm run expand-glossary      # glossary.md  -> content/glossary/*.md
npm run fetch-translate      # RSS -> Gemini -> content/posts/*.md
npm run dev                  # Quartz local server at http://localhost:8080
npm run build                # Quartz build -> ./public
npm run typecheck            # tsc --noEmit over scripts/**

# Single-item smoke test without committing state:
node --import tsx scripts/fetch-and-translate.ts --limit 1 --dry-run

# Translate at most N new posts (used by workflow_dispatch):
node --import tsx scripts/fetch-and-translate.ts --limit 1
```

Node 22+ is required (enforced by `package.json` engines and the workflows).

There is no test suite. Verification is: `npm run typecheck` + `npm run expand-glossary` (must leave `content/glossary/` clean) + a Quartz build. CI (`.github/workflows/build-check.yml`) runs exactly these on every PR touching `content/`, `quartz/`, `scripts/`, `glossary.md`, or package files.

## Architecture

### The pipeline (`scripts/`)

`fetch-and-translate.ts` orchestrates one run. It loops over `SOURCES`, and for each source fetches its feed and diffs against that source's ledger slice. It is **idempotent by design** — every translated post's `topicId` is appended to its source's slice in `scripts/state.json`, and items in that set are skipped without an API call. Never delete `state.json` casually; doing so re-translates everything and burns Gemini quota. Gemini quota is shared across sources, so a 429 stops the whole run (remaining items deferred to the next run). Two CLI flags support multi-source ops: `--source <id>` restricts a run to one source, and `--seed <id>` records a source's current feed window as already-seen **without translating** (zero API calls) — used to start a newly-added source go-forward.

Helpers live under `scripts/lib/`:

- **`sources.ts`** — `SOURCES` registry (the single source of truth for which forums to translate) and `sourceById`. Each `Source` has `id` (stable ledger key + filename prefix), `name`, `feedUrl`, `homepage`.
- **`rss.ts`** — fetches a Discourse RSS feed (`fetchFeed(url)`) and normalizes each `<item>` (extracts `topicId` from the `/t/<slug>/<id>` URL). Source-agnostic across Discourse instances.
- **`html2md.ts`** — Turndown with custom rules tuned for Discourse: strips `<a class="anchor">` heading anchors, unwraps `<div class="md-table">`, renders `<table>` as GFM pipe tables, keeps `:emoji:` shortcodes as text instead of `<img>`.
- **`gemini.ts`** — `GeminiTranslator` wraps `@google/generative-ai`. Default model is `gemini-2.5-flash` (free tier); override with `GEMINI_MODEL=gemini-2.5-pro` if billing is on. The system prompt is loaded once with `{{GLOSSARY}}` substituted; the model must emit a strict `---TITLE---/---TAGS---/---BODY---` envelope, parsed by `parseTranslationOutput`. Temperature 0.3, `maxOutputTokens: 32768` (long posts run 30K+ tokens).
- **`glossary.ts`** — parses `glossary.md` (a hand-rolled `## term` + indented YAML-ish body format, **not** standard YAML — see `parseEntryBody`). Exposes `loadGlossary` and `buildPromptGlossary` (the compact one-line-per-term string injected into Gemini's system prompt). Also exposes the **write side** used by auto-update: `serializeEntry` (renders one entry back into the hand-rolled format, with `auto_*` provenance markers), `appendGlossaryEntries` (round-trip-validates each entry, bumps `last_updated`, writes atomically via temp + rename), and `buildSurfaceFormSet` (dedup set of every term/alias/slug).
- **`glossary-extract.ts`** — `GlossaryExtractor` makes a **separate** Gemini call (independent of the translation envelope) that scans a post's source Markdown for not-yet-known Ethereum-research jargon and returns structured JSON candidates. Output is validated as a trust boundary with **Zod** (`ExtractedTermSchema`): array truncated to 5, each element validated individually and bad ones dropped. `responseSchema` only guides the model.
- **`slug.ts`** — Discourse already gives us kebab-case slugs in its URLs, so we reuse them verbatim.

`expand-glossary.ts` is a separate, no-network script. It regenerates each term page + an `index.md` from `glossary.md` by rendering everything in memory, writing to a temp dir, then swapping atomically (a failure leaves the existing pages intact). Page `date` frontmatter comes from `glossary.md`'s `last_updated` (not "today"), so daily runs don't churn dates. It exports `expandGlossary(rootDir)` for reuse and is guarded by an ESM entrypoint check so importing it has no side effects. Run it whenever `glossary.md` changes; CI warns if `content/glossary/` is out of sync.

### Glossary contract (important)

`glossary.md` is the terminology source. It is **human-edited and also auto-appended by the pipeline**: after each post is translated, `GlossaryExtractor` proposes new terms which `fetch-and-translate.ts` writes directly into `glossary.md` (auto-merged with the daily PR — no human review). Auto-added entries carry `auto_added` / `auto_source_topic_id` / `auto_source_url` markers; `loadGlossary` ignores these unknown keys. Each entry must have a `## Term` heading and at minimum a `ja:` field. The pipeline uses it two ways:

1. **Pre-render**: `expand-glossary.ts` materializes `content/glossary/<slug>.md` with frontmatter `aliases:` that includes the Japanese display name + all English variants. Quartz wikilink resolution then folds every surface form to the same page.
2. **Translation-time**: `buildPromptGlossary` produces a compact map (`"Term" / "Alias1" / "Alias2" → [[glossary/<slug>|<日本語>]]`) injected into the Gemini system prompt. Rule 6 of the prompt instructs the model to replace the **first** occurrence of any term in a post with the wikilink form, and use the plain Japanese label thereafter.

**Same-run caveat**: the translator is built once before the loop, so auto-added terms only become wikilinkable in **future** runs, not the run that discovered them.

When adding a new term by hand: edit `glossary.md` only, then re-run `npm run expand-glossary`. Don't touch `content/glossary/*.md` directly — they're regenerated and any manual edits will be wiped. The auto-update path writes to `glossary.md` (never directly to `content/glossary/`), so it follows the same contract.

### Post output shape (`content/posts/<source>-<date>-<slug>-<topic_id>.md`)

Filenames are prefixed with the source `id` (e.g. `ethresear-…`, `magicians-…`) so the independent topic-id spaces of different Discourse forums can't collide on disk. (Posts created before multi-source support keep their original prefix-less names to preserve their published URLs.)

Frontmatter is produced by `renderPost` in `fetch-and-translate.ts`. Required keys: `title`, `original_title`, `source` (stable source id), `source_name` (display name), `source_url`, `author`, `date`, `category`, `tags`, `topic_id`, `translated_at`, `translator`. The body always opens with a `> [!note] 原文` callout linking to the source URL — this is added in code, not by the model, so the link survives even if translation fails partway.

### Quartz (`quartz/`)

Vendored copy of [Quartz v4](https://github.com/jackyzha0/quartz) at the repo root. Treat it as a build tool: `npm run dev` and `npm run build` `cd` into it and call `npx quartz`. Quartz has its own `package.json` and `npm ci` step (the Cloudflare build command runs both `npm ci` at root and inside `quartz/`).

Avoid edits to `quartz/` unless intentionally customizing the renderer. Quartz config lives in `quartz/quartz.config.ts` and `quartz/quartz.layout.ts`.

### Deployment (`wrangler.jsonc`)

Cloudflare Workers + Static Assets serves `./public/` directly — no JS handler. The Cloudflare dashboard must be configured with the build command that runs `npm ci` (root and `quartz/`) and `npx quartz build`; leaving the build command empty makes `wrangler deploy` fail because `./public/` doesn't exist yet. The README's "デプロイ" section has the exact dashboard settings.

`git fetch --unshallow` is part of the build command because Quartz reads git history to compute per-file last-modified dates.

## Editing rules specific to this repo

- **Never `git add -A`.** Untracked `state.json` deltas, draft glossary edits, and local `.env` files are easy to leak. The daily workflow explicitly stages only `content/posts content/glossary scripts/state.json`; mirror that pattern for manual commits.
- **All Markdown under `content/` must have YAML frontmatter** (Quartz requirement). The global `docs/` frontmatter rule from the user's CLAUDE.md does *not* apply here — there is no `docs/` directory; `content/` is the published surface and uses a different frontmatter shape (see "Post output shape" above).
- **`scripts/state.json` is a ledger, not config.** It will grow over time. Its shape is a per-source map (`{ "<source-id>": ["topicId", …] }`); `loadState()` transparently migrates the legacy flat `{ "topicIds": [...] }` shape (all such ids belong to `ethresear`). Don't sort/format it manually — `saveState()` rewrites each slice sorted + deduped.
- **`content/glossary/` and `content/posts/index.md` are generated/templated.** Edit `glossary.md` or the relevant script, not the output files.
- **The Gemini output parser is strict.** If you change the system prompt's `---TITLE---/---TAGS---/---BODY---` envelope in `gemini.ts`, update `SECTION_RE` in the same file or every translation will throw.
