/**
 * Translation sources.
 *
 * Each source is a Discourse forum exposing a standard `/latest.rss` feed with
 * `/t/<slug>/<topic_id>` URLs. The RSS parsing (`rss.ts`) and slug extraction
 * (`slug.ts`) are source-agnostic, so adding a forum is just a new entry here.
 *
 * `id` is the single most important field: it keys the per-source ledger in
 * `state.json` and prefixes post filenames. Once a source has shipped, NEVER
 * change its `id` — doing so orphans its state slice and re-translates everything.
 */
export interface Source {
  /** Stable id. Used as the state.json key and the post filename prefix. Immutable. */
  id: string;
  /** Human display name (footer link label, commit messages). */
  name: string;
  /** RSS feed URL, passed straight to fetchFeed(). */
  feedUrl: string;
  /** Forum homepage, used in footer links and about copy. */
  homepage: string;
}

export const SOURCES: readonly Source[] = [
  {
    id: "ethresear",
    name: "Ethereum Research",
    feedUrl: "https://ethresear.ch/latest.rss",
    homepage: "https://ethresear.ch/",
  },
  {
    id: "magicians",
    name: "Ethereum Magicians",
    feedUrl: "https://ethereum-magicians.org/latest.rss",
    homepage: "https://ethereum-magicians.org/",
  },
] as const;

export function sourceById(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}
