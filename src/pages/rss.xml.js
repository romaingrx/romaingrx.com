import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { routes } from '@/configs/routes';
import { site } from '@/configs/site';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map(post => ({
      ...post.data,
      link: routes.blog(post),
    })),
  });
}
