import { getCollection as astroGetCollection, render, type CollectionEntry } from 'astro:content';

import { NODE_ENV } from 'astro:env/client';

import { absolute, routes } from '@/configs/routes';

export type Author = CollectionEntry<'author'>;
export type BlogPost = CollectionEntry<'blog'>;
export type Note = CollectionEntry<'note'>;

export type WithAuthors<T> = Omit<T, 'authors'> & {
  authors: Author[];
  readingTime: string;
  slug: string;
  url: string;
};

export type BlogPostWithAuthors = WithAuthors<BlogPost>;
export type NoteWithAuthors = WithAuthors<Note>;

type ContentEntry = BlogPost | Note;

async function resolveAuthors(entry: ContentEntry, authors: Author[]): Promise<Author[]> {
  return Promise.all(
    entry.data.authors.map((ref: { id: string }) => {
      const author = authors.find((a) => a.id === ref.id);
      if (!author) throw new Error(`Author ${ref.id} not found`);
      return author;
    }),
  );
}

function assertUniquePermalinks(entries: readonly ContentEntry[]): void {
  const seen = new Map<string, string>();
  for (const entry of entries) {
    const previousId = seen.get(entry.data.permalink);
    if (previousId) {
      throw new Error(
        `Duplicate content permalink "${entry.data.permalink}" in ${previousId} and ${entry.id}`,
      );
    }
    seen.set(entry.data.permalink, entry.id);
  }
}

function isVisible(entry: ContentEntry): boolean {
  return NODE_ENV === 'production'
    ? entry.data.status === 'published'
    : entry.data.status !== 'archived';
}

async function getContentWithAuthors<T extends ContentEntry>(
  entries: readonly T[],
  createPath: (params: { slug: string }) => string,
): Promise<WithAuthors<T>[]> {
  const authors = await astroGetCollection('author');

  return Promise.all(
    entries
      .filter(isVisible)
      .toSorted((a, b) => b.data.published_date.getTime() - a.data.published_date.getTime())
      .map(async (entry) => {
        const { remarkPluginFrontmatter } = await render(entry);
        const resolved = await resolveAuthors(entry, authors);
        const slug = entry.data.permalink;
        const contentPath = createPath({ slug });
        return Object.assign({}, entry, {
          authors: resolved,
          readingTime: remarkPluginFrontmatter?.minutesRead || '1 min read',
          slug,
          url: absolute(contentPath.endsWith('/') ? contentPath : `${contentPath}/`),
        });
      }),
  );
}

export async function getBlogPosts(): Promise<BlogPostWithAuthors[]> {
  const entries = await astroGetCollection('blog');
  assertUniquePermalinks(entries);
  return getContentWithAuthors(entries, routes.blog);
}

export async function getNotes(): Promise<NoteWithAuthors[]> {
  const entries = await astroGetCollection('note');
  assertUniquePermalinks(entries);
  return getContentWithAuthors(entries, routes.note);
}

export async function getAuthors(): Promise<Author[]> {
  return astroGetCollection('author');
}
