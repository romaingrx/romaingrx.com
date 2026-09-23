import { expect, test } from '@playwright/test';
import sharp from 'sharp';

test('empty blog discovery announces zero results and a clear empty state', async ({ page }) => {
  await page.goto('/design/discovery');

  const filters = page.getByRole('navigation', { name: 'Filter posts' });
  await expect(filters.getByRole('link', { name: 'All posts (0)' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.getByText('0 posts', { exact: true })).toBeVisible();
  await expect(page.getByText('No posts found.', { exact: true })).toBeVisible();
});

test('singular blog discovery keeps the selected category and singular count', async ({ page }) => {
  await page.goto('/design/discovery-single');

  const filters = page.getByRole('navigation', { name: 'Filter posts' });
  const category = filters
    .getByRole('group', { name: 'Categories' })
    .getByRole('link', { name: 'Personal (1)' });
  await expect(category).toHaveAttribute('aria-current', 'page');
  await expect(category).toHaveAttribute('href', '/blog/category/personal');
  await expect(filters.getByRole('link', { name: 'All posts (1)' })).toBeVisible();
  await expect(page.getByText('1 post', { exact: true })).toBeVisible();
});

test('the profile image loads from the native Sharp development service', async ({ page }) => {
  await page.goto('/about');

  const portrait = page.getByRole('img', { name: 'Romain Graux', exact: true }).first();
  const selectedImage = await portrait.evaluate((image: HTMLImageElement) => {
    const selectedCandidate = image.srcset
      .split(',')
      .map((candidate) => candidate.trim().split(/\s+/))
      .find(([url]) => new URL(url, document.baseURI).href === image.currentSrc);

    return {
      url: image.currentSrc,
      expectedWidth: Number.parseInt(selectedCandidate?.[1] ?? '', 10),
    };
  });
  expect(selectedImage.expectedWidth).toBeGreaterThan(0);

  const response = await page.request.get(selectedImage.url);
  expect(response.ok()).toBe(true);

  const output = await sharp(await response.body()).metadata();
  expect(output.format).toBe('webp');
  expect(output.width).toBe(selectedImage.expectedWidth);
  expect(output.height).toBe(output.width);
  await expect(portrait).toHaveJSProperty('complete', true);
  expect(await portrait.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(
    0,
  );
});
