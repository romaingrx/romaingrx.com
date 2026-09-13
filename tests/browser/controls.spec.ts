import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/design');
});

test('Astro and React controls share variants, states, and icon targets', async ({ page }) => {
  const controls = await page.locator('#control-matrix').evaluate((matrix) => {
    const read = (selector: string) => {
      const element = matrix.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing control: ${selector}`);
      const box = element.getBoundingClientRect();
      return {
        tag: element.tagName,
        slot: element.dataset.slot,
        width: box.width,
        height: box.height,
        disabled: (element as HTMLButtonElement).disabled,
        busy: element.getAttribute('aria-busy'),
        invalid: element.getAttribute('aria-invalid'),
        hasSecondary: element.classList.contains('bg-secondary'),
      };
    };

    return {
      astroIcon: read('[data-astro-control="icon"]'),
      reactIcon: read('[data-react-control="icon"]'),
      astroLoading: read('[data-astro-control="loading"]'),
      reactLoading: read('[data-react-control="loading"]'),
      astroLink: read('[data-astro-control="link"]'),
      astroBadge: read('[data-astro-badge]'),
      reactBadge: read('[data-react-badge]'),
    };
  });

  for (const icon of [controls.astroIcon, controls.reactIcon]) {
    expect(icon.tag).toBe('BUTTON');
    expect(icon.slot).toBe('button');
    expect(icon.width).toBe(44);
    expect(icon.height).toBe(44);
  }

  for (const loading of [controls.astroLoading, controls.reactLoading]) {
    expect(loading.disabled).toBe(true);
    expect(loading.busy).toBe('true');
  }

  expect(controls.astroLink.tag).toBe('A');
  expect(controls.astroLink.slot).toBe('link');
  expect(controls.astroBadge.slot).toBe('badge');
  expect(controls.reactBadge.slot).toBe('badge');
  expect(controls.astroBadge.hasSecondary).toBe(true);
  expect(controls.reactBadge.hasSecondary).toBe(true);
});

test('icon controls have names and keyboard activation with visible focus', async ({ page }) => {
  const astroIcon = page.getByRole('button', { name: 'Astro settings' });
  const reactIcon = page.getByRole('button', { name: 'React settings' });
  await expect(astroIcon).toHaveAttribute('aria-label', 'Astro settings');
  await expect(reactIcon).toHaveAttribute('aria-label', 'React settings');

  await page.evaluate(() => {
    const action = document.querySelector<HTMLElement>('[data-astro-control="action"]');
    action?.addEventListener('click', () => action.setAttribute('data-activated', 'true'));
  });
  const action = page.getByRole('button', { name: 'Astro action' });
  await action.focus();
  await expect(action).toBeFocused();
  await expect
    .poll(() => action.evaluate((element) => getComputedStyle(element).outlineStyle))
    .toBe('solid');
  await action.press('Enter');
  await expect(action).toHaveAttribute('data-activated', 'true');
});

test('fields, alerts, loading, and links expose native semantics', async ({ page }) => {
  await expect(page.getByLabel('Display name')).toHaveAttribute('data-slot', 'input');
  await expect(page.getByLabel('Display name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Notes')).toHaveAttribute('data-slot', 'textarea');
  await expect(page.getByLabel('Notes')).toHaveAttribute('placeholder', 'A short note');
  await expect(page.getByLabel('Notes')).toHaveValue('Prefilled note');
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: 'This alert identifies the active component fixture.' }),
  ).toBeVisible();
  await expect(page.getByRole('status', { name: 'Loading' })).toBeVisible();

  const link = page.locator('[data-astro-control="link"]');
  await expect(link).toHaveJSProperty('tagName', 'A');
  await expect(link).toHaveAttribute('href', '#control-matrix-target');
  await expect(page.getByRole('button', { name: 'Saving Astro changes' })).toBeDisabled();
});

test('error alert and fields keep their text and boundary contrast', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const measureContrast = () =>
    page.locator('[data-design-error-alert]').evaluate((alert) => {
      const text = alert.querySelector('section');
      if (!text) throw new Error('Missing error alert description');
      const input = document.querySelector<HTMLInputElement>('#design-name');
      if (!input) throw new Error('Missing invalid input');
      const textarea = document.querySelector<HTMLTextAreaElement>('#design-notes');
      if (!textarea) throw new Error('Missing normal textarea');

      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const toRgb = (value: string, backdrop = '#fff') => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas is unavailable');
        context.fillStyle = backdrop;
        context.fillRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
      };
      const luminance = (value: string, backdrop?: string) =>
        toRgb(value, backdrop)
          .map((channel) => channel / 255)
          .map((channel) =>
            channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
          )
          .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
      const ratio = (foreground: string, background: string, backdrop?: string) => {
        const foregroundLuminance = luminance(foreground, backdrop);
        const backgroundLuminance = luminance(background, backdrop);
        return (
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
        );
      };
      const pageBackground = getComputedStyle(document.body).backgroundColor;
      return {
        alert: ratio(
          getComputedStyle(text).color,
          getComputedStyle(alert).backgroundColor,
          pageBackground,
        ),
        input: ratio(
          getComputedStyle(input).borderTopColor,
          getComputedStyle(input).backgroundColor,
          pageBackground,
        ),
        textarea: ratio(
          getComputedStyle(textarea).borderTopColor,
          getComputedStyle(textarea).backgroundColor,
          pageBackground,
        ),
      };
    });

  const lightContrast = await measureContrast();
  await page.evaluate(() => window.themeController?.setTheme('dark'));
  await expect(page.locator('html')).toHaveAttribute('data-theme-resolved', 'dark');
  const darkContrast = await measureContrast();

  for (const contrast of [lightContrast, darkContrast]) {
    expect(contrast.alert).toBeGreaterThanOrEqual(4.5);
    expect(contrast.input).toBeGreaterThanOrEqual(3);
    expect(contrast.textarea).toBeGreaterThanOrEqual(3);
  }
});
