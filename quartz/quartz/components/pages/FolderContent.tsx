import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn, byDateAndAlphabetical } from "../PageList"
import { getDate } from "../Date"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
// @ts-ignore
import sortToggleScript from "../scripts/sortToggle.inline"

interface FolderContentOptions {
  /**
   * Whether to display number of folders
   */
  showFolderCount: boolean
  showSubfolders: boolean
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) {
      return null
    }

    const allPagesInFolder: QuartzPluginData[] =
      folder.children
        .map((node) => {
          // regular file, proceed
          if (node.data) {
            return node.data
          }

          if (node.isFolder && options.showSubfolders) {
            // folders that dont have data need synthetic files
            const getMostRecentDates = (): QuartzPluginData["dates"] => {
              let maybeDates: QuartzPluginData["dates"] | undefined = undefined
              for (const child of node.children) {
                if (child.data?.dates) {
                  // compare all dates and assign to maybeDates if its more recent or its not set
                  if (!maybeDates) {
                    maybeDates = { ...child.data.dates }
                  } else {
                    if (child.data.dates.created > maybeDates.created) {
                      maybeDates.created = child.data.dates.created
                    }

                    if (child.data.dates.modified > maybeDates.modified) {
                      maybeDates.modified = child.data.dates.modified
                    }

                    if (child.data.dates.published > maybeDates.published) {
                      maybeDates.published = child.data.dates.published
                    }
                  }
                }
              }
              return (
                maybeDates ?? {
                  created: new Date(),
                  modified: new Date(),
                  published: new Date(),
                }
              )
            }

            return {
              slug: node.slug,
              dates: getMostRecentDates(),
              frontmatter: {
                title: node.displayName,
                tags: [],
              },
            }
          }
        })
        .filter((page) => page !== undefined) ?? []
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: allPagesInFolder,
    }

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    // Opt-in via the folder index page's `groupBy: category` frontmatter:
    // render one section per Discourse category instead of a single flat list.
    const groupByCategory = fileData.frontmatter?.groupBy === "category"

    const renderCategoryGroups = () => {
      const groups = new Map<string, QuartzPluginData[]>()
      for (const page of allPagesInFolder) {
        const category = (page.frontmatter?.category as string | undefined) ?? "Uncategorized"
        const bucket = groups.get(category)
        if (bucket) {
          bucket.push(page)
        } else {
          groups.set(category, [page])
        }
      }

      // Order categories so the one with the most recently published post comes first.
      const mostRecent = (pages: QuartzPluginData[]): number =>
        Math.max(...pages.map((page) => getDate(cfg, page)?.getTime() ?? 0))
      const orderedCategories = [...groups.entries()].sort(
        ([, a], [, b]) => mostRecent(b) - mostRecent(a),
      )

      return orderedCategories.map(([category, pages]) => (
        <section class="category-section">
          <h2 class="category-heading">{category}</h2>
          <PageList {...props} allFiles={pages} sort={byDateAndAlphabetical(cfg)} />
        </section>
      ))
    }

    const renderListing = () => {
      if (!groupByCategory) {
        return <PageList {...listProps} />
      }

      // Render both views; a client-side toggle (sortToggle.inline) shows one at a
      // time and persists the choice in localStorage. Category view is the default
      // (and the only one visible when JS is disabled).
      return (
        <div class="sort-toggle-container">
          <div class="sort-toggle" role="group" aria-label="並び順">
            <button type="button" class="sort-toggle-btn" data-sort="category">
              カテゴリ別
            </button>
            <button type="button" class="sort-toggle-btn" data-sort="date">
              日付順
            </button>
          </div>
          <div class="listing-view" data-view="category">
            {renderCategoryGroups()}
          </div>
          <div class="listing-view hidden" data-view="date">
            <PageList {...props} allFiles={allPagesInFolder} sort={byDateAndAlphabetical(cfg)} />
          </div>
        </div>
      )
    }

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        <div class="page-listing">
          {options.showFolderCount && (
            <p>
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: allPagesInFolder.length,
              })}
            </p>
          )}
          <div>{renderListing()}</div>
        </div>
      </div>
    )
  }

  FolderContent.css = concatenateResources(style, PageList.css)
  FolderContent.afterDOMLoaded = sortToggleScript
  return FolderContent
}) satisfies QuartzComponentConstructor
