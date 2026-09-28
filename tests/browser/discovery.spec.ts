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
  const readSizes = () =>
    socialLinks.evaluateAll((links) =>
      links.map((link) => {
        const box = link.getBoundingClientRect();
        return [box.width, box.height];
      }),
    );
  await expect
    .poll(async () => (await readSizes()).every(([width, height]) => width >= 44 && height >= 44))
    .toBe(true);
  const sizes = await readSizes();
  expect(sizes.length).toBeGreaterThan(0);
  expect(sizes.every(([width, height]) => width >= 44 && height >= 44)).toBe(true);
});

test('sharing icons are visible and use the canonical content URL', async ({ page }) => {
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('footer [data-content-share]').first();
  await expect(
    page.locator('footer').getByText('Enjoyed reading? Share it with others.', { exact: true }),
  ).toBeVisible();
  await expect(sharing.locator('details, button')).toHaveCount(0);
  await expect(sharing.locator('a')).toHaveCount(4);
  const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonicalUrl).toBeTruthy();

  const targets = await sharing.locator('a').evaluateAll((links) =>
    links.map((link) => {
      const anchor = link as HTMLAnchorElement;
      const target = new URL(anchor.href);
      return {
        label: anchor.getAttribute('aria-label'),
        href: target.href,
        url: target.searchParams.get('url') ?? target.searchParams.get('u'),
        text: target.searchParams.get('text'),
        rel: anchor.rel,
        target: anchor.target,
      };
    }),
  );
  expect(targets.map(({ label }) => label)).toEqual([
    expect.stringMatching(/^Share .* on X$/),
    expect.stringMatching(/^Share .* on Bluesky$/),
    expect.stringMatching(/^Share .* on Hacker News$/),
    expect.stringMatching(/^Share .* on LinkedIn$/),
  ]);
  expect(targets[0]?.url).toBe(canonicalUrl);
  expect(targets[1]?.href).toContain('bsky.app/intent/compose');
  expect(targets[1]?.text).toContain(canonicalUrl);
  expect(targets[2]?.url).toBe(canonicalUrl);
  expect(targets[3]?.url).toBe(canonicalUrl);
  expect(targets.every(({ rel, target }) => rel.includes('noopener') && target === '_blank')).toBe(
    true,
  );
});

test('sharing controls fit at 320px and keep usable hit targets', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const sharing = page.locator('footer [data-content-share]').first();
  const headerBounds = await page.locator('main > header > .page-gutter').evaluate((element) => {
    const { left, right, width } = element.getBoundingClientRect();
    return { left, right, width };
  });
  expect(headerBounds.left).toBeGreaterThanOrEqual(0);
  expect(headerBounds.right).toBeLessThanOrEqual(320);
  const contentBounds = await sharing.evaluate((element) => {
    const { left, right } = element.getBoundingClientRect();
    const controls = Array.from(element.querySelectorAll('a'))
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
  expect(contentBounds.controls.length).toBe(4);
  expect(
    contentBounds.controls.every(
      ({ left, right, width, height }) =>
        left >= contentBounds.left && right <= 320 && width >= 36 && height >= 36,
    ),
  ).toBe(true);
});

test('the blog header keeps its author and reading link within the viewport on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/denoising-diffusion-from-scratch');

  const blogHeader = page.locator('main > header').first();
  await expect(blogHeader.getByText('Romain Graux', { exact: true })).toBeVisible();
  await expect(blogHeader.getByText('Written by', { exact: true })).toBeVisible();
  await expect(blogHeader.getByText('Share on', { exact: true })).toBeVisible();
  await expect(blogHeader.getByRole('link', { name: /Continue Reading/ })).toBeVisible();
  await expect(blogHeader.locator('[data-content-share]')).toHaveCount(1);
  await expect(page.locator('footer [data-content-share]')).toHaveCount(1);
  const blogHeaderWidth = await blogHeader.evaluate((element) => [
    element.clientWidth,
    element.scrollWidth,
  ]);
  expect(blogHeaderWidth[1]).toBeLessThanOrEqual(blogHeaderWidth[0]);

  await page.goto('/notes/corne-keyboard-5x3-3-setup');
  const noteHeader = page.locator('main header').first();
  await expect(noteHeader.locator('[data-content-share]')).toHaveCount(0);
  await expect(page.locator('footer [data-content-share]')).toHaveCount(1);
  const noteHeaderWidth = await noteHeader.evaluate((element) => [
    element.clientWidth,
    element.scrollWidth,
  ]);
  expect(noteHeaderWidth[1]).toBeLessThanOrEqual(noteHeaderWidth[0]);
});
