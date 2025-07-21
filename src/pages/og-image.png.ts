import type { APIRoute } from 'astro';
import { generateOGImage } from '../utils/og';

export const GET: APIRoute = async () => {
  try {
    const png = await generateOGImage({
      title: 'Romain Graux',
      description: 'Personal website and blog about AI, Machine Learning, and Software Engineering',
    });
    console.log('Generated PNG');
    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=0, s-maxage=86400, must-revalidate',
        'CDN-Cache-Control': 'public, max-age=86400',
        'Surrogate-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error generating PNG', {
      status: 500,
    });
  }
};
