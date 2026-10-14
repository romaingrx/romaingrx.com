import type { APIRoute } from 'astro';

import rss from '@astrojs/rss';

import { site } from '@/configs/site';
import { getEntries } from '@/lib/collections';

export const GET: APIRoute = async () => {
  const entries = [...(await getEntries('blog')), ...(await getEntries('note'))].toSorted(
    (a, b) => b.data.published_date.getTime() - a.data.published_date.getTime(),
  );

  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? '',
      pubDate: entry.data.published_date,
      link: entry.url,
      categories: [
        ...entry.data.tags,
        ...('categories' in entry.data ? entry.data.categories : []),
      ],
      content: entry.data.description ?? '',
    })),
    customData: '<language>en-us</language>',
  });
};
