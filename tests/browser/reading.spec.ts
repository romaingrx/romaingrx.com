import { expect, test } from '@playwright/test';

import { buildToc } from '../../src/lib/toc';

test('Contents nests skipped heading levels under their nearest shallower heading', () => {
  const toc = buildToc([
    { depth: 2, slug: 'overview', text: 'Overview' },
    { depth: 4, slug: 'details', text: 'Details' },
    { depth: 5, slug: 'example', text: 'Example' },
    { depth: 3, slug: 'context', text: 'Context' },
    { depth: 2, slug: 'results', text: 'Results' },
  ]);

  expect(toc.map(({ slug, subheadings }) => [slug, subheadings.map(({ slug }) => slug)])).toEqual([
    ['overview', ['details', 'context']],
    ['results', []],
  ]);
  expect(toc[0].subheadings[0].subheadings.map(({ slug }) => slug)).toEqual(['example']);
});

test('blog structure has one page H1 and shows the introduction in the first desktop viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const main = page.locator('main');
  await expect(main.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(main.getByRole('heading', { name: 'References', level: 2 })).toHaveCount(1);
  await expect(
    main.locator('article > h1, article > h2, article > h3, article > h4').first(),
  ).toHaveAttribute('id', 'the-intuition');

  const introduction = await main.locator('#article-intro p').first().boundingBox();
  expect(introduction).not.toBeNull();
  expect(introduction!.y).toBeLessThan(800);
  expect(introduction!.y + introduction!.height).toBeLessThanOrEqual(800);

  const continueReading = page.getByRole('link', { name: /Continue Reading/ });
  await expect(continueReading).toHaveAttribute('href', '#article-intro');
  await continueReading.click();
  await expect(page).toHaveURL(/#article-intro$/);
  await expect(main.locator('#article-intro')).toBeFocused();
});

test('Contents works at phone, tablet, and desktop widths and tracks the reached section', async ({
  page,
}) => {
  await page.goto('/blog/denoising-diffusion-from-scratch', { waitUntil: 'domcontentloaded' });
  const navigation = page.getByRole('navigation', { name: 'Contents' });
  const disclosure = navigation.locator('details');
  const summary = navigation.getByText('Contents', { exact: true });

  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(summary).toBeVisible();
    await expect(disclosure).not.toHaveAttribute('open', '');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(navigation.getByRole('link', { name: 'Appendices', exact: true })).toBeVisible();
    await page.keyboard.press('Space');
    await expect(disclosure).not.toHaveAttribute('open', '');
  }

  await summary.focus();
  await page.keyboard.press('Enter');
  const appendices = navigation.getByRole('link', { name: 'Appendices', exact: true });
  await appendices.click();
  await expect(page).toHaveURL(/#appendices$/);
  await expect(page.locator('#appendices')).toBeFocused();
  await expect
    .poll(() =>
      page.locator('#appendices').evaluate((heading) => {
        const offset = Number.parseFloat(getComputedStyle(heading).scrollMarginTop);
        return Math.abs(heading.getBoundingClientRect().top - offset);
      }),
    )
    .toBeLessThan(4);
  await expect(appendices).toHaveAttribute('aria-current', 'location');
  await expect
    .poll(() =>
      page.locator('#appendices').evaluate((heading) => heading.getBoundingClientRect().top),
    )
    .toBeGreaterThan(80);

  await page.evaluate(() => window.scrollTo(0, 0));
  await appendices.click();
  await expect
    .poll(() =>
      page.locator('#appendices').evaluate((heading) => {
        const offset = Number.parseFloat(getComputedStyle(heading).scrollMarginTop);
        return Math.abs(heading.getBoundingClientRect().top - offset);
      }),
    )
    .toBeLessThan(4);

  await page.goto('/blog/denoising-diffusion-from-scratch#appendices', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('#appendices')).toBeFocused();
  await expect
    .poll(() =>
      page.locator('#appendices').evaluate((heading) => {
        const offset = Number.parseFloat(getComputedStyle(heading).scrollMarginTop);
        return Math.abs(heading.getBoundingClientRect().top - offset);
      }),
    )
    .toBeLessThan(4);
});

test('citation bibliography entries link back to every cited occurrence', async ({ page }) => {
  await page.goto('/blog/denoising-diffusion-from-scratch', { waitUntil: 'domcontentloaded' });

  const bibliographyEntry = page.locator('#bib-ho2020denoising');
  const backlinks = bibliographyEntry.getByRole('link', {
    name: /^Return to citation \d+ in the article$/,
  });
  const citationIds = await page
    .locator('article span[id^="citation--"]')
    .evaluateAll((spans) =>
      spans
        .filter((span) => span.querySelector('a[href="#bib-ho2020denoising"]'))
        .map((span) => span.id),
    );
  await expect(backlinks).toHaveCount(citationIds.length);

  const citation = page.locator(`#${citationIds[0]} a[href="#bib-ho2020denoising"]`);
  await citation.click();
  await expect(page).toHaveURL(/#bib-ho2020denoising$/);
  await expect(bibliographyEntry).toBeFocused();

  const firstBacklink = backlinks.first();
  await expect(firstBacklink).toBeVisible();
  await firstBacklink.click();
  await expect(page).toHaveURL(new RegExp(`#${citationIds[0]}$`));
  await expect(page.locator(`#${citationIds[0]}`)).toBeFocused();
});

test('notes include the same labeled Contents disclosure', async ({ page }) => {
  await page.goto('/notes/cuda-mental-model');

  const contents = page.getByRole('navigation', { name: 'Contents' });
  await expect(contents.getByText('Contents', { exact: true })).toBeVisible();
  await expect(page.locator('main').getByRole('heading', { level: 1 })).toHaveCount(1);
  await contents.getByText('Contents', { exact: true }).click();
  await expect(contents.getByRole('link', { name: 'Code example', exact: true })).toBeVisible();
});

test('malformed incoming fragments do not break Contents initialization', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => pageErrors.push(error));
  await page.goto('/blog/denoising-diffusion-from-scratch#%ZZ');

  await expect(page.getByRole('navigation', { name: 'Contents' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});
