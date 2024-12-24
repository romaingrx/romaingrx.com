import type { APIRoute } from 'astro';
import sharp from 'sharp';
import ico from 'sharp-ico';

import svg_logo from '@/components/logo/logo.svg?raw';

export const GET: APIRoute = async () => {
  const buffers = await Promise.all([
    sharp(Buffer.from(svg_logo)).resize(64).toFormat('png').toBuffer(),
    sharp(Buffer.from(svg_logo)).resize(32).toFormat('png').toBuffer(),
    sharp(Buffer.from(svg_logo)).resize(16).toFormat('png').toBuffer(),
  ]);

  const icoBuffer = ico.encode(buffers);

  return new Response(icoBuffer, {
    headers: { 'Content-Type': 'image/x-icon' },
  });
};
