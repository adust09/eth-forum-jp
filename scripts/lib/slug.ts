/**
 * Build a filesystem-safe slug from a Discourse URL.
 * Discourse URLs look like https://<forum>/t/<url-slug>/<topic_id>.
 * We use the URL slug verbatim (it's already kebab-case and ASCII).
 */
export function slugFromLink(link: string): string {
  const m = link.match(/\/t\/([^/]+)\/\d+/);
  if (!m) {
    throw new Error(`could not parse slug from link: ${link}`);
  }
  return m[1].toLowerCase();
}

/**
 * Post filename, namespaced by source id so topic-id spaces from different
 * Discourse forums (which are independent) can never collide on disk.
 */
export function postFileName(sourceId: string, date: string, slug: string, topicId: string): string {
  return `${sourceId}-${date}-${slug}-${topicId}.md`;
}
