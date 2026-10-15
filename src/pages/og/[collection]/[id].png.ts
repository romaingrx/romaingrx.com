import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';

import { getEntries } from '@/lib/collections';
import { generateOGImage } from '@/lib/og';
import { pngResponse } from '@/lib/png';

export const getStaticPaths = (async () => {
  const entries = [...(await getEntries('blog')), ...(await getEntries('note'))];
  return entries.map((entry) => ({
    params: { collection: entry.collection, id: entry.id },
    props: { title: entry.data.title, description: entry.data.description },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<InferGetStaticPropsType<typeof getStaticPaths>> = async ({ props }) =>
  pngResponse(await generateOGImage(props));
