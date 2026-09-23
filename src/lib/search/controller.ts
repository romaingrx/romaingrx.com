import { enableBackdropDismissal, showModal } from '@/lib/dialog';

import { resetPagefind, searchPagefind, type PagefindQuery } from './pagefind';
import { appendSearchResults } from './render-results';

const PAGE_SIZE = 5;
const DEBOUNCE_MS = 100;

function hide(element: HTMLElement): void {
  element.classList.add('hidden');
}

function show(element: HTMLElement): void {
  element.classList.remove('hidden');
}

export function initializeSearch(): void {
  const dialog = document.getElementById('search-dialog') as HTMLDialogElement;
  const input = document.getElementById('search-input') as HTMLInputElement;
  const trigger = document.getElementById('search-trigger') as HTMLButtonElement;
  const closeButton = document.getElementById('search-close') as HTMLButtonElement;
  const resultsPanel = document.getElementById('search-panel') as HTMLElement;
  const status = document.getElementById('search-status') as HTMLElement;
  const spinner = document.getElementById('search-spinner') as HTMLElement;
  const resultList = document.getElementById('search-items') as HTMLUListElement;
  const retryButton = document.getElementById('search-retry') as HTMLButtonElement;
  const moreButton = document.getElementById('search-more') as HTMLButtonElement;
  const shortcutHint = document.getElementById('search-shortcut-hint');

  if (
    !dialog ||
    !input ||
    !trigger ||
    !closeButton ||
    !resultsPanel ||
    !status ||
    !spinner ||
    !resultList ||
    !retryButton ||
    !moreButton
  ) {
    return;
  }

  const platform = navigator.userAgent;
  if (shortcutHint)
    shortcutHint.textContent = /mac|iphone|ipad|ipod/i.test(platform) ? '⌘K' : 'Ctrl+K';

  let requestId = 0;
  let timer: number | undefined;
  let queryResults: PagefindQuery | undefined;
  let activeQuery = '';
  let displayedCount = 0;

  function invalidate(): number {
    requestId += 1;
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
    return requestId;
  }

  function setIdle(): void {
    resultsPanel.setAttribute('aria-busy', 'false');
    status.textContent = 'Type to search across all content.';
    hide(spinner);
    hide(resultList);
    hide(retryButton);
    hide(moreButton);
    resultList.replaceChildren();
  }

  function setLoading(message: string, keepMore = false): void {
    resultsPanel.setAttribute('aria-busy', 'true');
    status.textContent = message;
    show(spinner);
    hide(retryButton);
    if (keepMore) {
      moreButton.setAttribute('aria-disabled', 'true');
      show(moreButton);
    } else hide(moreButton);
  }

  function setEmpty(query: string): void {
    resultsPanel.setAttribute('aria-busy', 'false');
    status.textContent = `No results for “${query}”.`;
    hide(spinner);
    hide(resultList);
    hide(retryButton);
    hide(moreButton);
    resultList.replaceChildren();
  }

  function setError(): void {
    resultsPanel.setAttribute('aria-busy', 'false');
    status.textContent = 'Search failed. Try again.';
    hide(spinner);
    show(retryButton);
    hide(moreButton);
  }

  function setResultStatus(): void {
    if (!queryResults) return;

    const pageLabel = queryResults.pageCount === 1 ? 'page' : 'pages';
    status.textContent = `${queryResults.pageCount} ${pageLabel} found. Showing ${displayedCount}.`;
    resultsPanel.setAttribute('aria-busy', 'false');
    hide(spinner);
    hide(retryButton);
    show(resultList);
    if (displayedCount < queryResults.pageCount) {
      moreButton.removeAttribute('aria-disabled');
      show(moreButton);
    } else hide(moreButton);
  }

  function isCurrent(id: number, query: string): boolean {
    return requestId === id && dialog.open && input.value.trim() === query;
  }

  async function loadMore(query: string, id: number): Promise<void> {
    if (!queryResults) return;

    const start = displayedCount;
    const end = Math.min(start + PAGE_SIZE, queryResults.pageCount);
    setLoading(start === 0 ? 'Loading results…' : 'Loading more results…', start > 0);

    try {
      const nextPage = await queryResults.load(start, end);
      if (!isCurrent(id, query)) return;
      const focusMoreAfterLoad = start > 0 && document.activeElement === moreButton;
      const firstNewResult = resultList.childElementCount;
      appendSearchResults(resultList, nextPage);
      displayedCount += nextPage.length;
      setResultStatus();
      if (focusMoreAfterLoad) {
        resultList.children[firstNewResult]
          ?.querySelector<HTMLAnchorElement>('[data-search-link]')
          ?.focus();
      }
    } catch {
      if (isCurrent(id, query)) {
        const focusRetry = document.activeElement === moreButton;
        setError();
        if (focusRetry) retryButton.focus();
      }
    }
  }

  async function runQuery(query: string, id: number, reset = false): Promise<void> {
    setLoading(reset ? 'Retrying search…' : 'Searching…');

    try {
      if (reset) await resetPagefind();
      if (!isCurrent(id, query)) return;
      const result = await searchPagefind(query);
      if (!isCurrent(id, query)) return;

      queryResults = result;
      displayedCount = 0;
      if (result.pageCount === 0) {
        setEmpty(query);
        return;
      }
      await loadMore(query, id);
    } catch {
      if (isCurrent(id, query)) setError();
    }
  }

  function queryChanged(): void {
    const id = invalidate();
    const query = input.value.trim();
    queryResults = undefined;
    activeQuery = query;
    displayedCount = 0;
    resultList.replaceChildren();

    if (!query) {
      setIdle();
      return;
    }

    setLoading('Searching…');
    timer = window.setTimeout(() => void runQuery(query, id), DEBOUNCE_MS);
  }

  function retry(): void {
    const query = input.value.trim();
    if (!query) return;

    const id = invalidate();
    queryResults = undefined;
    displayedCount = 0;
    resultList.replaceChildren();
    input.focus();
    void runQuery(query, id, true);
  }

  function showMore(): void {
    if (
      !queryResults ||
      displayedCount >= queryResults.pageCount ||
      moreButton.getAttribute('aria-disabled') === 'true'
    ) {
      return;
    }

    const id = invalidate();
    moreButton.focus();
    void loadMore(activeQuery, id);
  }

  function resetSearch(): void {
    invalidate();
    input.value = '';
    queryResults = undefined;
    activeQuery = '';
    displayedCount = 0;
    setIdle();
  }

  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    showModal(dialog, trigger);
    input.focus();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', resetSearch);
  input.addEventListener('input', queryChanged);
  retryButton.addEventListener('click', retry);
  moreButton.addEventListener('click', showMore);
  enableBackdropDismissal(dialog);

  document.addEventListener('keydown', (event) => {
    if (
      event.defaultPrevented ||
      event.key.toLowerCase() !== 'k' ||
      !(event.metaKey || event.ctrlKey)
    ) {
      return;
    }

    event.preventDefault();
    if (dialog.open) {
      input.focus();
      return;
    }

    const activeElement = document.activeElement;
    showModal(dialog, activeElement instanceof HTMLElement ? activeElement : trigger);
    input.focus();
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const links = Array.from(resultList.querySelectorAll<HTMLAnchorElement>('[data-search-link]'));
    if (links.length === 0) return;

    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (document.activeElement !== input && current === -1) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      links[(current + 1) % links.length].focus();
    } else if (current <= 0) {
      event.preventDefault();
      input.focus();
    } else {
      event.preventDefault();
      links[current - 1].focus();
    }
  });
}
