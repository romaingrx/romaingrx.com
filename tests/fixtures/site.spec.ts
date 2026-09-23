import { expect, test } from '@playwright/test';

test('native image dialogs keep focus, restore their triggers, and stay independent', async ({
  page,
}) => {
  await page.goto('/design');

  const firstTrigger = page.getByRole('button', { name: 'Open image: Diagram one' });
  const secondTrigger = page.getByRole('button', { name: 'Open image: Diagram two' });
  const firstDialog = page.getByRole('dialog', { name: 'Image viewer: Diagram one' });
  const secondDialog = page.getByRole('dialog', { name: 'Image viewer: Diagram two' });

  await firstTrigger.focus();
  await firstTrigger.press('Enter');
  await expect(firstDialog).toBeVisible();
  await expect(secondDialog).not.toBeVisible();
  await expect(firstDialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await page.keyboard.press('Tab');
  expect(
    await page.evaluate(() => {
      const dialog = document.querySelector('dialog[open]');
      return document.activeElement === document.body || dialog?.contains(document.activeElement);
    }),
  ).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(firstDialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();

  const dialogBox = await firstDialog.boundingBox();
  expect(dialogBox).not.toBeNull();
  await page.mouse.move(dialogBox!.x + dialogBox!.width / 2, dialogBox!.y + dialogBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await expect(firstDialog).toBeVisible();

  await page.mouse.move(1, 1);
  await page.mouse.down();
  await page.mouse.move(dialogBox!.x + dialogBox!.width / 2, dialogBox!.y + dialogBox!.height / 2);
  await page.mouse.up();
  await expect(firstDialog).toBeVisible();

  await page.mouse.click(1, 1);
  await expect(firstDialog).not.toBeVisible();
  await expect(firstTrigger).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');

  await secondTrigger.click();
  await expect(secondDialog).toBeVisible();
  await expect(firstDialog).not.toBeVisible();
  await secondDialog.getByRole('button', { name: 'Close dialog' }).click();
  await expect(secondDialog).not.toBeVisible();
  await expect(secondTrigger).toBeFocused();
});

test('Astro Dialog uses token styling, a 44px close target, and native dismissal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design');

  const opener = page.getByRole('button', { name: 'Edit Profile' });
  const dialog = page.getByRole('dialog', { name: 'My title' });
  const close = dialog.getByRole('button', { name: 'Close dialog' });
  await opener.click();
  await expect(dialog).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  const closeBox = await close.boundingBox();
  expect(dialogBox).not.toBeNull();
  expect(dialogBox!.width).toBeLessThanOrEqual(358);
  expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
  expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(390);
  expect(closeBox).not.toBeNull();
  expect(closeBox!.width).toBeGreaterThanOrEqual(44);
  expect(closeBox!.height).toBeGreaterThanOrEqual(44);

  await close.click();
  await expect(dialog).toBeHidden();

  await opener.click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await opener.click();
  await page.mouse.click(1, 1);
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('development component fixture is available to the dev server', async ({ page }) => {
  const response = await page.goto('/design');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle('Design fixture');
  await expect(page.getByText('This alert identifies the active component fixture.')).toBeVisible();
});
