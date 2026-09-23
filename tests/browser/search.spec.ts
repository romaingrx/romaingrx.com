import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

interface RouteManifest {
  assets: Array<{ files: string[] }>;
}

interface SearchDocument {
  url: string;
  meta: { title?: string };
}

function normalizeSitePath(path: string): string {
  const pathname = new URL(path, 'https://site.test').pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

async function openSearch(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Search' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search posts and notes' });
  await expect(dialog).toBeVisible();
  return dialog;
}

const fakePagefind = `
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const makeResult = (query, index) => {
  const url = '/blog/mock-' + index + '/';
  const title = query === 'safe' ? '<img src=x onerror=alert(1)>' : query + ' result ' + index;
  return {
    data: async () => {
      if (query === 'many' && index >= 5) {
        globalThis.fakeMoreCalls = (globalThis.fakeMoreCalls || 0) + 1;
        await wait(200);
      }
      return {
        url,
        excerpt: 'A <mark>marked</mark> excerpt.',
        meta: { title },
        sub_results: [
          { title, url, excerpt: 'A <mark>marked</mark> excerpt.' },
          { title: 'A distinct section', url: url + '#section', excerpt: 'Section excerpt.' },
        ],
      };
    },
  };
};
export async function search(query) {
  globalThis.fakeSearchQueries = globalThis.fakeSearchQueries || [];
  globalThis.fakeSearchQueries.push(query);
  if (query === 'slow' || query === 'slow-close') await wait(400);
  const count = query === 'many' ? 11 : query === 'empty' ? 0 : 1;
  return { results: Array.from({ length: count }, (_, index) => makeResult(query, index)) };
}
export async function destroy() {}
`;

async function useFakePagefind(page: import('@playwright/test').Page): Promise<void> {
  await page.route('**/pagefind/pagefind.js*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: fakePagefind,
    }),
  );
}

test('Pagefind indexes each published content page once with its article title', async ({
  page,
}) => {
  const manifest = JSON.parse(
    await readFile(resolve('.astro/route-manifest.json'), 'utf8'),
  ) as RouteManifest;
  const distDirectory = resolve('dist/client');
  const htmlPaths = manifest.assets
    .flatMap((asset) => asset.files)
    .map((fileUrl) => fileURLToPath(fileUrl))
    .filter((path) => path.endsWith('.html'));
  const contentPaths = (
    await Promise.all(
      htmlPaths.map(async (htmlPath) => {
        const html = await readFile(htmlPath, 'utf8');
        if (!html.includes('data-pagefind-body')) return null;

        expect(html).toContain('data-pagefind-meta="title"');
        const emittedPath = relative(distDirectory, htmlPath);
        const route =
          emittedPath === 'index.html'
            ? '/'
            : emittedPath.endsWith(`${sep}index.html`)
              ? `${dirname(emittedPath)}/`
              : emittedPath.replace(/\.html$/, '/');
        return normalizeSitePath(`/${route}`);
      }),
    )
  ).filter((path): path is string => path !== null);

  await page.goto('/');
  const actualDocuments = await page.evaluate(async () => {
    const pagefindModule = '/pagefind/pagefind.js';
    const pagefind = (await import(pagefindModule)) as {
      search(
        query: string | null,
      ): Promise<{ results: Array<{ data(): Promise<SearchDocument> }> }>;
    };
    const { results } = await pagefind.search(null);
    const documents = await Promise.all(results.map((result) => result.data()));
    return documents.map(({ url, meta }) => ({ url, title: meta.title }));
  });
  const actualPaths = actualDocuments.map(({ url }) => normalizeSitePath(url)).toSorted();

  expect(contentPaths.length).toBeGreaterThan(0);
  expect(actualPaths).toEqual(contentPaths.toSorted());

  const expectedTitles = await page.evaluate(async (paths) => {
    const documents = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(path);
        const html = await response.text();
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const title = parsed.querySelector('h1[data-pagefind-meta="title"]')?.textContent;
        return [new URL(path, location.href).pathname, title?.trim().replace(/\s+/g, ' ')];
      }),
    );
    return Object.fromEntries(documents);
  }, contentPaths);
  for (const document of actualDocuments) {
    expect(document.title).toBe(expectedTitles[normalizeSitePath(document.url)]);
  }
});

test('search results are ordinary links with native arrow, Enter, and modified-click behavior', async ({
  page,
}) => {
  await page.goto('/blog');
  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  const status = page.locator('#search-status');

  await expect(input).toBeFocused();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+k' : 'Control+k');
  await expect(input).toBeFocused();
  await input.fill('diffusion');

  const titleLink = dialog
    .locator('#search-items')
    .getByRole('link', { name: 'Denoising Diffusion from Scratch', exact: true });
  await expect(titleLink).toBeVisible();
  await expect(status).toContainText(/pages? found\. Showing/);
  await expect(dialog.locator('#search-spinner')).toBeHidden();
  await input.press('ArrowDown');
  await expect(titleLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/blog\/denoising-diffusion-from-scratch\/?$/);
});

test('search anchors preserve modifier clicks', async ({ page }) => {
  await page.goto('/blog');
  const dialog = await openSearch(page);
  await dialog.getByRole('searchbox', { name: 'Search posts and notes' }).fill('diffusion');

  const titleLink = dialog
    .locator('#search-items')
    .getByRole('link', { name: 'Denoising Diffusion from Scratch', exact: true });
  await expect(titleLink).toBeVisible();
  const popupPromise = page.context().waitForEvent('page');
  await titleLink.click({ modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'] });
  const popup = await popupPromise;
  await popup.waitForURL(/\/blog\/denoising-diffusion-from-scratch\/?$/, {
    waitUntil: 'commit',
  });
  await expect(dialog).toBeVisible();
  await popup.close();
});

test('a failed Pagefind module import retries with a fresh module URL', async ({ page }) => {
  await page.goto('/blog');
  let aborted = false;
  const moduleUrls: string[] = [];
  await page.route('**/pagefind/pagefind.js*', async (route) => {
    moduleUrls.push(route.request().url());
    if (!aborted) {
      aborted = true;
      await route.abort();
      return;
    }
    await route.continue();
  });

  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  await input.fill('diffusion');
  const retry = page.getByRole('button', { name: 'Retry' });
  await expect(retry).toBeVisible();
  await expect(dialog.locator('#search-spinner')).toBeHidden();
  await retry.click();
  await expect(input).toBeFocused();
  await expect(
    dialog
      .locator('#search-items')
      .getByRole('link', { name: 'Denoising Diffusion from Scratch', exact: true }),
  ).toBeVisible();
  expect(moduleUrls.length).toBeGreaterThanOrEqual(2);
  expect(new URL(moduleUrls[1]).searchParams.get('retry')).toBe('1');
});

test('a failed Pagefind fragment retries after resetting its cached query data', async ({
  page,
}) => {
  await page.goto('/blog');
  let aborted = false;
  let fragmentRequests = 0;
  await page.context().route('**/pagefind/fragment/*.pf_fragment', async (route) => {
    fragmentRequests += 1;
    if (!aborted) {
      aborted = true;
      await route.abort();
      return;
    }
    await route.continue();
  });

  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  await input.fill('diffusion');
  const retry = page.getByRole('button', { name: 'Retry' });
  await expect(retry).toBeVisible();
  await retry.click();
  await expect(input).toBeFocused();
  await expect(
    dialog
      .locator('#search-items')
      .getByRole('link', { name: 'Denoising Diffusion from Scratch', exact: true }),
  ).toBeVisible();
  expect(fragmentRequests).toBeGreaterThan(1);
});

test('stale searches cannot replace or restore results after a new query, clear, or close', async ({
  page,
}) => {
  await useFakePagefind(page);
  await page.goto('/blog');
  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  const status = page.locator('#search-status');

  await input.fill('slow');
  await page.waitForFunction(() =>
    (window as Window & { fakeSearchQueries?: string[] }).fakeSearchQueries?.includes('slow'),
  );
  await input.fill('fresh');
  await expect(status).toHaveText('1 page found. Showing 1.');
  await expect(
    dialog.locator('#search-items').getByRole('link', { name: 'fresh result 0', exact: true }),
  ).toBeVisible();
  await page.waitForTimeout(450);
  await expect(
    dialog.locator('#search-items').getByRole('link', { name: 'slow result 0', exact: true }),
  ).toHaveCount(0);

  await input.fill('slow');
  await page.waitForFunction(
    () =>
      (window as Window & { fakeSearchQueries?: string[] }).fakeSearchQueries?.filter(
        (query) => query === 'slow',
      ).length === 2,
  );
  await input.fill('');
  await expect(status).toHaveText('Type to search across all content.');
  await expect(dialog.locator('#search-spinner')).toBeHidden();
  await page.waitForTimeout(450);
  await expect(page.locator('#search-items')).toBeHidden();

  await input.fill('slow-close');
  await page.waitForFunction(() =>
    (window as Window & { fakeSearchQueries?: string[] }).fakeSearchQueries?.includes('slow-close'),
  );
  await page.getByRole('button', { name: 'Close search' }).click();
  await expect(dialog).toBeHidden();
  await page.waitForTimeout(450);
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(status).toHaveText('Type to search across all content.');
  await expect(page.locator('#search-items')).toBeHidden();
});

test('Show more loads one batch and preserves focus ownership', async ({ page }) => {
  await useFakePagefind(page);
  await page.goto('/blog');
  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  const status = page.locator('#search-status');
  const items = page.locator('#search-items');
  const more = page.getByRole('button', { name: 'Show more' });

  await input.fill('many');
  await expect(status).toHaveText('11 pages found. Showing 5.');
  const firstBatchLinks = await items.locator('[data-search-link]').count();
  await more.click();
  await page.waitForFunction(
    () => (window as Window & { fakeMoreCalls?: number }).fakeMoreCalls === 5,
  );
  await expect(status).toHaveText('11 pages found. Showing 10.');
  await expect(items.locator('[data-search-link]').nth(firstBatchLinks)).toBeFocused();

  await more.click();
  await page.waitForFunction(
    () => (window as Window & { fakeMoreCalls?: number }).fakeMoreCalls === 6,
  );
  await input.focus();
  await expect(status).toHaveText('11 pages found. Showing 11.');
  await expect(input).toBeFocused();
  await expect(more).toBeHidden();
});

test('search controls remain visible and results scroll in a short viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 320 });
  await useFakePagefind(page);
  await page.goto('/blog');
  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  const close = dialog.getByRole('button', { name: 'Close search' });
  const status = page.locator('#search-status');
  const results = dialog.locator('#search-results');
  const more = dialog.getByRole('button', { name: 'Show more' });

  await input.fill('many');
  await expect(status).toHaveText('11 pages found. Showing 5.');
  await expect(dialog.locator('#search-spinner')).toBeHidden();

  const dialogBox = await dialog.boundingBox();
  const closeBox = await close.boundingBox();
  expect(dialogBox).not.toBeNull();
  expect(closeBox).not.toBeNull();
  expect(dialogBox!.y).toBeGreaterThanOrEqual(0);
  expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(320);
  expect(closeBox!.y).toBeGreaterThanOrEqual(dialogBox!.y);
  expect(closeBox!.y + closeBox!.height).toBeLessThanOrEqual(dialogBox!.y + dialogBox!.height);

  const scrollState = await results.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.clientHeight);
  await more.scrollIntoViewIfNeeded();
  await expect(more).toBeVisible();
  const moreIsInsideScrollport = await more.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const scrollport = element.closest('#search-results')!.getBoundingClientRect();
    return bounds.top >= scrollport.top && bounds.bottom <= scrollport.bottom;
  });
  expect(moreIsInsideScrollport).toBe(true);

  await more.click();
  await expect(status).toHaveText('11 pages found. Showing 10.');
  await expect(close).toBeVisible();
});

test('result titles stay text while Pagefind excerpts keep highlighted marks', async ({ page }) => {
  await useFakePagefind(page);
  await page.goto('/blog');
  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox', { name: 'Search posts and notes' });
  await input.fill('safe');

  const items = page.locator('#search-items');
  await expect(items.locator('a').first()).toHaveText('<img src=x onerror=alert(1)>');
  await expect(items.locator('img, script')).toHaveCount(0);
  await expect(items.locator('mark')).toHaveText('marked');
  await expect(items.locator('a[href="/blog/mock-0/"]')).toHaveCount(1);

  await input.fill('empty');
  await expect(page.locator('#search-status')).toHaveText('No results for “empty”.');
  await expect(items).toBeHidden();
  await expect(dialog.locator('#search-spinner')).toBeHidden();
});
