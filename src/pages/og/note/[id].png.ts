import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { getPublishedNotes } from '@/lib/collections';
import { generateOGImage } from '@/utils/og';

export const GET: APIRoute = async ({ props, params }) => {
  // Extract the note ID from the URL, handling potential URL encoding
  console.log({ params, props });
  const noteId = params.id?.split('?')[0]; // Get the ID and remove any trailing parameters

  if (!noteId) {
    return new Response('Missing note ID', { status: 400 });
  }

  // Get the note data
  const notes = await getCollection('note');
  const note = notes.find(note => note.id === noteId);

  if (!note) {
    return new Response('Note not found', { status: 404 });
  }

  // Generate the OG image with proper type handling for description
  const png = await generateOGImage({
    title: note.data.title,
    showLogo: true,
    description: note.data.description || '',
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, must-revalidate',
      'CDN-Cache-Control': 'public, max-age=86400',
      'Surrogate-Control': 'public, max-age=86400',
    },
  });
};

export async function getStaticPaths() {
  const notes = await getPublishedNotes();
  return notes.map(note => ({
    params: { id: note.id },
    props: { note },
  }));
}
