import type { APIRoute } from 'astro';

import { tiles } from '@/lib/logo';
import { pngResponse, svgToPng } from '@/lib/png';

export const GET: APIRoute = async () => {
  return pngResponse(await svgToPng(tiles.large, 128));
};
