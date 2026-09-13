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

test('development component fixture is available to the dev server', async ({ page }) => {
  const response = await page.goto('/design');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Design fixture');
  await expect(page.getByText('This alert identifies the active component fixture.')).toBeVisible();
});
