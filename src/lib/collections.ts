import { getCollection as astroGetCollection, render, type CollectionEntry } from 'astro:content';

import { NODE_ENV } from 'astro:env/client';

import { site } from '@/configs/site';

import { getAbsoluteUrl, slugify } from './utils';

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

async function getContentWithAuthors<T extends ContentEntry>(
  collection: 'blog' | 'note',
  urlPrefix: string,
): Promise<WithAuthors<T>[]> {
  const entries = await astroGetCollection(collection, (entry) =>
    NODE_ENV === 'production'
      ? entry.data.status === 'published'
      : entry.data.status !== 'archived',
  );
  const authors = await astroGetCollection('author');

  return Promise.all(
    entries
      .sort((a, b) => b.data.published_date.getTime() - a.data.published_date.getTime())
      .map(async (entry) => {
        const { remarkPluginFrontmatter } = await render(entry);
        const resolved = await resolveAuthors(entry, authors);
        const slug = slugify(entry.data.title);
        return {
          ...entry,
          authors: resolved,
          readingTime: remarkPluginFrontmatter?.minutesRead || '1 min read',
          slug,
          url: getAbsoluteUrl(`/${urlPrefix}/${slug}`, new URL(site.url)),
        } as WithAuthors<T>;
      }),
  );
}

export function getBlogPosts(): Promise<BlogPostWithAuthors[]> {
  return getContentWithAuthors<BlogPost>('blog', 'blog');
}

export function getNotes(): Promise<NoteWithAuthors[]> {
  return getContentWithAuthors<Note>('note', 'note');
}

export async function getAuthors(): Promise<Author[]> {
  return astroGetCollection('author');
}
