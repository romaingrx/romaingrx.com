import { expect, test, type Page } from '@playwright/test';

import { buildToc } from '../../src/lib/toc';

const ddpmArticlePath = '/blog/denoising-diffusion-from-scratch';

async function openDenoisingArticle(page: Page, fragment = '') {
  await page.route('https://giscus.app/**', (route) => route.abort());
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.abort());
  await page.goto(`${ddpmArticlePath}${fragment}`, { waitUntil: 'domcontentloaded' });
}

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

test.describe('reading links with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const [name, width] of [
    ['phone', 390],
    ['tablet', 768],
    ['desktop', 1280],
  ] as const) {
    test(`Contents disclosure supports keyboard at ${name} width`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await openDenoisingArticle(page);
      const navigation = page.getByRole('navigation', { name: 'Contents' });
      const disclosure = navigation.locator('details');
      const summary = navigation.getByText('Contents', { exact: true });

      await expect(summary).toBeVisible();
      await expect(disclosure).not.toHaveAttribute('open', '');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(disclosure).toHaveAttribute('open', '');
      await expect(navigation.getByRole('link', { name: 'Appendices', exact: true })).toBeVisible();
      await page.keyboard.press('Space');
      await expect(disclosure).not.toHaveAttribute('open', '');
    });
  }

  test('Contents anchors focus and track the reached section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openDenoisingArticle(page);
    const navigation = page.getByRole('navigation', { name: 'Contents' });
    const summary = navigation.getByText('Contents', { exact: true });
    await summary.focus();
    await page.keyboard.press('Enter');
    const appendices = navigation.getByRole('link', { name: 'Appendices', exact: true });
    await appendices.click();
    await expect(page).toHaveURL(/#appendices$/);
    const heading = page.locator('#appendices');
    await expect(heading).toBeFocused();
    const aligned = () =>
      heading.evaluate((element) => {
        const offset = Number.parseFloat(getComputedStyle(element).scrollMarginTop);
        return Math.abs(element.getBoundingClientRect().top - offset);
      });
    await expect.poll(aligned).toBeLessThan(4);
    await expect(appendices).toHaveAttribute('aria-current', 'location');
    await expect
      .poll(() => heading.evaluate((element) => element.getBoundingClientRect().top))
      .toBeGreaterThan(80);

    await page.evaluate(() => window.scrollTo(0, 0));
    await appendices.focus();
    await page.keyboard.press('Enter');
    await expect.poll(aligned).toBeLessThan(4);
  });

  test('an incoming Contents fragment focuses and aligns its heading', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openDenoisingArticle(page, '#appendices');
    const heading = page.locator('#appendices');
    await expect(heading).toBeFocused();
    await expect
      .poll(() =>
        heading.evaluate((element) => {
          const offset = Number.parseFloat(getComputedStyle(element).scrollMarginTop);
          return Math.abs(element.getBoundingClientRect().top - offset);
        }),
      )
      .toBeLessThan(4);
  });

  test('bibliography backlinks map every citation occurrence', async ({ page }) => {
    await openDenoisingArticle(page);
    const relation = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>('article span[id^="citation--"]')]
        .filter((span) => span.querySelector('a[href="#bib-ho2020denoising"]'))
        .map((span) => span.id);
      const backlinks = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          '#bib-ho2020denoising a[aria-label^="Return to citation"]',
        ),
      ].map((link) => ({ href: link.hash, name: link.getAttribute('aria-label') }));
      return { ids, backlinks };
    });
    expect(relation.ids.length).toBeGreaterThan(1);
    expect(relation.backlinks.map(({ name }) => name)).toEqual(
      relation.ids.map((_, index) => `Return to citation ${index + 1} in the article`),
    );
    expect(relation.backlinks.map(({ href }) => href)).toEqual(relation.ids.map((id) => `#${id}`));
  });

  test('citation and bibliography links return focus to the matching content', async ({ page }) => {
    await openDenoisingArticle(page);
    const citationId = await page
      .locator('article')
      .evaluate(
        (article) =>
          [...article.querySelectorAll<HTMLElement>('span[id^="citation--"]')].find((span) =>
            span.querySelector('a[href="#bib-ho2020denoising"]'),
          )?.id,
      );
    expect(citationId).toBeTruthy();
    const bibliographyEntry = page.locator('#bib-ho2020denoising');
    await page.locator(`#${citationId} a[href="#bib-ho2020denoising"]`).click();
    await expect(page).toHaveURL(/#bib-ho2020denoising$/);
    await expect(bibliographyEntry).toBeFocused();
    await bibliographyEntry
      .getByRole('link', { name: /^Return to citation \d+ in the article$/ })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`#${citationId}$`));
    await expect(page.locator(`#${citationId}`)).toBeFocused();
  });
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
