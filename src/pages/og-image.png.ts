import type { APIRoute } from 'astro';

import { generateOGImage } from '../utils/og';

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    title: 'Romain Graux',
    description: 'Personal website and blog about AI, Machine Learning, and Software Engineering',
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
