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
  await page.goto('/blog/denoising-diffusion-from-scratch');

  await expect(page).toHaveTitle(/Denoising Diffusion from Scratch/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Denoising Diffusion from Scratch', exact: true }),
  ).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
});

test('development component fixture is available to the dev server', async ({ page }) => {
  const response = await page.goto('/design');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Design fixture');
  await expect(page.getByText('YOOOOOOOOOOOO').first()).toBeVisible();
});
