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

test('the profile image loads with the development passthrough service', async ({ page }) => {
  await page.goto('/about');

  const portrait = page.getByRole('img', { name: 'Romain Graux', exact: true }).first();
  const imageUrl = await portrait.evaluate((image: HTMLImageElement) => image.currentSrc);
  const response = await page.request.get(imageUrl);
  expect(response.ok()).toBe(true);

  const output = await sharp(await response.body()).metadata();
  expect(output.format).toBe('jpeg');
  expect(output.width).toBe(926);
  expect(output.height).toBe(output.width);
  await expect(portrait).toHaveJSProperty('complete', true);
  await expect(portrait).toHaveJSProperty('naturalWidth', 926);
});
