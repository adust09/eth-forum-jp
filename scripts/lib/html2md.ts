import TurndownService from "turndown";

// Minimal shape we need from turndown's HTMLElement-like nodes (works under
// @mixmark-io/domino in Node and the browser DOM).
interface TdNode {
  getAttribute(name: string): string | null;
  querySelectorAll(selector: string): Iterable<TdNode>;
  textContent: string | null;
}

/**
 * Convert Discourse-flavored HTML (as found in ethresear.ch RSS `<description>`)
 * to clean GFM Markdown that preserves images, code blocks, tables, and quotes.
 */
export function htmlToMarkdown(html: string): string {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
    strongDelimiter: "**",
  });

  // Strip Discourse's <a class="anchor"> heading anchors — they leave ugly
  // empty links in the Markdown output.
  td.addRule("strip-heading-anchors", {
    filter: (node) =>
      node.nodeName === "A" &&
      (node as TdNode).getAttribute("class")?.includes("anchor") === true,
    replacement: () => "",
  });

  // <div class="md-table"> just wraps a real <table>. Unwrap it.
  td.addRule("unwrap-md-table", {
    filter: (node) =>
      node.nodeName === "DIV" &&
      (node as TdNode).getAttribute("class") === "md-table",
    replacement: (content) => content,
  });

  // Render <table>/<thead>/<tbody>/<tr>/<th>/<td> as GFM pipe tables.
  td.addRule("gfm-table", {
    filter: "table",
    replacement: (_content, node) => {
      const rows = Array.from((node as TdNode).querySelectorAll("tr"));
      if (rows.length === 0) return "";
      const cellsOf = (tr: TdNode) =>
        Array.from(tr.querySelectorAll("th,td")).map((c) =>
          (c.textContent ?? "").trim().replace(/\|/g, "\\|").replace(/\n+/g, " "),
        );
      const headerCells = cellsOf(rows[0]);
      const sep = headerCells.map(() => "---").join(" | ");
      const headerLine = headerCells.join(" | ");
      const bodyLines = rows.slice(1).map((tr) => cellsOf(tr).join(" | "));
      return ["", `| ${headerLine} |`, `| ${sep} |`, ...bodyLines.map((l) => `| ${l} |`), ""].join("\n");
    },
  });

  // Emoji images: keep as ":high_voltage:" shortcode so we don't pollute the
  // graph with image nodes; Quartz won't render these as images anyway since
  // they have alt text starting with ":".
  td.addRule("emoji-images", {
    filter: (node) =>
      node.nodeName === "IMG" &&
      (node as TdNode).getAttribute("class")?.includes("emoji") === true,
    replacement: (_content, node) => {
      const alt = (node as TdNode).getAttribute("alt") ?? "";
      return alt; // e.g. ":high_voltage:"
    },
  });

  // Default <img> → ![alt](src). Turndown handles this, but force a sane alt.
  td.addRule("clean-img", {
    filter: (node) =>
      node.nodeName === "IMG" &&
      (node as TdNode).getAttribute("class")?.includes("emoji") !== true,
    replacement: (_content, node) => {
      const src = (node as TdNode).getAttribute("src") ?? "";
      const alt = (node as TdNode).getAttribute("alt") ?? "";
      if (!src) return "";
      return `![${alt}](${src})`;
    },
  });

  // <small> wrapping the "N posts - M participants" line is noise — keep it but
  // demote with an italic so Gemini knows it's metadata.
  td.addRule("small-as-em", {
    filter: "small",
    replacement: (content) => `*${content}*`,
  });

  return td.turndown(html).trim();
}
