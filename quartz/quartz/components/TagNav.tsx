import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

interface Options {
  title: string
  // Maximum number of tags to show as pills before linking to the full tag index.
  limit: number
  showCount: boolean
}

const defaultOptions: Options = {
  title: "トピックで絞り込む",
  limit: 20,
  showCount: true,
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { ...defaultOptions, ...userOpts }

  const TagNav: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    // Aggregate tag frequencies from articles only (posts/), so the nav stays an
    // article-filtering entry point rather than mixing in glossary terms.
    const counts = new Map<string, number>()
    for (const file of allFiles) {
      if (!file.slug?.startsWith("posts/")) continue
      for (const tag of file.frontmatter?.tags ?? []) {
        // "index" is reserved by the TagPage emitter for the /tags/ index itself.
        if (tag === "index") continue
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }

    if (counts.size === 0) {
      return null
    }

    // Most frequent first, ties broken alphabetically.
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    const shown = sorted.slice(0, opts.limit)
    const hasMore = sorted.length > opts.limit

    return (
      <div class={classNames(displayClass, "tag-nav")}>
        <h3>{opts.title}</h3>
        <ul class="tags">
          {shown.map(([tag, count]) => (
            <li>
              <a class="internal tag-link" href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>
                {tag}
                {opts.showCount && <span class="count">{count}</span>}
              </a>
            </li>
          ))}
        </ul>
        {hasMore && (
          <p class="tag-nav-all">
            <a class="internal" href={resolveRelative(fileData.slug!, "tags/index" as FullSlug)}>
              すべてのタグ ({sorted.length}) →
            </a>
          </p>
        )}
      </div>
    )
  }

  TagNav.css = `
.tag-nav {
  & > h3 {
    font-size: 1rem;
    margin: 0 0 0.5rem;
  }

  & > ul.tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding-left: 0;
    margin: 0;
  }

  & > ul.tags > li {
    display: inline-block;
    margin: 0;
    white-space: nowrap;
  }

  & a.internal.tag-link {
    border-radius: 8px;
    background-color: var(--highlight);
    padding: 0.2rem 0.4rem;
    margin: 0;
  }

  & a.internal.tag-link .count {
    margin-left: 0.3rem;
    opacity: 0.6;
    font-size: 0.8em;
  }

  & .tag-nav-all {
    margin: 0.6rem 0 0;
    font-size: 0.85rem;
  }
}

@media (max-width: 800px) {
  .tag-nav {
    display: none;
  }
}
`

  return TagNav
}) satisfies QuartzComponentConstructor
