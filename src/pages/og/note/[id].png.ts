import type { APIRoute } from 'astro';

import { createRoute } from 'astro-typesafe-routes/create-route';

import { getNotes } from '@/lib/collections';
import { generateOGImage, pngResponse } from '@/utils/og';

type Props = { title: string; description: string };

export const GET: APIRoute<Props> = async ({ props }) => {
  const { title, description } = props;
  if (!title) return new Response('Note not found', { status: 404 });
  const png = await generateOGImage({
    title,
    showLogo: true,
    description,
  });

  return pngResponse(png);
};

export const Route = createRoute({ routeId: '/og/note/[id].png' });

export const getStaticPaths = Route.createGetStaticPaths<Props>(async () => {
  const notes = await getNotes();
  return notes.map((note) => ({
    params: { id: note.id },
    props: { title: note.data.title, description: note.data.description || '' },
  }));
});
