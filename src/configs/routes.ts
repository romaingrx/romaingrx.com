type Slugged = { slug: string };

export const routes = {
  home: '/',
  about: '/about',
  contact: '/contact',

  blogs: '/blog',
  blog: ({ slug }: Slugged) => `/blog/${slug}`,
  blogTag: (tag: string) => `/blog/tag/${tag}`,
  blogCategory: (category: string) => `/blog/category/${category}`,

  notes: '/notes',
  note: ({ slug }: Slugged) => `/notes/${slug}`,
  noteTag: (tag: string) => `/notes/tag/${tag}`,
} as const;

export const navigation = [
  { name: 'Home', href: routes.home },
  { name: 'Blog', href: routes.blogs },
  { name: 'Notes', href: routes.notes },
  { name: 'About', href: routes.about },
  { name: 'Contact', href: routes.contact },
] as const;

export function isActivePath(href: string, pathname: string): boolean {
  return href === routes.home ? pathname === routes.home : pathname.startsWith(href);
}
