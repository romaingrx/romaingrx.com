import type { APIRoute } from 'astro';

import { getBlogPosts, type BlogPostWithAuthors } from '@/lib/collections';

import { generateOGImage } from '../../utils/og';

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getBlogPosts();
  console.log(posts.map(post => post.id));
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  const post = props.post as BlogPostWithAuthors;
  const id = url.searchParams.get('id');

  if (!post || !id) {
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
