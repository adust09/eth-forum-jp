const STORAGE_KEY = "posts-sort"
type SortMode = "category" | "date"

function applyMode(container: Element, mode: SortMode) {
  for (const view of container.querySelectorAll<HTMLElement>(".listing-view")) {
    view.classList.toggle("hidden", view.dataset.view !== mode)
  }
  for (const button of container.querySelectorAll<HTMLElement>(".sort-toggle-btn")) {
    const active = button.dataset.sort === mode
    button.classList.toggle("active", active)
    button.setAttribute("aria-pressed", String(active))
  }
}

document.addEventListener("nav", () => {
  const container = document.querySelector(".sort-toggle-container")
  if (!container) return

  const stored = localStorage.getItem(STORAGE_KEY)
  const initial: SortMode = stored === "date" ? "date" : "category"
  applyMode(container, initial)

  for (const button of container.querySelectorAll<HTMLElement>(".sort-toggle-btn")) {
    const onClick = () => {
      const mode: SortMode = button.dataset.sort === "date" ? "date" : "category"
      localStorage.setItem(STORAGE_KEY, mode)
      applyMode(container, mode)
    }
    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
  }
})
