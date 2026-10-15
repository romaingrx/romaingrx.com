import { getCollection, render, type CollectionEntry } from 'astro:content';

import { NODE_ENV } from 'astro:env/client';

import { resolveResourceValue, type Resource } from '@/configs/resources';
import { routes } from '@/configs/routes';
import { site } from '@/configs/site';

import { getAbsoluteUrl } from './utils';

export type Collection = 'blog' | 'note';
export type Author = CollectionEntry<'author'>;

/** A blog post or a note, with its authors, reading time, URLs and resources resolved. */
export type Entry<C extends Collection = Collection> = Omit<CollectionEntry<C>, 'authors'> & {
  authors: Author[];
  resources: Resource[];
  readingTime: string;
  slug: string;
  path: string;
  url: string;
};
export type BlogPost = Entry<'blog'>;
export type Note = Entry<'note'>;

function entryPath(collection: Collection, slug: string): string {
  return collection === 'blog' ? routes.blog({ slug }) : routes.note({ slug });
}

export function tagPath(collection: Collection, tag: string): string {
  return collection === 'blog' ? routes.blogTag(tag) : routes.noteTag(tag);
}

async function loadEntries<C extends Collection>(collection: C): Promise<Entry<C>[]> {
  const [entries, authors] = await Promise.all([
    getCollection(collection, (entry: CollectionEntry<Collection>) =>
      NODE_ENV === 'production'
        ? entry.data.status === 'published'
        : entry.data.status !== 'archived',
    ),
    getCollection('author'),
  ]);

  const sorted = entries.toSorted(
    (a, b) => b.data.published_date.getTime() - a.data.published_date.getTime(),
  );
  return Promise.all(
    sorted.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      const slug = entry.data.permalink;
      const path = entryPath(collection, slug);
      return Object.assign(entry, {
        authors: entry.data.authors.map(({ id }) => {
          const author = authors.find((a) => a.id === id);
          if (!author) throw new Error(`Author ${id} not found (in ${collection}/${entry.id}).`);
          return author;
        }),
        resources: entry.data.resources.map((resource) => ({
          ...resource,
          value: resolveResourceValue(resource.value, { collection, entryId: entry.id }),
        })),
        readingTime: remarkPluginFrontmatter?.minutesRead ?? '1 min read',
        slug,
        path,
        url: getAbsoluteUrl(path, new URL(site.url)),
      }) as Entry<C>;
    }),
  );
}

// Every page calls this, and each call renders every entry. A build loads each
// collection once. The dev server keeps modules between requests, so it must
// not cache, or content edits would never show.
const cache = new Map<Collection, Promise<Entry[]>>();

export function getEntries<C extends Collection>(collection: C): Promise<Entry<C>[]> {
  if (!import.meta.env.PROD) return loadEntries(collection);
  if (!cache.has(collection)) cache.set(collection, loadEntries(collection));
  return cache.get(collection) as Promise<Entry<C>[]>;
}

export async function getTags(collection: Collection): Promise<string[]> {
  return [...new Set((await getEntries(collection)).flatMap((entry) => entry.data.tags))];
}

export async function getCategories(): Promise<string[]> {
  return [...new Set((await getEntries('blog')).flatMap((post) => post.data.categories))];
}

/**
 * Up to `limit` entries to read next: the post's own `related_posts` first, then
 * entries that share a tag. With none, the previous and next entries by date.
 */
export async function getRelated<C extends Collection>(
  entry: Entry<C>,
  limit = 3,
): Promise<
  | { kind: 'related'; entries: Entry<C>[] }
  | { kind: 'adjacent'; previous?: Entry<C>; next?: Entry<C> }
> {
  const all = await getEntries(entry.collection as C);
  const picked = 'related_posts' in entry.data ? entry.data.related_posts.map(({ id }) => id) : [];
  const explicit = picked.flatMap((id) => all.filter((other) => other.id === id));
  const byTag = all.filter(
    (other) =>
      other.id !== entry.id &&
      !picked.includes(other.id) &&
      other.data.tags.some((tag) => entry.data.tags.includes(tag)),
  );
  const entries = [...explicit, ...byTag].slice(0, limit);
  if (entries.length > 0) return { kind: 'related', entries };

  const index = all.findIndex((other) => other.id === entry.id);
  return { kind: 'adjacent', previous: all[index + 1], next: all[index - 1] };
}
