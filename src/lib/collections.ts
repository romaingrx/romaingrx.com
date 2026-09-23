import { getCollection as astroGetCollection, type CollectionEntry } from 'astro:content';

import { NODE_ENV } from 'astro:env/client';
import getReadingTime from 'reading-time';

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

function resolveAuthors(entry: ContentEntry, authors: ReadonlyMap<string, Author>): Author[] {
  return entry.data.authors.map((ref: { id: string }) => {
    const author = authors.get(ref.id);
    if (!author) throw new Error(`Author ${ref.id} not found`);
    return author;
  });
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

function getContentWithAuthors<T extends ContentEntry>(
  entries: readonly T[],
  createPath: (params: { slug: string }) => string,
  authorEntries: readonly Author[],
): WithAuthors<T>[] {
  const authors = new Map(authorEntries.map((author) => [author.id, author]));

  return entries
    .filter(isVisible)
    .toSorted((a, b) => b.data.published_date.getTime() - a.data.published_date.getTime())
    .map((entry) => {
      const resolved = resolveAuthors(entry, authors);
      const slug = entry.data.permalink;
      const path = createPath({ slug });
      return Object.assign({}, entry, {
        authors: resolved,
        readingTime: getReadingTime(entry.body ?? '').text,
        slug,
        url: absolute(path.endsWith('/') ? path : `${path}/`),
      });
    });
}

export async function getBlogPosts(authors?: readonly Author[]): Promise<BlogPostWithAuthors[]> {
  const [entries, authorEntries] = await Promise.all([
    astroGetCollection('blog'),
    authors ?? astroGetCollection('author'),
  ]);
  assertUniquePermalinks(entries);
  return getContentWithAuthors(entries, routes.blog, authorEntries);
}

export async function getNotes(authors?: readonly Author[]): Promise<NoteWithAuthors[]> {
  const [entries, authorEntries] = await Promise.all([
    astroGetCollection('note'),
    authors ?? astroGetCollection('author'),
  ]);
  assertUniquePermalinks(entries);
  return getContentWithAuthors(entries, routes.note, authorEntries);
}

export async function getAuthors(): Promise<Author[]> {
  return astroGetCollection('author');
}
