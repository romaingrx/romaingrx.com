import { expect, test } from '@playwright/test';

test('the published Corne gallery opens by keyboard and keeps captions, position, and focus together', async ({
  page,
}) => {
  await page.goto('/notes/corne-keyboard-5x3-3-setup');

  const opener = page.getByRole('button', { name: 'Open photo gallery, 5 photos' });
  const dialog = page.locator('dialog[data-gallery-dialog]');
  await opener.focus();
  await opener.press('Enter');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.gallery-counter')).toHaveText('Photo 1 of 5');
  await expect(dialog.locator('.gallery-image:not([hidden]) img')).toHaveAttribute(
    'alt',
    'Base board',
  );

  await dialog.getByRole('button', { name: 'Next image' }).click();
  await expect(dialog.locator('.gallery-counter')).toHaveText('Photo 2 of 5');
  await expect(dialog.locator('.gallery-image:not([hidden]) img')).toHaveAttribute(
    'alt',
    'All components',
  );
  await dialog.getByRole('button', { name: 'Previous image' }).click();
  await expect(dialog.locator('.gallery-counter')).toHaveText('Photo 1 of 5');

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('the Corne lightbox fits short mobile viewports without cropping its image or crowding controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/notes/corne-keyboard-5x3-3-setup');

  const opener = page.getByRole('button', { name: 'Open photo gallery, 5 photos' });
  const dialog = page.locator('dialog[data-gallery-dialog]');
  await opener.click();
  await expect(dialog.locator('.gallery-image:not([hidden]) img')).toHaveJSProperty(
    'complete',
    true,
  );
  const previousButton = dialog.getByRole('button', { name: 'Previous image' });
  await page.keyboard.press('Tab');
  await expect(previousButton).toBeFocused();
  await expect
    .poll(() => previousButton.evaluate((button) => getComputedStyle(button).outlineColor))
    .toBe('rgb(255, 255, 255)');

  const geometry = await dialog.evaluate((element) => {
    const rect = (selector: string) => {
      const target = element.querySelector<HTMLElement>(selector);
      if (!target) throw new Error(`Missing gallery element: ${selector}`);
      return target.getBoundingClientRect();
    };
    const dialogRect = element.getBoundingClientRect();
    const image = element.querySelector<HTMLImageElement>('.gallery-image:not([hidden]) img');
    if (!image) throw new Error('Missing selected gallery image');
    const previous = rect('.gallery-prev');
    const next = rect('.gallery-next');
    const counter = rect('.gallery-counter');
    return {
      dialogHeight: dialogRect.height,
      imageFit: getComputedStyle(image).objectFit,
      imageRatio: image.naturalWidth / image.naturalHeight,
      previousHeight: previous.height,
      nextHeight: next.height,
      closeHeight: rect('.gallery-close').height,
      controlsOverlapCounter:
        (previous.left < counter.right &&
          previous.right > counter.left &&
          previous.top < counter.bottom &&
          previous.bottom > counter.top) ||
        (next.left < counter.right &&
          next.right > counter.left &&
          next.top < counter.bottom &&
          next.bottom > counter.top),
      scrollLocked:
        getComputedStyle(document.documentElement).overflow === 'hidden' &&
        getComputedStyle(document.body).overflow === 'hidden',
    };
  });

  expect(geometry.dialogHeight).toBeLessThanOrEqual(568);
  expect(geometry.imageFit).toBe('contain');
  expect(geometry.imageRatio).toBeGreaterThan(0);
  expect(geometry.previousHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.nextHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.closeHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.controlsOverlapCounter).toBe(false);
  expect(geometry.scrollLocked).toBe(true);
});
