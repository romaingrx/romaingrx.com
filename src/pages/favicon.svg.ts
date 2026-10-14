import type { APIRoute } from 'astro';

import { tiles } from '@/components/logo';

export const GET: APIRoute = () =>
  new Response(tiles.icon32, { headers: { 'Content-Type': 'image/svg+xml' } });
