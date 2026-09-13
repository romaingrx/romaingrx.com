import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

import { routes } from '@/configs/routes';

export const prerender = false;

export const GET: APIRoute = async ({ redirect }) => {
  const entry = await getEntry('blog', '20240927-mistral-nemo-red-teamer');
  if (!entry || entry.data.status !== 'published') {
    return new Response('Not found', { status: 404 });
  }

  return redirect(routes.blog({ slug: entry.data.permalink }), 301);
};
