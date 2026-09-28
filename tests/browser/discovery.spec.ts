import { expect, test } from '@playwright/test';
import sharp from 'sharp';

function taxonomyCount(text: string): number {
  const match = text.match(/\((\d+)\)$/);
  expect(match, `expected a taxonomy count in "${text}"`).not.toBeNull();
  return Number(match![1]);
}

test('blog filters separate categories and tags, format labels, and show counts and selection', async ({
  page,
}) => {
  await page.goto('/blog');

  const filters = page.getByRole('navigation', { name: 'Filter posts' });
  const categories = filters.getByRole('group', { name: 'Categories' });
  const tags = filters.getByRole('group', { name: 'Tags' });
  await expect(categories.getByText('Categories', { exact: true })).toBeVisible();
  const machineLearning = categories.getByRole('link', { name: /^ML \(\d+\)$/ });
  const fromScratch = tags.getByRole('link', { name: /^From Scratch \(\d+\)$/ });

  await expect(machineLearning).toHaveAttribute('href', '/blog/category/ml');
  await expect(tags.getByRole('link', { name: /^LLM \(\d+\)$/ })).toHaveAttribute(
    'href',
    '/blog/tag/llm',
  );
  await expect(fromScratch).toHaveAttribute('href', '/blog/tag/from%20scratch');
  const fromScratchCount = taxonomyCount(await fromScratch.innerText());
  await fromScratch.click();

  await expect(page).toHaveURL(/\/blog\/tag\/from%20scratch\/?$/);
  const selectedTag = page
    .getByRole('navigation', { name: 'Filter posts' })
    .getByRole('link', { name: /^From Scratch \(\d+\)$/ });
  await expect(selectedTag).toHaveAttribute('aria-current', 'page');
  await expect(selectedTag).toHaveAttribute('href', '/blog/tag/from%20scratch');
  const visibleCards = page.locator('main a[href^="/blog/"]').filter({ has: page.locator('h2') });
  const cardCount = await visibleCards.count();
  expect(cardCount).toBe(fromScratchCount);
  await expect(
    page.getByText(`${cardCount} ${cardCount === 1 ? 'post' : 'posts'}`, { exact: true }),
  ).toBeVisible();
});

test('coverless posts use a readable text card', async ({ page }) => {
  await page.goto('/blog');

  const post = page.locator('main a[href="/blog/improvement-plan"]');
  await expect(post.getByRole('heading', { name: 'Improvement plan' })).toBeVisible();
  await expect(post.locator('img')).toHaveCount(0);
  await expect(post).toContainText('Becoming a better human at human things');
});

test('note tag navigation has all-notes return path and one anchor per visible card', async ({
  page,
}) => {
  await page.goto('/notes/tag/machine-learning');

  await expect(
    page.getByRole('heading', { name: 'Notes tagged “Machine-Learning”' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'All notes' })).toHaveAttribute('href', '/notes');

  const cards = page.locator('main a[href^="/notes/"]').filter({ has: page.locator('h2') });
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThan(0);
  await expect(cards.locator('a')).toHaveCount(0);
  await expect(cards.locator('time')).toHaveCount(cardCount);
  await expect(cards.locator('time').first()).toBeVisible();
  await expect(cards.locator('p')).toHaveCount(cardCount);
  await expect(cards.locator('p').first()).toBeVisible();
});

test('notes with no matching tags fall back to recent notes and exclude the current note', async ({
  page,
}) => {
  await page.goto('/notes/corne-keyboard-5x3-3-setup');

  const moreNotes = page
    .locator('footer')
    .filter({ has: page.getByRole('heading', { name: 'More Notes' }) });
  const relatedCards = moreNotes.locator('a[href^="/notes/"]').filter({ has: page.locator('h2') });
  const relatedCount = await relatedCards.count();
  expect(relatedCount).toBeGreaterThan(0);
  expect(relatedCount).toBeLessThanOrEqual(3);
  const relatedHrefs = await relatedCards.evaluateAll((cards) =>
    cards.map((card) => card.getAttribute('href')),
  );
  expect(relatedHrefs).not.toContain('/notes/corne-keyboard-5x3-3-setup');
});

test('profile portrait uses compiled responsive variants and deliberate priority', async ({
  page,
}) => {
  await page.goto('/about');

  const portrait = page.getByRole('img', { name: 'Romain Graux', exact: true }).first();
  await expect(portrait).toHaveAttribute('loading', 'eager');
  await expect(portrait).toHaveAttribute('fetchpriority', 'high');
  await expect(portrait).toHaveAttribute('sizes', '(max-width: 640px) 128px, 160px');
  const srcset = await portrait.getAttribute('srcset');
  expect(srcset).toBeTruthy();
  const variants = srcset!.split(',').map((candidate) => {
    const [url, width] = candidate.trim().split(/\s+/);
    return { url: new URL(url, page.url()).toString(), width: Number(width.replace('w', '')) };
  });
  expect(variants.map(({ width }) => width).toSorted((a, b) => a - b)).toEqual([
    128, 160, 256, 320,
  ]);
  await expect(portrait).toHaveAttribute('src', /_astro/);
  await Promise.all(
    variants.map(async (variant) => {
      const response = await page.request.get(variant.url);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/webp');
      const image = await sharp(await response.body()).metadata();
      expect(image.format).toBe('webp');
      expect(image.width).toBe(variant.width);
      expect(image.height).toBe(variant.width);
    }),
  );
});

test('timeline uses ordered roles and readable month dates', async ({ page }) => {
  await page.goto('/about');

  const experience = page.locator('[data-timeline="experience"]');
  await expect(experience.locator('h3')).toHaveText([
    'Co-founder & tech lead',
    'Machine Learning Engineer',
    'Teaching Assistant',
    'Computer Vision Internship',
  ]);
  await expect(experience.locator('.font-mono').first()).toHaveText('Jan 2024 – Present');
});

test('author hover-card social links have names and 44px targets', async ({ page }) => {
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const authorImage = page.getByRole('img', { name: 'Romain Graux', exact: true }).first();
  const imageUrl = new URL((await authorImage.getAttribute('src'))!, page.url()).toString();
  const imageResponse = await page.request.get(imageUrl);
  const avatar = await sharp(await imageResponse.body()).metadata();
  expect(imageResponse.ok()).toBe(true);
  expect(avatar.format).toBe('webp');
  expect(avatar.width).toBe(32);
  expect(avatar.height).toBe(32);

  await authorImage.hover();
  const socialLinks = page.getByRole('link', { name: /^Follow Romain Graux on / });
  await expect(socialLinks.first()).toBeVisible();
  const readSizes = () =>
    socialLinks.evaluateAll((links) =>
      links.map((link) => {
        const box = link.getBoundingClientRect();
        return [box.width, box.height];
      }),
    );
  await expect
    .poll(async () => (await readSizes()).every(([width, height]) => width >= 44 && height >= 44))
    .toBe(true);
  const sizes = await readSizes();
  expect(sizes.length).toBeGreaterThan(0);
  expect(sizes.every(([width, height]) => width >= 44 && height >= 44)).toBe(true);
});

test('blog and note headers stay within the mobile viewport and show the blog author', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const blogHeader = page.locator('main > header').first();
  await expect(blogHeader.getByText('Written by', { exact: true })).toBeVisible();
  await expect(blogHeader.getByText('Romain Graux', { exact: true })).toBeVisible();
  const blogHeaderWidth = await blogHeader.evaluate((element) => [
    element.clientWidth,
    element.scrollWidth,
  ]);
  expect(blogHeaderWidth[1]).toBeLessThanOrEqual(blogHeaderWidth[0]);

  await page.goto('/notes/corne-keyboard-5x3-3-setup');
  const noteHeader = page.locator('main > header').first();
  const noteHeaderWidth = await noteHeader.evaluate((element) => [
    element.clientWidth,
    element.scrollWidth,
  ]);
  expect(noteHeaderWidth[1]).toBeLessThanOrEqual(noteHeaderWidth[0]);
});
