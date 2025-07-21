import type { APIRoute } from 'astro';
import sharp from 'sharp';
import svg_logo from '@/components/logo/logo.svg?raw';

export const GET: APIRoute = async () => {
  // Convert SVG to PNG using sharp
  const buffer = await sharp(Buffer.from(svg_logo)).resize(128, 128).png().toBuffer();

  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
};
