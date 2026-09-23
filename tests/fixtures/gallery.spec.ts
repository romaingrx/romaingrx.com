import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/design');
});

test('gallery clamps its start, wraps navigation, reports image errors, and restores focus', async ({
  page,
}) => {
  const host = page
    .locator('astro-photo-stack-gallery')
    .filter({ has: page.locator('#gallery-fixture-clamped-dialog') });
  const opener = host.getByRole('button', { name: 'Open photo gallery, 2 photos' });
  const dialog = host.locator('#gallery-fixture-clamped-dialog');

  await opener.focus();
  await opener.press('Space');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.gallery-counter')).toHaveText('Photo 2 of 2');
  await expect(dialog.locator('.gallery-caption:not([hidden])')).toHaveText(
    'Completed keyboard, final view',
  );

  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('.gallery-counter')).toHaveText('Photo 1 of 2');
  await expect(dialog.locator('.gallery-caption:not([hidden])')).toHaveText(
    'Keyboard build, first view',
  );
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('.gallery-counter')).toHaveText('Photo 2 of 2');

  await dialog.locator('.gallery-image[data-index="0"] img').dispatchEvent('error');
  await expect(dialog.locator('.gallery-error')).toBeHidden();
  await page.route('**/missing-gallery-image-for-test.png', (route) => route.abort());
  await dialog.locator('.gallery-image:not([hidden]) img').evaluate((image: HTMLImageElement) => {
    image.src = '/missing-gallery-image-for-test.png';
  });
  await expect(dialog.locator('.gallery-error')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('gallery instances keep their state and reconnect without duplicate listeners', async ({
  page,
}) => {
  const firstHost = page
    .locator('astro-photo-stack-gallery')
    .filter({ has: page.locator('#gallery-fixture-clamped-dialog') });
  const secondHost = page
    .locator('astro-photo-stack-gallery')
    .filter({ has: page.locator('#gallery-fixture-independent-dialog') });
  const firstDialog = firstHost.locator('#gallery-fixture-clamped-dialog');
  const secondDialog = secondHost.locator('#gallery-fixture-independent-dialog');

  await firstHost.getByRole('button', { name: 'Open photo gallery, 2 photos' }).click();
  await expect(firstDialog.locator('.gallery-counter')).toHaveText('Photo 2 of 2');
  await firstDialog.getByRole('button', { name: 'Next image' }).click();
  await expect(firstDialog.locator('.gallery-counter')).toHaveText('Photo 1 of 2');
  await firstDialog.getByRole('button', { name: 'Close gallery' }).click();

  await secondHost.evaluate((element) => {
    const parent = element.parentNode;
    if (!parent) throw new Error('Gallery fixture has no parent');
    element.remove();
    parent.appendChild(element);
  });
  await secondHost.getByRole('button', { name: 'Open photo gallery, 2 photos' }).click();
  await expect(secondDialog.locator('.gallery-counter')).toHaveText('Photo 1 of 2');
  await secondDialog.getByRole('button', { name: 'Next image' }).click();
  await expect(secondDialog.locator('.gallery-counter')).toHaveText('Photo 2 of 2');
  await expect(firstDialog.locator('.gallery-counter')).toHaveText('Photo 1 of 2');
  await secondDialog.getByRole('button', { name: 'Next image' }).click();
  await expect(secondDialog.locator('.gallery-counter')).toHaveText('Photo 1 of 2');

  await secondDialog.dispatchEvent('pointerdown', { bubbles: true, pointerId: 1 });
  await secondDialog.dispatchEvent('pointerup', { bubbles: true, pointerId: 1 });
  await secondDialog.dispatchEvent('click', { bubbles: true });
  await expect(secondDialog).not.toBeVisible();
  await expect(
    secondHost.getByRole('button', { name: 'Open photo gallery, 2 photos' }),
  ).toBeFocused();
});

test('single and empty galleries have safe controls and openers', async ({ page }) => {
  const singleHost = page
    .locator('astro-photo-stack-gallery')
    .filter({ has: page.locator('#gallery-fixture-single-dialog') });
  const singleDialog = singleHost.locator('#gallery-fixture-single-dialog');
  await singleHost.getByRole('button', { name: 'Open photo gallery, 1 photo' }).click();
  await expect(singleDialog.locator('.gallery-counter')).toHaveText('Photo 1 of 1');
  await expect(singleDialog.getByRole('button', { name: 'Previous image' })).toHaveCount(0);
  await expect(singleDialog.getByRole('button', { name: 'Next image' })).toHaveCount(0);
  await singleDialog.getByRole('button', { name: 'Close gallery' }).click();

  const emptyHost = page.locator('#gallery-fixture-empty');
  await expect(emptyHost.getByRole('button', { name: /Open photo gallery/ })).toHaveCount(0);
  await expect(emptyHost.getByRole('status')).toHaveText('No photos available.');
  await expect(emptyHost.locator('dialog')).toHaveCount(0);
});
