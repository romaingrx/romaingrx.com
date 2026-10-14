import type { APIRoute } from 'astro';

import { tiles } from '@/components/logo';
import { svgToPng } from '@/components/logo/render';

export const GET: APIRoute = async () => {
  const png = await svgToPng(tiles.appleTouch, 180);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
