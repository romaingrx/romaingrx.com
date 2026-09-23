import { expect, test } from '@playwright/test';

test('StepSlider handles empty, single, end, replay, seek, and example changes', async ({
  page,
}) => {
  await page.goto('/design');

  const empty = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Empty steps', { exact: true }) });
  await expect(empty.getByRole('status')).toHaveText('No steps are available for this example.');
  await expect(empty.getByRole('slider')).toHaveCount(0);

  const single = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Single step', { exact: true }) });
  await expect(single.getByText('Only timestep t = 10 is available.')).toBeVisible();
  await expect(single.getByRole('slider')).toHaveCount(0);
  await expect(single.getByRole('button', { name: /play|pause|replay/i })).toHaveCount(0);

  const timed = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Timed steps', { exact: true }) });
  const slider = timed.getByRole('slider', { name: 'Timed steps timestep' });
  await timed.scrollIntoViewIfNeeded();
  await expect(
    page.locator('astro-island[component-export="StepSlider"]:not([ssr])').filter({ has: timed }),
  ).toHaveCount(1);
  await expect(slider).toHaveAttribute('aria-valuetext', 'timestep 10; step 1 of 3');
  await timed.getByRole('button', { name: 'Play timesteps' }).click();
  await expect(timed.getByRole('button', { name: 'Pause playback' })).toBeVisible();
  await timed.getByRole('button', { name: 'Pause playback' }).click();
  const pausedAt = await slider.getAttribute('aria-valuetext');
  await page.waitForTimeout(600);
  await expect(slider).toHaveAttribute('aria-valuetext', pausedAt!);

  await timed.getByRole('button', { name: 'Play timesteps' }).click();
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuetext', 'timestep 20; step 2 of 3');
  await expect(timed.getByRole('button', { name: 'Play timesteps' })).toBeVisible();
  await page.waitForTimeout(600);
  await expect(slider).toHaveAttribute('aria-valuetext', 'timestep 20; step 2 of 3');

  await timed.getByRole('button', { name: 'Play timesteps' }).click();
  await expect(slider).toHaveAttribute('aria-valuetext', 'timestep 30; step 3 of 3');
  await expect(timed.getByRole('button', { name: 'Replay from first timestep' })).toBeVisible();

  await timed.getByRole('button', { name: 'Replay from first timestep' }).click();
  await expect(slider).toHaveAttribute('aria-valuetext', 'timestep 10; step 1 of 3');
  await expect(timed.getByRole('button', { name: 'Pause playback' })).toBeVisible();

  const example = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Example playback', { exact: true }) });
  const exampleSlider = example.getByRole('slider', { name: 'Example playback timestep' });
  await example.getByRole('button', { name: 'Play timesteps' }).click();
  await example.getByRole('button', { name: 'B', exact: true }).click();
  await expect(exampleSlider).toHaveValue('0');
  await expect(exampleSlider).toHaveAttribute('aria-valuetext', 'timestep 10; step 1 of 2');
  await expect(example.getByRole('button', { name: 'Play timesteps' })).toBeVisible();
  await page.waitForTimeout(600);
  await expect(exampleSlider).toHaveValue('0');
});

test('Examples carousel keeps named 44px controls and announces its active slide', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/design');

  const carousel = page.getByRole('region', { name: 'Code examples' });
  const previous = carousel.getByRole('button', { name: 'Previous slide' });
  const next = carousel.getByRole('button', { name: 'Next slide' });
  await expect(previous).toBeVisible();
  await expect(next).toBeVisible();
  const nextBox = await next.boundingBox();
  expect(nextBox).not.toBeNull();
  expect(nextBox!.width).toBeGreaterThanOrEqual(44);
  expect(nextBox!.height).toBeGreaterThanOrEqual(44);

  await expect(carousel.getByText('Example 1 of 2')).toBeVisible();
  await expect(carousel.getByRole('group', { name: 'Example 1 of 2' })).toHaveAttribute(
    'aria-current',
    'true',
  );
  await next.click();
  await expect(carousel.getByText('Example 2 of 2')).toBeVisible();
  await expect(carousel.getByRole('group', { name: 'Example 2 of 2' })).toHaveAttribute(
    'aria-current',
    'true',
  );
  await previous.click();
  await expect(carousel.getByText('Example 1 of 2')).toBeVisible();
});

test('playback clears its interval when the component unmounts', async ({ page }) => {
  await page.addInitScript(() => {
    const active = new Set<number>();
    const originalSetInterval = window.setInterval.bind(window);
    const originalClearInterval = window.clearInterval.bind(window);

    window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
      const id = originalSetInterval(handler, timeout, ...args);
      active.add(id);
      return id;
    }) as typeof window.setInterval;
    window.clearInterval = ((id: number) => {
      active.delete(id);
      originalClearInterval(id);
    }) as typeof window.clearInterval;
    Object.defineProperty(window, 'activeWidgetIntervalCount', { get: () => active.size });
  });

  await page.goto('/design');
  const activeIntervals = () =>
    page.evaluate(
      () => (window as unknown as { activeWidgetIntervalCount: number }).activeWidgetIntervalCount,
    );
  const baseline = await activeIntervals();
  const timerFixture = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText('Timer cleanup', { exact: true }) });
  await timerFixture.getByRole('button', { name: 'Play timesteps' }).click();
  await expect.poll(activeIntervals).toBe(baseline + 1);
  await page.getByRole('button', { name: 'Unmount timer fixture' }).click();
  await expect(page.getByText('Timer cleanup', { exact: true })).toHaveCount(0);
  await expect.poll(activeIntervals).toBe(baseline);
});
