import { expect, test } from '@playwright/test';

test('home exposes primary navigation and writing links', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('romaingrx.com');
  await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Notes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: /View all/ }).first()).toBeVisible();
});

test('representative article renders its title heading', async ({ page }) => {
  await page.goto('/blog');

  const articleLink = page
    .locator('main a[href^="/blog/"]')
    .filter({ has: page.locator('h2') })
    .first();
  const articleTitle = await articleLink.locator('h2').innerText();
  await articleLink.click();

  await expect(
    page.locator('main').getByRole('heading', { level: 1, name: articleTitle, exact: true }),
  ).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
});

test('taxonomy links encode values and preserve their generated route', async ({ page }) => {
  await page.goto('/blog');

  const tagLink = page.getByRole('link', { name: 'from scratch', exact: true });
  await expect(tagLink).toHaveAttribute('href', '/blog/tag/from%20scratch');
  await tagLink.click();

  await expect(page).toHaveURL(/\/blog\/tag\/from%20scratch\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Blog' })).toBeVisible();
});

test('legacy content paths redirect and unknown paths return 404', async ({ request }) => {
  const redirects = [
    ['/blog/posts/red-teamer-mistral-nemo', '/blog/mistral-nemo-red-teamer'],
    ['/note/corne-keyboard-5x3-3-setup', '/notes/corne-keyboard-5x3-3-setup'],
    ['/note/cuda-mental-model', '/notes/cuda-mental-model'],
    [
      '/note/hassle-free-ml-environment-with-nix-flakes',
      '/notes/hassle-free-ml-environment-with-nix-flakes',
    ],
  ] as const;

  await Promise.all(
    redirects.map(async ([source, destination]) => {
      const response = await request.get(source, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(response.headers().location).toBe(destination);
    }),
  );

  const missing = await request.get('/note/not-a-published-note', { maxRedirects: 0 });
  expect(missing.status()).toBe(404);
});

test('not found page provides branded recovery links', async ({ page }) => {
  const response = await page.goto('/not-a-real-page');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'That page is not here.' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Recovery links' }).getByRole('link', { name: 'Home' }),
  ).toBeVisible();
});

test('development component fixture is available to the dev server', async ({ page }) => {
  const response = await page.goto('/design');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Design fixture');
  await expect(page.getByText('This alert identifies the active component fixture.')).toBeVisible();
});
