import type { APIRoute } from 'astro';

import { generateOGImage } from '@/lib/og';
import { pngResponse } from '@/lib/png';

export const GET: APIRoute = async () =>
  pngResponse(
    await generateOGImage({
      title: 'Romain Graux',
      description: 'Personal website and blog about AI, Machine Learning, and Software Engineering',
    }),
  );
