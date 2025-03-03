import rss from '@astrojs/rss';

import { getPublishedBlogPosts, getPublishedNotes } from '@/lib/collections';
import { getAbsoluteUrl } from '@/lib/utils';
import { routes } from '@/configs/routes';
import { site } from '@/configs/site';

export async function GET(context) {
  // Get published blog posts and notes
  const publishedPosts = await getPublishedBlogPosts();
  const publishedNotes = await getPublishedNotes();

  // Get the site URL from context
  const siteUrl = new URL(context.site);

  // Combine posts and notes into a single array
  const allItems = [
    ...publishedPosts.map(post => ({
      title: post.data.title,
      description: post.data.description || '',
      pubDate: post.data.published_date,
      link: getAbsoluteUrl(routes.blog(post), siteUrl),
      categories: [...post.data.tags, ...(post.data.categories || [])],
      content: post.data.description || '',
    })),
    ...publishedNotes.map(note => ({
      title: note.data.title,
      description: note.data.description || '',
      pubDate: note.data.published_date,
      link: getAbsoluteUrl(routes.note(note), siteUrl),
      categories: note.data.tags,
      content: note.data.description || '',
    })),
  ];

  // Sort all items by publication date (newest first)
  allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: allItems,
    customData: `<language>en-us</language>`,
  });
}
