import type { APIRoute } from 'astro';

import { generateOGImage, pngResponse } from '../utils/og';

export const GET: APIRoute = async () => {
  try {
    const png = await generateOGImage({
      title: 'Romain Graux',
      description: 'Personal website and blog about AI, Machine Learning, and Software Engineering',
    });
    return pngResponse(png);
  } catch (error) {
    console.error(error);
    return new Response('Error generating PNG', {
      status: 500,
    });
  }
};
