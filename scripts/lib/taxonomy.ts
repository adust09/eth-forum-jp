/**
 * Controlled tag vocabulary for the Japanese Ethereum-research site.
 *
 * Why a controlled vocabulary: Quartz's graph view turns every tag into a node
 * and connects all notes that share it. The old behaviour let Gemini invent
 * free-form tags per article, which produced a long tail of single-use tags
 * (`witness-encryption`, `capacity-oracles`, `meta-innovation`, …) plus synonym
 * drift (`zkp` / `zk-proofs` / `zk-snarks` / `zk-s-nt-arks`). Single-use tags
 * connect nothing, so the graph stayed sparse. Tagging against a curated,
 * recurring set is what makes the graph dense and navigable.
 *
 * This module is the single source of truth, used two ways:
 *   - `buildPromptTaxonomy()` injects the vocabulary into Gemini's prompt so
 *     both the daily translator and the one-off re-tag script pick from it.
 *   - `canonicalizeTags()` normalises any tag list (synonym merge, drop noise,
 *     drop malformed/non-ASCII). It runs on BOTH paths so a stray free-form tag
 *     from the model can never reintroduce the long tail.
 */

export interface TagGroup {
  /** Human-readable theme, shown to the model to aid selection. */
  theme: string;
  /** Canonical tags in this theme (lowercase kebab-case). */
  tags: readonly string[];
}

export const TAXONOMY: readonly TagGroup[] = [
  {
    theme: "Consensus & 検証者",
    tags: [
      "consensus",
      "proof-of-stake",
      "pbs",
      "mev",
      "staking",
      "validators",
      "finality",
      "fork-choice",
      "randao",
      "attestations",
    ],
  },
  {
    theme: "Execution layer",
    tags: [
      "execution-layer",
      "evm",
      "account-abstraction",
      "gas",
      "fee-market",
      "smart-contracts",
      "eip",
      "mempool",
      "state-management",
    ],
  },
  {
    theme: "Scaling & L2",
    tags: [
      "scaling",
      "rollup",
      "sharding",
      "data-availability",
      "zkevm",
      "layer2",
    ],
  },
  {
    theme: "Cryptography & 証明",
    tags: [
      "cryptography",
      "zk",
      "snarks",
      "starks",
      "proving",
      "post-quantum",
      "vrf",
      "signatures",
      "commitments",
      "formal-verification",
    ],
  },
  {
    theme: "Networking",
    tags: ["networking", "p2p", "peer-discovery", "client-diversity"],
  },
  {
    theme: "Economics & DeFi",
    tags: [
      "economics",
      "mechanism-design",
      "tokenomics",
      "stablecoins",
      "defi",
      "payments",
      "oracle",
    ],
  },
  {
    theme: "Security & Privacy",
    tags: ["security", "privacy", "fuzzing", "bridges", "cross-chain"],
  },
  {
    theme: "Applications & UX",
    tags: [
      "applications",
      "wallet",
      "identity",
      "ai-agents",
      "ux",
      "decentralization",
    ],
  },
  {
    theme: "Meta",
    tags: ["research", "protocol-design", "governance", "verification"],
  },
] as const;

/** Every canonical tag, flattened. */
export const CANONICAL_TAGS: ReadonlySet<string> = new Set(
  TAXONOMY.flatMap((g) => g.tags),
);

/**
 * Synonyms and historical garbage → canonical tag. Keys are matched after
 * lower-casing the incoming tag, so non-ASCII keys (e.g. 形式検証) are mapped
 * before the ASCII/kebab validation below would otherwise drop them.
 */
const ALIASES: Readonly<Record<string, string>> = {
  // zero-knowledge umbrella
  zkp: "zk",
  "zk-proofs": "zk",
  "zero-knowledge": "zk",
  "zk-snarks": "snarks",
  "zk-s-nt-arks": "snarks",
  snark: "snarks",
  "zk-starks": "starks",
  stark: "starks",
  "native-proof-verification": "proving",
  "evm-verification": "evm",
  // scaling
  scalability: "scaling",
  "layer-2": "layer2",
  l2: "layer2",
  "execution-layer-research": "execution-layer",
  execution: "execution-layer",
  // economics
  cryptocurrency: "economics",
  money: "economics",
  "monetary-theory": "economics",
  commerce: "payments",
  // verification / formal methods
  形式検証: "formal-verification",
  // applications
  "decentralized-applications": "applications",
  dapp: "applications",
  dapps: "applications",
  "smart-contract": "smart-contracts",
  // meta / noise routed to a recurring tag instead of being a one-off
  "meta-innovation": "research",
  "proof-of-concept": "research",
  "blockchain-architecture": "protocol-design",
};

/** Tags with no analytic value as graph nodes; always dropped. */
const NOISE: ReadonlySet<string> = new Set(["uncategorized", "ethereum"]);

/** Shape of a well-formed tag: lowercase kebab-case, ASCII only. */
const KEBAB_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Normalise an arbitrary tag list into the controlled vocabulary:
 *   1. lower-case + trim
 *   2. apply the synonym/garbage alias map
 *   3. drop noise tags (`uncategorized`; `ethereum` is implied by the whole site)
 *   4. drop anything not lowercase-kebab-ASCII (e.g. leftover Japanese)
 *   5. dedupe, preserving first-seen order
 *
 * Free-form tags that are already clean kebab-case pass through unchanged, so
 * genuinely article-specific tags survive while drift and garbage do not.
 */
export function canonicalizeTags(tags: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of tags) {
    const lower = raw.trim().toLowerCase();
    if (!lower) continue;
    const mapped = ALIASES[lower] ?? lower;
    if (NOISE.has(mapped)) continue;
    if (!KEBAB_RE.test(mapped)) continue;
    if (seen.has(mapped)) continue;
    seen.add(mapped);
    out.push(mapped);
  }
  return out;
}

/** Compact, themed listing of the vocabulary for injection into a system prompt. */
export function buildPromptTaxonomy(): string {
  return TAXONOMY.map((g) => `- ${g.theme}: ${g.tags.join(", ")}`).join("\n");
}

/** Discourse category → a single normalised kebab-case tag (pre-canonicalisation). */
export function normalizeCategoryTag(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
