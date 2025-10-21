import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getBlogPosts } from '@/lib/collections';
import { generateOGImage } from '@/utils/og';

export const GET: APIRoute = async ({ params }) => {
  // Extract the post ID from the URL, handling potential URL encoding
  const postId = params.id?.split('?')[0]; // Get the ID and remove any trailing parameters

  if (!postId) {
    return new Response('Missing post ID', { status: 400 });
  }

  // Get the blog post data
  const posts = await getCollection('blog');
  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  const png = await generateOGImage({
    title: post.data.title,
    description: post.data.description,
    showLogo: true,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, must-revalidate',
      'CDN-Cache-Control': 'public, max-age=86400',
      'Surrogate-Control': 'public, max-age=86400',
    },
  });
};

export async function getStaticPaths() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}
