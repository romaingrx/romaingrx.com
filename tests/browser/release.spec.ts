import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

interface RouteManifest {
  assets: Array<{ files: string[] }>;
}

test('note sharing uses its canonical notes URL', async ({ page }) => {
  await page.goto('/notes/cuda-mental-model');

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const sharing = page.locator('[data-content-share]');
  await expect(sharing).toHaveCount(1);
  expect(canonical).toBeTruthy();
  await expect(sharing.locator('[data-share-url]')).toHaveValue(canonical!);

  const shareTargets = await sharing.locator('a[href]').evaluateAll((links) =>
    links.map((link) => {
      const target = new URL((link as HTMLAnchorElement).href);
      return target.searchParams.get('url') ?? target.searchParams.get('u');
    }),
  );

  expect(shareTargets.length).toBeGreaterThan(0);
  expect(shareTargets.every((target) => target === canonical)).toBe(true);
});

test('emitted pages have their site landmarks and no empty link destinations', async ({ page }) => {
  const routeManifest = JSON.parse(
    await readFile('.astro/route-manifest.json', 'utf8'),
  ) as RouteManifest;
  const htmlFiles = [
    ...new Set(
      routeManifest.assets
        .flatMap(({ files }) => files)
        .filter((file) => file.endsWith('.html'))
        .map((file) => fileURLToPath(file)),
    ),
  ];
  expect(htmlFiles.length).toBeGreaterThan(0);

  await page.goto('/');
  const audits = await Promise.all(
    htmlFiles.map(async (file) => {
      const source = await readFile(file, 'utf8');
      const audit = await page.evaluate((html) => {
        const document = new DOMParser().parseFromString(html, 'text/html');
        const emptyLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
          .filter((link) => !link.getAttribute('href')?.trim())
          .map((link) => link.outerHTML.slice(0, 160));
        const landmarks = {
          main: document.querySelectorAll('main').length,
          banner: Array.from(document.querySelectorAll('header')).filter(
            (element) => !element.closest('article, aside, main, nav, section'),
          ).length,
          contentinfo: Array.from(document.querySelectorAll('footer')).filter(
            (element) => !element.closest('article, aside, main, nav, section'),
          ).length,
        };
        return { landmarks, emptyLinks };
      }, source);

      return { file, audit };
    }),
  );

  for (const { file, audit } of audits) {
    expect(audit.landmarks, file).toEqual({ main: 1, banner: 1, contentinfo: 1 });
    expect(audit.emptyLinks, file).toEqual([]);
  }
});

test('stored dark theme is applied while a stylesheet response is held', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));

  let stylesheetCount = 0;
  let themeAppliedBeforeStylesheetRelease = false;
  await page.route('**/*.css', async (route) => {
    stylesheetCount += 1;
    if (stylesheetCount === 1) {
      try {
        await page.waitForFunction(
          () => document.documentElement.dataset.themeResolved === 'dark',
          undefined,
          { timeout: 3000 },
        );
        themeAppliedBeforeStylesheetRelease = true;
      } catch {
        // Release the stylesheet so the page can finish, then fail the contract assertion below.
      }
    }
    await route.continue();
  });

  await page.goto('/', { waitUntil: 'load' });

  expect(stylesheetCount).toBeGreaterThan(0);
  expect(themeAppliedBeforeStylesheetRelease).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('data-theme-resolved', 'dark');
});
