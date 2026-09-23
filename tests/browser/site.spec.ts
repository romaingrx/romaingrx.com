import { expect, test } from '@playwright/test';

import { tabKey } from '../helpers/keyboard';

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

test('mobile navigation exposes Contact', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const navigation = page.getByRole('navigation', { name: 'Global' });
  const trigger = navigation.getByRole('button', { name: 'Menu' });
  const menu = page.locator('#mobile-nav-menu');

  await expect(menu.getByRole('link')).toHaveCount(0);
  await trigger.focus();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();

  await page.keyboard.press(tabKey(browserName));
  await expect(menu.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu.getByRole('link')).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('main').click({ position: { x: 5, y: 5 } });
  await expect(menu.getByRole('link')).toHaveCount(0);
});

test('skip link moves keyboard focus to the main content target', async ({ page, browserName }) => {
  await page.goto('/');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  const main = page.locator('#main-content');

  await page.keyboard.press(tabKey(browserName));
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(main).toBeFocused();
  await expect(page).toHaveURL(/#main-content$/);
});

test('navigation keeps the current section active and the header visible during interaction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/tag/from%20scratch');

  const navigation = page.getByRole('navigation', { name: 'Global' });
  const blogLinks = navigation.locator('a[href="/blog"]');
  const menu = page.locator('#mobile-nav-menu');
  const trigger = navigation.getByRole('button', { name: 'Menu' });
  const header = page.locator('#header');

  await expect(blogLinks).toHaveCount(2);
  await expect(blogLinks.nth(0)).toHaveAttribute('aria-current', 'page');
  await expect(blogLinks.nth(1)).toHaveAttribute('aria-current', 'page');

  await trigger.focus();
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(() => header.evaluate((element) => element.getBoundingClientRect().bottom))
    .toBeGreaterThan(0);

  await trigger.press('Enter');
  await expect(menu).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 800));
  await expect
    .poll(() => header.evaluate((element) => element.getBoundingClientRect().bottom))
    .toBeGreaterThan(0);
});

test('an image dialog locks page scrolling on a long article', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const trigger = page.getByRole('button', { name: /Open image: UNet architecture:/ });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: /Image viewer: UNet architecture:/ });
  await expect(dialog).toBeVisible();

  const diagram = dialog.locator('[data-image-content] svg');
  const imageBox = await diagram.boundingBox();
  expect(imageBox).not.toBeNull();

  const closeBox = await dialog.getByRole('button', { name: 'Close dialog' }).boundingBox();
  expect(closeBox).not.toBeNull();
  const controlsOverlapDiagram =
    closeBox!.x < imageBox!.x + imageBox!.width &&
    closeBox!.x + closeBox!.width > imageBox!.x &&
    closeBox!.y < imageBox!.y + imageBox!.height &&
    closeBox!.y + closeBox!.height > imageBox!.y;
  expect(controlsOverlapDiagram).toBe(false);

  expect(imageBox!.x).toBeGreaterThanOrEqual(0);
  expect(imageBox!.y).toBeGreaterThanOrEqual(0);
  expect(imageBox!.x + imageBox!.width).toBeLessThanOrEqual(390);
  expect(imageBox!.y + imageBox!.height).toBeLessThanOrEqual(844);
  const [actualAspect, viewBoxAspect] = await diagram.evaluate((svg) => {
    const [, , width, height] = svg.getAttribute('viewBox')!.split(/\s+/).map(Number);
    const bounds = svg.getBoundingClientRect();
    return [bounds.width / bounds.height, width / height];
  });
  expect(actualAspect).toBeCloseTo(viewBoxAspect!, 2);

  const scrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.move(10, 10);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
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

  const tagLink = page.getByRole('link', { name: /^From Scratch \(\d+\)$/ });
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
