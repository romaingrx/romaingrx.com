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
  const tagDisclosure = filters.locator('details');
  await expect(tagDisclosure).toHaveJSProperty('open', false);
  await tagDisclosure.locator('summary').click();
  const tags = tagDisclosure.getByRole('group', { name: 'Tags' });
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
  const activeTagFilters = page.getByRole('navigation', { name: 'Filter posts' });
  await expect(activeTagFilters.locator('details')).toHaveJSProperty('open', true);
  const selectedTag = activeTagFilters.getByRole('link', { name: /^From Scratch \(\d+\)$/ });
  await expect(selectedTag).toHaveAttribute('aria-current', 'page');
  await expect(selectedTag).toHaveAttribute('href', '/blog/tag/from%20scratch');
  const visibleCards = page.locator('main a[href^="/blog/"]').filter({ has: page.locator('h2') });
  const cardCount = await visibleCards.count();
  expect(cardCount).toBe(fromScratchCount);
});

test('coverless posts keep the shared media frame and readable metadata', async ({ page }) => {
  await page.goto('/blog');

  const post = page.locator('main a[href="/blog/improvement-plan"]');
  await expect(post.getByRole('heading', { name: 'Improvement plan' })).toBeVisible();
  await expect(post.getByRole('heading', { name: 'Improvement plan', exact: true })).toHaveCount(1);
  await expect(post.locator('img')).toHaveCount(0);
  await expect(post).toContainText('Becoming a better human at human things');

  const coveredPost = page
    .locator('main a[href^="/blog/"]')
    .filter({ has: page.locator('img') })
    .first();
  const [coverlessRatio, coveredRatio] = await Promise.all(
    [post, coveredPost].map((card) =>
      card
        .locator(':scope > div')
        .first()
        .evaluate((frame) => {
          const { width, height } = frame.getBoundingClientRect();
          return width / height;
        }),
    ),
  );
  expect(coverlessRatio).toBeCloseTo(coveredRatio, 2);
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

test('author hover-card social links have names and pointer-sized targets', async ({ page }) => {
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
  const readSizes = () =>
    socialLinks.evaluateAll((links) =>
      links.map((link) => {
        const box = link.getBoundingClientRect();
        return [box.width, box.height];
      }),
    );
  const targetSize = await page.evaluate(() =>
    window.matchMedia('(pointer: coarse)').matches ? 44 : 36,
  );
  await expect
    .poll(async () =>
      (await readSizes()).every(([width, height]) => width === targetSize && height === targetSize),
    )
    .toBe(true);
  const sizes = await readSizes();
  expect(sizes.length).toBeGreaterThan(0);
  expect(sizes.every(([width, height]) => width === targetSize && height === targetSize)).toBe(
    true,
  );
});

test('copy link reports success and uses the canonical content URL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: (url: string) => Promise.resolve(Reflect.set(window, 'copiedUrl', url)) },
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('footer [data-content-share]').first();
  const moreOptions = sharing.locator('[data-share-options]');
  await expect(moreOptions).not.toHaveAttribute('open', '');
  await sharing.getByRole('button', { name: 'Copy link' }).click();
  await expect(sharing.getByRole('status')).toHaveText('Link copied.');

  const copiedUrl = await page.evaluate(() => Reflect.get(window, 'copiedUrl'));
  const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(copiedUrl).toBe(canonicalUrl);
  await moreOptions.locator('summary').click();
  const linkedIn = sharing.getByRole('link', { name: /Share .* on LinkedIn/ });
  const linkedInUrl = new URL((await linkedIn.getAttribute('href'))!);
  expect(linkedInUrl.searchParams.get('url')).toBe(canonicalUrl);
  expect(linkedInUrl.searchParams.has('text')).toBe(false);
});

test('sharing controls fit at 320px and keep usable hit targets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: () => Promise.resolve(),
    });
  });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('footer [data-content-share]').first();
  const options = sharing.locator('[data-share-options]');
  await expect(options).not.toHaveAttribute('open', '');
  await options.locator('summary').click();
  const headerBounds = await page.locator('header > .w-full > .page-gutter').evaluate((element) => {
    const { left, right, width } = element.getBoundingClientRect();
    return { left, right, width };
  });
  expect(headerBounds.left).toBeGreaterThanOrEqual(0);
  expect(headerBounds.right).toBeLessThanOrEqual(320);
  const contentBounds = await sharing.evaluate((element) => {
    const { left, right } = element.getBoundingClientRect();
    const controls = Array.from(element.querySelectorAll('a, button, summary'))
      .filter((control) => getComputedStyle(control).display !== 'none')
      .map((control) => {
        const { left, right, width, height } = control.getBoundingClientRect();
        return { left, right, width, height };
      });
    return {
      left,
      right,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      controls,
    };
  });
  expect(contentBounds.right).toBeLessThanOrEqual(320);
  expect(contentBounds.scrollWidth).toBeLessThanOrEqual(contentBounds.clientWidth);
  expect(contentBounds.controls.length).toBeGreaterThanOrEqual(5);
  expect(
    contentBounds.controls.every(
      ({ left, right, width, height }) =>
        left >= contentBounds.left && right <= 320 && width >= 36 && height >= 36,
    ),
  ).toBe(true);
});

test('the blog header stays compact and sharing lives in the footer on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const blogHeader = page.locator('main > header').first();
  await expect(blogHeader.locator('[data-post-meta]')).toContainText('Romain Graux');
  await expect(blogHeader.getByText('Written by', { exact: true })).toHaveCount(0);
  await expect(blogHeader.getByText('Share on', { exact: true })).toHaveCount(0);
  await expect(blogHeader.getByRole('link', { name: /Continue Reading/ })).toHaveCount(0);
  await expect(blogHeader.locator('[data-content-share]')).toHaveCount(0);
  await expect(page.locator('footer [data-content-share]')).toHaveCount(1);
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

  const sharing = page.locator('footer [data-content-share]').first();
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

  const sharing = page.locator('footer [data-content-share]').first();
  await sharing.locator('[data-share-options] summary').click();
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
