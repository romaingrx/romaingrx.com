import type { APIRoute } from 'astro';
import sharp from 'sharp';

import svg_logo from '@/components/logo/logo.svg?raw';

export const GET: APIRoute = async () => {
  const png = await sharp(Buffer.from(svg_logo)).resize(64).toFormat('png').toBuffer();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
