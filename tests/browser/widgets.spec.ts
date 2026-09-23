import { expect, test } from '@playwright/test';

import { buildSequenceDiffPositions } from '../../src/content/blog/20260301-vae/components/sequence-diff';

test('scientific playback controls announce data values and preserve square images', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const forward = page.locator('[data-slot="card"]').filter({ hasText: 'Forward process' }).first();
  const timestep = forward.getByRole('slider', { name: 'Forward process timestep' });
  await expect(timestep).toHaveAttribute('aria-valuetext', /timestep .*; step 1 of/);

  const pixel = await forward.locator('img').boundingBox();
  expect(pixel).not.toBeNull();
  expect(Math.abs(pixel!.width - pixel!.height)).toBeLessThanOrEqual(1);
  expect(pixel!.x).toBeGreaterThanOrEqual(0);
  expect(pixel!.x + pixel!.width).toBeLessThanOrEqual(320);

  const initialValue = await timestep.getAttribute('aria-valuetext');
  await timestep.scrollIntoViewIfNeeded();
  await expect(
    page
      .locator('astro-island[component-export="ForwardProcess"]:not([ssr])')
      .filter({ has: forward }),
  ).toHaveCount(1);
  await forward.getByRole('button', { name: 'Play timesteps' }).click();
  await expect
    .poll(() => timestep.getAttribute('aria-valuetext'), { timeout: 8000 })
    .not.toBe(initialValue);
  expect(pageErrors).toEqual([]);
  await forward.getByRole('button', { name: 'Pause playback' }).click();
  const pausedAt = await timestep.getAttribute('aria-valuetext');
  await page.waitForTimeout(300);
  await expect(timestep).toHaveAttribute('aria-valuetext', pausedAt!);

  await forward.getByRole('button', { name: 'Play timesteps' }).click();
  await forward.getByRole('button', { name: '2', exact: true }).click();
  await expect(timestep).toHaveAttribute('aria-valuetext', /step 1 of/);
  await expect(forward.getByRole('button', { name: 'Play timesteps' })).toBeVisible();

  const epoch = page.locator('[data-slot="card"]').filter({ hasText: 'Learning to write' });
  const epochSlider = epoch.getByRole('slider', { name: 'Training epoch' });
  await epochSlider.scrollIntoViewIfNeeded();
  await expect(
    page
      .locator('astro-island[component-export="EpochProgress"]:not([ssr])')
      .filter({ has: epoch }),
  ).toHaveCount(1);
  await epochSlider.focus();
  await epochSlider.press('End');
  await expect(epochSlider).toHaveAttribute(
    'aria-valuetext',
    /epoch 150; validation sample 15 of 15/,
  );
  const lastValue = await epochSlider.getAttribute('max');
  await expect(epochSlider).toHaveValue(lastValue!);
  await expect(epoch.getByRole('button', { name: 'Replay from first epoch' })).toBeVisible();
  await epoch.getByRole('button', { name: 'Replay from first epoch' }).click();
  await expect(epochSlider).toHaveValue('0');
  await expect(epochSlider).toHaveAttribute(
    'aria-valuetext',
    /epoch 10; validation sample 1 of 15/,
  );

  const epochImage = await epoch.locator('img').first().boundingBox();
  expect(epochImage).not.toBeNull();
  expect(Math.abs(epochImage!.width - epochImage!.height)).toBeLessThanOrEqual(1);
});

test('SDF pipeline stacks with square stages on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const pipeline = page
    .locator('[data-slot="card"]')
    .filter({ hasText: 'Binary → distance field → thresholded back to crisp edges' });
  const stages = pipeline.locator('img');
  await expect(stages).toHaveCount(3);
  await stages.first().scrollIntoViewIfNeeded();
  const mobileBoxes = await stages.evaluateAll((images) =>
    images.map((image) => {
      const { x, y, width, height } = image.getBoundingClientRect();
      return { x, y, width, height };
    }),
  );
  expect(mobileBoxes[0].y).toBeLessThan(mobileBoxes[1].y);
  expect(mobileBoxes[1].y).toBeLessThan(mobileBoxes[2].y);
  for (const box of mobileBoxes) expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  const desktopBoxes = await stages.evaluateAll((images) =>
    images.map((image) => {
      const { x, y } = image.getBoundingClientRect();
      return { x, y };
    }),
  );
  expect(Math.abs(desktopBoxes[0].y - desktopBoxes[1].y)).toBeLessThanOrEqual(1);
  expect(Math.abs(desktopBoxes[1].y - desktopBoxes[2].y)).toBeLessThanOrEqual(1);
  expect(desktopBoxes[0].x).toBeLessThan(desktopBoxes[1].x);
  expect(desktopBoxes[1].x).toBeLessThan(desktopBoxes[2].x);
});

test('generated glyph grid stays square and within the viewport at mobile and tablet widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const images = page.locator('.image-grid-cols-6 img');
  await expect(images).toHaveCount(12);

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    const boxes = await images.evaluateAll((items) =>
      items.map((image) => {
        const { x, width, height } = image.getBoundingClientRect();
        return { x, width, height };
      }),
    );

    for (const box of boxes) {
      expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
  }
});

test('VAE differences keep each position grouped and include extra reconstructed characters', async ({
  page,
}) => {
  expect(buildSequenceDiffPositions('ABC', 'ABCD')).toEqual([
    { original: 'A', reconstructed: 'A', match: true },
    { original: 'B', reconstructed: 'B', match: true },
    { original: 'C', reconstructed: 'C', match: true },
    { original: null, reconstructed: 'D', match: false },
  ]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/variational-autoencoders-from-scratch');

  const positions = page
    .getByRole('list', { name: 'Sequence differences by position' })
    .first()
    .getByRole('listitem');
  await expect(positions.first()).toHaveCount(1);
  expect(await positions.count()).toBeGreaterThan(0);
  await Promise.all(
    (await positions.all()).map(async (position) => {
      await expect(position.locator(':scope > span')).toHaveCount(3);
      await expect(position).toHaveAttribute(
        'aria-label',
        /^Position \d+: source .* reconstructed .* (match|mismatch)$/,
      );
    }),
  );

  const interpolationTitle = page.getByText('Latent space interpolation');
  await interpolationTitle.scrollIntoViewIfNeeded();
  const interpolation = page.getByRole('slider', { name: 'Latent interpolation step' });
  await expect(interpolation).toHaveAttribute(
    'aria-valuetext',
    /Step 1 of \d+; latent coordinates/,
  );
  await page.getByRole('button', { name: 'Pair 2' }).click();
  await expect(interpolation).toHaveAttribute(
    'aria-valuetext',
    /Step 1 of \d+; latent coordinates/,
  );
});
