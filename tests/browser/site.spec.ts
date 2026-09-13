import { expect, test } from '@playwright/test';

test('home exposes primary navigation and writing links', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('romaingrx.com');
  await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Notes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: /View all/ }).first()).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Global' }).getByRole('link', { name: 'Contact' }),
  ).toHaveCount(1);
});

test('contact is discoverable and uses the configured LinkedIn destination', async ({ page }) => {
  await page.goto('/');

  const main = page.locator('main');
  const contactLink = main.getByRole('link', { name: 'Contact', exact: true });
  await expect(contactLink).toBeVisible();
  await expect(contactLink).toHaveAttribute('href', '/contact');

  const linkedInLink = main.getByRole('link', { name: 'Connect on LinkedIn' });
  await expect(linkedInLink).toHaveAttribute('href', 'https://go.romaingrx.com/linkedin');
  await expect(linkedInLink).toHaveAttribute('target', '_blank');
  await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
  expect(await linkedInLink.evaluate((element) => element.getBoundingClientRect().width)).toBe(44);
  expect(await linkedInLink.evaluate((element) => element.getBoundingClientRect().height)).toBe(44);
});

test('mobile navigation exposes Contact', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(
    page.locator('#mobile-nav-menu').getByRole('link', { name: 'Contact', exact: true }),
  ).toBeVisible();
});

test('contact page has one main heading and no form', async ({ page }) => {
  const response = await page.goto('/contact');

  expect(response?.ok()).toBe(true);
  const main = page.locator('main');
  await expect(main).toHaveCount(1);
  await expect(main.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(main.locator('form')).toHaveCount(0);

  const linkedInLink = main.getByRole('link', { name: 'Connect on LinkedIn', exact: true });
  await expect(linkedInLink).toHaveAttribute('href', 'https://go.romaingrx.com/linkedin');
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
