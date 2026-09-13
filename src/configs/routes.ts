import { $path } from 'astro-typesafe-routes/path';

import { site } from './site';

export interface SlugParams {
  slug: string;
}

const encodeSegment = (value: string) => encodeURIComponent(value);

export const routes = {
  home: $path({ to: '/' }),
  about: $path({ to: '/about' }),
  contact: $path({ to: '/contact' }),
  blogs: $path({ to: '/blog' }),
  notes: $path({ to: '/notes' }),
  ogImage: $path({ to: '/og-image.png' }),

  blog: ({ slug }: SlugParams) =>
    $path({ to: '/blog/[...slug]', params: { slug: encodeSegment(slug) } }),
  note: ({ slug }: SlugParams) =>
    $path({ to: '/notes/[...slug]', params: { slug: encodeSegment(slug) } }),
  blogCategory: (category: string) =>
    $path({ to: '/blog/category/[category]', params: { category: encodeSegment(category) } }),
  blogTag: (tag: string) => $path({ to: '/blog/tag/[tag]', params: { tag: encodeSegment(tag) } }),
  noteTag: (tag: string) => $path({ to: '/notes/tag/[tag]', params: { tag: encodeSegment(tag) } }),
  blogOg: (id: string) => $path({ to: '/og/blog/[id].png', params: { id: encodeSegment(id) } }),
  noteOg: (id: string) => $path({ to: '/og/note/[id].png', params: { id: encodeSegment(id) } }),
} as const;

export function absolute(pathname: string, origin: string | URL = site.url): string {
  return new URL(pathname, origin).toString();
}

export type Routes = typeof routes;
