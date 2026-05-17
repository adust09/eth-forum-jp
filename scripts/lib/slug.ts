/**
 * Build a filesystem-safe slug from a Discourse URL.
 * Discourse URLs look like https://ethresear.ch/t/<url-slug>/<topic_id>.
 * We use the URL slug verbatim (it's already kebab-case and ASCII).
 */
export function slugFromLink(link: string): string {
  const m = link.match(/\/t\/([^/]+)\/\d+/);
  if (!m) {
    throw new Error(`could not parse slug from link: ${link}`);
  }
  return m[1].toLowerCase();
}

export function postFileName(date: string, slug: string, topicId: string): string {
  return `${date}-${slug}-${topicId}.md`;
}
