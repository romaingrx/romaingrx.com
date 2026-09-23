import type { APIRoute } from 'astro';

import { createRoute } from 'astro-typesafe-routes/create-route';

import { getBlogPosts } from '@/lib/collections';
import { generateOGImage, pngResponse } from '@/utils/og';

type Props = { title: string; description: string };

export const GET: APIRoute<Props> = async ({ props }) => {
  const { title, description } = props;
  if (!title) return new Response('Post not found', { status: 404 });
  const png = await generateOGImage({
    title,
    description,
    showLogo: true,
  });

  return pngResponse(png);
};

export const Route = createRoute({ routeId: '/og/blog/[id].png' });

export const getStaticPaths = Route.createGetStaticPaths<Props>(async () => {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    params: { id: post.id },
    props: { title: post.data.title, description: post.data.description },
  }));
});
