import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

import { generateOGImage } from '../../utils/og';

export const GET: APIRoute = async ({ params }) => {
  // Get the blog post from the route
  console.log(params.route);
  const posts = await getCollection('blog');
  const post = posts.find((post: CollectionEntry<'blog'>) => post.id === params.route);

  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const png = await generateOGImage({
    title: post.data.title,
    description: post.data.description,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
