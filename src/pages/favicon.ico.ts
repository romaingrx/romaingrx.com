import type { APIRoute } from 'astro';

import { tiles } from '@/components/logo';
import { svgToPng } from '@/components/logo/render';

// An ICO file is a small directory followed by PNG payloads.
function ico(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

export const GET: APIRoute = async () => {
  const body = ico([
    { size: 16, png: await svgToPng(tiles.icon16, 16) },
    { size: 32, png: await svgToPng(tiles.icon32, 32) },
  ]);
  return new Response(new Uint8Array(body), { headers: { 'Content-Type': 'image/x-icon' } });
};
