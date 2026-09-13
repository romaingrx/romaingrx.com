import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { routes } from '@/configs/routes';

export const prerender = false;

export const GET: APIRoute = async ({ params, redirect }) => {
  const legacySlug = params.slug;
  if (!legacySlug) return new Response('Not found', { status: 404 });

  const entries = await getCollection('note', (entry) => entry.data.status === 'published');
  const entry = entries.find((candidate) => candidate.data.permalink === legacySlug);
  if (!entry) return new Response('Not found', { status: 404 });

  return redirect(routes.note({ slug: entry.data.permalink }), 301);
};
