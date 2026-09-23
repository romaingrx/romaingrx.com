import { expect, test } from '@playwright/test';
import sharp from 'sharp';

function taxonomyCount(text: string): number {
  const match = text.match(/\((\d+)\)$/);
  expect(match, `expected a taxonomy count in "${text}"`).not.toBeNull();
  return Number(match![1]);
}

test('blog filters separate categories and tags, format labels, and show counts and selection', async ({
  page,
}) => {
  await page.goto('/blog');

  const filters = page.getByRole('navigation', { name: 'Filter posts' });
  const categories = filters.getByRole('group', { name: 'Categories' });
  const tags = filters.getByRole('group', { name: 'Tags' });
  await expect(categories.getByText('Categories', { exact: true })).toBeVisible();
  const machineLearning = categories.getByRole('link', { name: /^ML \(\d+\)$/ });
  const fromScratch = tags.getByRole('link', { name: /^From Scratch \(\d+\)$/ });

  await expect(machineLearning).toHaveAttribute('href', '/blog/category/ml');
  await expect(tags.getByRole('link', { name: /^LLM \(\d+\)$/ })).toHaveAttribute(
    'href',
    '/blog/tag/llm',
  );
  await expect(fromScratch).toHaveAttribute('href', '/blog/tag/from%20scratch');
  const fromScratchCount = taxonomyCount(await fromScratch.innerText());
  await fromScratch.click();

  await expect(page).toHaveURL(/\/blog\/tag\/from%20scratch\/?$/);
  const selectedTag = page
    .getByRole('navigation', { name: 'Filter posts' })
    .getByRole('link', { name: /^From Scratch \(\d+\)$/ });
  await expect(selectedTag).toHaveAttribute('aria-current', 'page');
  await expect(selectedTag).toHaveAttribute('href', '/blog/tag/from%20scratch');
  const visibleCards = page.locator('main a[href^="/blog/"]').filter({ has: page.locator('h2') });
  const cardCount = await visibleCards.count();
  expect(cardCount).toBe(fromScratchCount);
  await expect(
    page.getByText(`${cardCount} ${cardCount === 1 ? 'post' : 'posts'}`, { exact: true }),
  ).toBeVisible();
});

test('coverless posts use a readable text card', async ({ page }) => {
  await page.goto('/blog');

  const post = page.locator('main a[href="/blog/improvement-plan"]');
  await expect(post.getByRole('heading', { name: 'Improvement plan' })).toBeVisible();
  await expect(post.locator('img')).toHaveCount(0);
  await expect(post).toContainText('Becoming a better human at human things');
});

test('note tag navigation has all-notes return path and one anchor per visible card', async ({
  page,
}) => {
  await page.goto('/notes/tag/machine-learning');

  await expect(
    page.getByRole('heading', { name: 'Notes tagged “Machine-Learning”' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'All notes' })).toHaveAttribute('href', '/notes');

  const cards = page.locator('main a[href^="/notes/"]').filter({ has: page.locator('h2') });
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThan(0);
  await expect(cards.locator('a')).toHaveCount(0);
  await expect(cards.locator('time')).toHaveCount(cardCount);
  await expect(cards.locator('time').first()).toBeVisible();
  await expect(cards.locator('p')).toHaveCount(cardCount);
  await expect(cards.locator('p').first()).toBeVisible();
});

test('notes with no matching tags fall back to recent notes and exclude the current note', async ({
  page,
}) => {
  await page.goto('/notes/corne-keyboard-5x3-3-setup');

  const moreNotes = page
    .locator('footer')
    .filter({ has: page.getByRole('heading', { name: 'More Notes' }) });
  const relatedCards = moreNotes.locator('a[href^="/notes/"]').filter({ has: page.locator('h2') });
  const relatedCount = await relatedCards.count();
  expect(relatedCount).toBeGreaterThan(0);
  expect(relatedCount).toBeLessThanOrEqual(3);
  const relatedHrefs = await relatedCards.evaluateAll((cards) =>
    cards.map((card) => card.getAttribute('href')),
  );
  expect(relatedHrefs).not.toContain('/notes/corne-keyboard-5x3-3-setup');
});

test('profile portrait uses compiled responsive variants and deliberate priority', async ({
  page,
}) => {
  await page.goto('/about');

  const portrait = page.getByRole('img', { name: 'Romain Graux', exact: true }).first();
  await expect(portrait).toHaveAttribute('loading', 'eager');
  await expect(portrait).toHaveAttribute('fetchpriority', 'high');
  await expect(portrait).toHaveAttribute('sizes', '(max-width: 640px) 128px, 160px');
  const srcset = await portrait.getAttribute('srcset');
  expect(srcset).toBeTruthy();
  const variants = srcset!.split(',').map((candidate) => {
    const [url, width] = candidate.trim().split(/\s+/);
    return { url: new URL(url, page.url()).toString(), width: Number(width.replace('w', '')) };
  });
  expect(variants.map(({ width }) => width).toSorted((a, b) => a - b)).toEqual([
    128, 160, 256, 320,
  ]);
  await expect(portrait).toHaveAttribute('src', /_astro/);
  await Promise.all(
    variants.map(async (variant) => {
      const response = await page.request.get(variant.url);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/webp');
      const image = await sharp(await response.body()).metadata();
      expect(image.format).toBe('webp');
      expect(image.width).toBe(variant.width);
      expect(image.height).toBe(variant.width);
    }),
  );
});

test('timeline uses ordered roles and readable month dates', async ({ page }) => {
  await page.goto('/about');

  const experience = page.locator('[data-timeline="experience"]');
  await expect(experience.locator('h3')).toHaveText([
    'Co-founder & tech lead',
    'Machine Learning Engineer',
    'Teaching Assistant',
    'Computer Vision Internship',
  ]);
  await expect(experience.locator('.font-mono').first()).toHaveText('Jan 2024 – Present');
});

test('author hover-card social links have names and 44px targets', async ({ page }) => {
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const authorImage = page.getByRole('img', { name: 'Romain Graux', exact: true }).first();
  const imageUrl = new URL((await authorImage.getAttribute('src'))!, page.url()).toString();
  const imageResponse = await page.request.get(imageUrl);
  const avatar = await sharp(await imageResponse.body()).metadata();
  expect(imageResponse.ok()).toBe(true);
  expect(avatar.format).toBe('webp');
  expect(avatar.width).toBe(32);
  expect(avatar.height).toBe(32);

  await authorImage.hover();
  const socialLinks = page.getByRole('link', { name: /^Follow Romain Graux on / });
  await expect(socialLinks.first()).toBeVisible();
  const sizes = await socialLinks.evaluateAll((links) =>
    links.map((link) => {
      const box = link.getBoundingClientRect();
      return [box.width, box.height];
    }),
  );
  expect(sizes.length).toBeGreaterThan(0);
  expect(sizes.every(([width, height]) => width >= 44 && height >= 44)).toBe(true);
});

test('copy link reports success and uses the canonical content URL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: (url: string) => Promise.resolve(Reflect.set(window, 'copiedUrl', url)) },
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('[data-content-share]').first();
  await sharing.getByRole('button', { name: 'Copy link' }).click();
  await expect(sharing.getByRole('status')).toHaveText('Link copied.');

  const copiedUrl = await page.evaluate(() => Reflect.get(window, 'copiedUrl'));
  const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(copiedUrl).toBe(canonicalUrl);
  const linkedIn = sharing.getByRole('link', { name: /Share .* on LinkedIn/ });
  const linkedInUrl = new URL((await linkedIn.getAttribute('href'))!);
  expect(linkedInUrl.searchParams.get('url')).toBe(canonicalUrl);
  expect(linkedInUrl.searchParams.has('text')).toBe(false);
});

test('sharing controls fit at 320px and keep 44px hit targets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: () => Promise.resolve(),
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('[data-content-share]').first();
  const row = sharing.locator(':scope > div').first();
  const metrics = await row.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    linkWidths: Array.from(element.querySelectorAll('a')).map(
      (control) => control.getBoundingClientRect().width,
    ),
    controlWidths: Array.from(element.querySelectorAll('a, button')).map(
      (control) => control.getBoundingClientRect().width,
    ),
    controlHeights: Array.from(element.querySelectorAll('a, button')).map(
      (control) => control.getBoundingClientRect().height,
    ),
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
  expect(metrics.controlHeights).toHaveLength(5);
  expect(metrics.controlHeights.every((height) => height >= 44)).toBe(true);
  expect(metrics.linkWidths).toHaveLength(3);
  expect(metrics.linkWidths.every((width) => width >= 44)).toBe(true);
  expect(metrics.controlWidths.every((width) => width >= 44)).toBe(true);
  expect(await page.locator('html').evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(
    320,
  );
});

test('the blog author and share controls stack without horizontal overflow on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: (payload: ShareData) => Promise.resolve(Reflect.set(window, 'sharedPayload', payload)),
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const controls = page.locator('main [data-header-controls]').first();
  const layout = await controls.evaluate((element) => {
    const author = element.querySelector('[data-header-author]');
    const share = element.querySelector('[data-header-share]');
    if (!author || !share) throw new Error('Header author or share controls are missing');
    const authorBox = author.getBoundingClientRect();
    const shareBox = share.getBoundingClientRect();
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      authorBottom: authorBox.bottom,
      shareTop: shareBox.top,
    };
  });

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
  expect(layout.shareTop).toBeGreaterThanOrEqual(layout.authorBottom);
  const blogHeader = page.locator('main > header').first();
  const blogHeaderWidth = await blogHeader.evaluate((element) => [
    element.clientWidth,
    element.scrollWidth,
  ]);
  expect(blogHeaderWidth[1]).toBeLessThanOrEqual(blogHeaderWidth[0]);

  await page.goto('/notes/corne-keyboard-5x3-3-setup');
  const noteHeader = page.locator('main header').first();
  const noteHeaderWidth = await noteHeader.evaluate((element) => [
    element.clientWidth,
    element.scrollWidth,
  ]);
  expect(noteHeaderWidth[1]).toBeLessThanOrEqual(noteHeaderWidth[0]);
});

test('clipboard errors show a selectable URL instead of a false success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('Clipboard denied')) },
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('[data-content-share]').first();
  await sharing.getByRole('button', { name: 'Copy link' }).click();
  await expect(sharing.getByRole('status')).toHaveText(
    'Copy failed. Select the URL below to copy it.',
  );
  const fallback = sharing.locator('[data-share-url]');
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveValue(/denoising-diffusion-from-scratch/);
  await expect(fallback).toHaveAttribute('readonly', '');
});

test('native sharing reports success, cancellation, and failure accurately', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: (payload: ShareData) => Promise.resolve(Reflect.set(window, 'sharedPayload', payload)),
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('[data-content-share]').first();
  const shareButton = sharing.getByRole('button', { name: 'Share' });
  await expect(shareButton).toBeVisible();
  expect(await shareButton.evaluate((button) => getComputedStyle(button).display)).toBe('flex');
  expect(await shareButton.evaluate((button) => getComputedStyle(button).flexDirection)).toBe(
    'row',
  );
  const expectedTitle = await sharing.getAttribute('data-share-title');
  const expectedUrl = await sharing.locator('[data-share-url]').inputValue();
  expect(expectedTitle).toBeTruthy();
  await shareButton.click();
  await expect(sharing.getByRole('status')).toHaveText('Link shared.');
  expect(await page.evaluate(() => Reflect.get(window, 'sharedPayload'))).toEqual({
    title: expectedTitle,
    url: expectedUrl,
  });

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: () => Promise.reject(new DOMException('Canceled', 'AbortError')),
    });
  });
  await shareButton.click();
  await expect(sharing.getByRole('status')).toHaveText('Sharing canceled.');
  await expect(sharing.locator('[data-share-url]')).toBeHidden();

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: () => Promise.reject(new Error('Share unavailable')),
    });
  });
  await shareButton.click();
  await expect(sharing.getByRole('status')).toHaveText(
    'Sharing failed. Select the URL below to copy it.',
  );
  await expect(sharing.locator('[data-share-url]')).toBeVisible();
});
