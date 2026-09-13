import { expect, test } from '@playwright/test';

type Rgb = [number, number, number];

const parseRgb = (value: string): Rgb => {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) throw new Error(`Expected an RGB color, received ${value}`);
  const channels = match[1]
    .split(',')
    .slice(0, 3)
    .map((channel) => Number.parseFloat(channel));
  if (channels.length < 3 || channels.some(Number.isNaN)) {
    throw new Error(`Expected an RGB color, received ${value}`);
  }
  return [channels[0], channels[1], channels[2]];
};

const parseColor = (value: string): Rgb => {
  if (value.startsWith('rgb')) return parseRgb(value);

  const oklchMatch = value.match(/oklch\(([^)]+)\)/);
  const oklabMatch = value.match(/oklab\(([^)]+)\)/);
  const match = oklchMatch ?? oklabMatch;
  if (!match) throw new Error(`Expected an RGB, OKLCH, or OKLab color, received ${value}`);
  const channels = match[1]
    .replaceAll('/', ' ')
    .split(/\s+/)
    .slice(0, 3)
    .map((channel) => Number.parseFloat(channel));
  if (channels.length < 3 || channels.some(Number.isNaN)) {
    throw new Error(`Expected an OKLCH or OKLab color, received ${value}`);
  }

  const [lightness, a, b] = oklchMatch
    ? [
        channels[0],
        channels[1] * Math.cos((channels[2] * Math.PI) / 180),
        channels[1] * Math.sin((channels[2] * Math.PI) / 180),
      ]
    : channels;
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return linear.map((channel) => {
    const srgb = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, srgb)) * 255;
  }) as Rgb;
};

const relativeLuminance = ([red, green, blue]: Rgb) =>
  [red, green, blue]
    .map((channel) => channel / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
    .reduce(
      (luminance, channel, index) => luminance + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );

const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = relativeLuminance(parseColor(foreground));
  const backgroundLuminance = relativeLuminance(parseColor(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};

test('stored preference drives theme state and accessible control labels', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/design');

  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect(root).toHaveAttribute('data-theme-resolved', 'dark');
  await expect(page.locator('#theme-toggle')).toHaveAttribute(
    'aria-label',
    'Theme: Dark. Activate to change theme',
  );

  await page.locator('#theme-toggle').dispatchEvent('click');
  await expect(root).toHaveAttribute('data-theme', 'system');
  await expect(page.locator('#theme-toggle')).toHaveAttribute(
    'aria-label',
    /Theme: System \(Light\)/,
  );

  await page.locator('#theme-toggle').dispatchEvent('click');
  await expect(root).toHaveAttribute('data-theme', 'light');
});

test('system preference updates when the operating preference changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.removeItem('theme'));
  await page.goto('/design');

  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'system');
  await expect(root).toHaveAttribute('data-theme-resolved', 'dark');

  await page.emulateMedia({ colorScheme: 'light' });
  await expect(root).toHaveAttribute('data-theme-resolved', 'light');
  await expect(root).not.toHaveClass(/dark/);
});

test('theme changes remain available when storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage unavailable');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage unavailable');
    };
  });
  await page.goto('/design');

  const root = page.locator('html');
  await expect(root).toHaveAttribute('data-theme', 'system');
  await page.locator('#theme-toggle').dispatchEvent('click');
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('#theme-toggle')).toHaveAttribute(
    'aria-label',
    'Theme: Light. Activate to change theme',
  );
});

test('fixture uses reading fonts, readable links, and scoped media rules', async ({ page }) => {
  await page.goto('/design');
  await page.evaluate(() => document.fonts.ready);

  const typography = await page.locator('[data-design-typography]').evaluate((article) => {
    const reading = article.querySelector('[data-design-reading]');
    const code = article.querySelector('[data-design-code]');
    const link = article.querySelector('a');
    const articleImage = article.querySelector('[data-design-article-image]');
    const widgetImage = article.querySelector('[data-design-media-widget] img');
    if (!reading || !code || !link || !articleImage || !widgetImage) {
      throw new Error('Design fixture typography elements are missing');
    }
    const readingStyle = getComputedStyle(reading);
    const codeStyle = getComputedStyle(code);
    const linkStyle = getComputedStyle(link);
    const bodyStyle = getComputedStyle(document.body);
    return {
      readingFont: readingStyle.fontFamily,
      codeFont: codeStyle.fontFamily,
      linkDecoration: linkStyle.textDecorationLine,
      linkContrast: [linkStyle.color, bodyStyle.backgroundColor] as const,
      articleImageMarginTop: getComputedStyle(articleImage).marginTop,
      widgetImageMarginTop: getComputedStyle(widgetImage).marginTop,
      widgetImageWidth: getComputedStyle(widgetImage).width,
    };
  });

  expect(typography.readingFont).toContain('Fira Sans');
  expect(typography.codeFont).toContain('Fira Code');
  expect(typography.linkDecoration).toContain('underline');
  expect(contrastRatio(...typography.linkContrast)).toBeGreaterThanOrEqual(4.5);
  expect(typography.articleImageMarginTop).toBe('32px');
  expect(typography.widgetImageMarginTop).toBe('0px');
  expect(typography.widgetImageWidth).toBe('240px');
});

test('status and category colors keep their foreground contrast', async ({ page }) => {
  await page.goto('/design');
  const statusPairs = await page.locator('[data-design-status]').evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      return [style.color, style.backgroundColor] as const;
    }),
  );

  for (const pair of statusPairs) {
    expect(contrastRatio(...pair)).toBeGreaterThanOrEqual(4.5);
  }

  await page.evaluate(() => window.themeController?.setTheme('dark'));
  await expect(page.locator('html')).toHaveAttribute('data-theme-resolved', 'dark');
  const darkStatusPairs = await page.locator('[data-design-status]').evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      return [style.color, style.backgroundColor] as const;
    }),
  );
  for (const pair of darkStatusPairs) {
    expect(contrastRatio(...pair)).toBeGreaterThanOrEqual(4.5);
  }
});

test('category colors stay readable in both themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://giscus.app/**', (route) => route.abort());
  await page.goto('/blog/improvement-plan');
  const readCategoryPairs = () =>
    page.locator('main [data-slot="badge"][style*="chart-"]').evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return [style.color, style.backgroundColor] as const;
      }),
    );

  const lightPairs = await readCategoryPairs();
  expect(lightPairs.length).toBeGreaterThan(0);
  const readMinimumContrast = async () => {
    const pairs = await readCategoryPairs();
    if (pairs.length === 0) throw new Error('Expected category badge colors on the article page');
    return Math.min(...pairs.map((pair) => contrastRatio(...pair)));
  };
  await expect.poll(readMinimumContrast).toBeGreaterThanOrEqual(4.5);

  await page.evaluate(() => window.themeController?.setTheme('dark'));
  await expect(page.locator('html')).toHaveAttribute('data-theme-resolved', 'dark');
  await expect.poll(readMinimumContrast).toBeGreaterThanOrEqual(4.5);
});

test('Giscus receives the current theme after delayed iframe readiness', async ({ page }) => {
  await page.route('https://giscus.app/client.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `
        const frame = document.createElement('iframe');
        frame.className = 'giscus-frame';
        frame.src = 'https://giscus.app/widget.html';
        document.currentScript.parentElement.appendChild(frame);
      `,
    }),
  );
  await page.route('https://giscus.app/widget.html', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `
        <!doctype html><script>
          const receiveTheme = (event) => {
            const theme = event.data?.giscus?.setConfig?.theme;
            if (theme) parent.postMessage({ giscus: { themeApplied: theme } }, '*');
          };
          window.addEventListener('message', (event) => {
            if (event.data?.test === 'installReceiver') {
              window.addEventListener('message', receiveTheme);
              parent.postMessage({ giscus: { resizeHeight: 1 } }, '*');
            }
          });
        </script>
      `,
    }),
  );
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
    (window as Window & { giscusThemes?: string[] }).giscusThemes = [];
    window.addEventListener('message', (event) => {
      const theme = event.data?.giscus?.themeApplied;
      if (event.origin === 'https://giscus.app' && typeof theme === 'string') {
        (window as Window & { giscusThemes?: string[] }).giscusThemes?.push(theme);
      }
    });
  });
  const widgetFrame = page.waitForEvent(
    'framenavigated',
    (frame) => frame.url() === 'https://giscus.app/widget.html',
  );
  await page.goto('/blog/improvement-plan');
  await widgetFrame;

  const giscusScript = page.locator('#comments script[src*="giscus"]');
  await expect(giscusScript).toHaveAttribute('data-theme', 'dark');
  await page.evaluate(() => window.themeController?.setTheme('light'));
  await expect(giscusScript).toHaveAttribute('data-theme', 'light');
  await page.evaluate(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage({ test: 'installReceiver' }, 'https://giscus.app');
  });
  await expect
    .poll(() => page.evaluate(() => (window as Window & { giscusThemes?: string[] }).giscusThemes))
    .toContain('light');
});

test('reduced motion removes smooth scrolling and transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/design');

  const motion = await page.locator('[data-design-reading] a').evaluate((link) => {
    const style = getComputedStyle(link);
    const duration = style.transitionDuration.endsWith('ms')
      ? Number.parseFloat(style.transitionDuration)
      : Number.parseFloat(style.transitionDuration) * 1000;
    return {
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: duration,
    };
  });
  expect(motion.scrollBehavior).toBe('auto');
  expect(motion.transitionDuration).toBeLessThanOrEqual(0.01);
});
