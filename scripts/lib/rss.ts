import { XMLParser } from "fast-xml-parser";

const FEED_URL = "https://ethresear.ch/latest.rss";

export interface RssItem {
  title: string;
  link: string;
  /** Numeric Discourse topic id parsed from link */
  topicId: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  /** Raw HTML content (was in CDATA) */
  html: string;
  category: string;
  author: string;
  /** Stable feed-provided id */
  guid: string;
}

function parseTopicId(link: string): string {
  // Discourse topic URLs look like:
  //   https://<forum>/t/<slug>/<topic_id>
  const m = link.match(/\/t\/[^/]+\/(\d+)/);
  if (!m) {
    throw new Error(`could not parse topic id from link: ${link}`);
  }
  return m[1];
}

function toISODate(rfc2822: string): string {
  return new Date(rfc2822).toISOString().slice(0, 10);
}

export async function fetchFeed(url: string = FEED_URL): Promise<RssItem[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "ethresear-jp-bot/0.1 (+https://github.com/adust09/ethresear-jp)" },
  });
  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "__cdata",
    textNodeName: "#text",
  });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item;
  if (!Array.isArray(items)) {
    // single-item feed returns object, not array
    return items ? [normalizeItem(items)] : [];
  }
  return items.map(normalizeItem);
}

interface RawItem {
  title?: string | { __cdata?: string };
  link?: string;
  pubDate?: string;
  description?: string | { __cdata?: string };
  category?: string;
  "dc:creator"?: string | { __cdata?: string };
  guid?: string | { "#text"?: string };
}

function unwrap(x: unknown): string {
  if (typeof x === "string") return x;
  if (x && typeof x === "object") {
    const obj = x as Record<string, unknown>;
    if (typeof obj.__cdata === "string") return obj.__cdata;
    if (typeof obj["#text"] === "string") return obj["#text"];
  }
  return "";
}

function normalizeItem(raw: RawItem): RssItem {
  const link = unwrap(raw.link);
  return {
    title: unwrap(raw.title).trim(),
    link,
    topicId: parseTopicId(link),
    date: raw.pubDate ? toISODate(raw.pubDate) : new Date().toISOString().slice(0, 10),
    html: unwrap(raw.description),
    category: unwrap(raw.category).trim() || "uncategorized",
    author: unwrap(raw["dc:creator"]).trim() || "unknown",
    guid: unwrap(raw.guid),
  };
}
