import sharp from 'sharp';

/** Rasterises an SVG string to a sharp PNG of the given width. */
export function svgToPng(svg: string, width: number): Promise<Buffer> {
  // Render at the target resolution instead of upscaling a small bitmap.
  const intrinsic = Number(/width="([\d.]+)"/.exec(svg)?.[1] ?? width);
  return sharp(Buffer.from(svg), { density: (72 * width) / intrinsic })
    .resize(width)
    .png()
    .toBuffer();
}
