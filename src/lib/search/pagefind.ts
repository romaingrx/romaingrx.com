export interface PagefindSection {
  title: string;
  url: string;
  excerpt: string;
}

export interface PagefindDocument {
  url: string;
  excerpt: string;
  meta: { title?: string; description?: string };
  sub_results?: PagefindSection[];
}

interface PagefindResult {
  data(): Promise<PagefindDocument>;
}

interface PagefindModule {
  destroy(): void | Promise<void>;
  search(query: string): Promise<{ results: PagefindResult[] }>;
}

export interface PagefindQuery {
  pageCount: number;
  load(start: number, end: number): Promise<PagefindDocument[]>;
}

let pagefindPromise: Promise<PagefindModule> | undefined;
let failedImports = 0;
let resetPromise: Promise<void> | undefined;

function loadModule(): Promise<PagefindModule> {
  if (pagefindPromise) return pagefindPromise;

  const path =
    failedImports === 0 ? '/pagefind/pagefind.js' : `/pagefind/pagefind.js?retry=${failedImports}`;
  let cachedPromise: Promise<PagefindModule>;
  cachedPromise = (import(/* @vite-ignore */ path) as Promise<PagefindModule>).catch((error) => {
    if (pagefindPromise === cachedPromise) {
      pagefindPromise = undefined;
      failedImports += 1;
    }
    throw error;
  });
  pagefindPromise = cachedPromise;
  return cachedPromise;
}

export async function searchPagefind(query: string): Promise<PagefindQuery> {
  const pagefind = await loadModule();
  await resetPromise;
  const { results } = await pagefind.search(query);

  return {
    pageCount: results.length,
    load: (start, end) => Promise.all(results.slice(start, end).map((result) => result.data())),
  };
}

export async function resetPagefind(): Promise<void> {
  const pagefind = await pagefindPromise?.catch(() => undefined);
  if (!pagefind || resetPromise) return resetPromise;

  const resetting = Promise.resolve(pagefind.destroy());
  resetPromise = resetting;
  try {
    await resetting;
  } finally {
    if (resetPromise === resetting) resetPromise = undefined;
  }
}
