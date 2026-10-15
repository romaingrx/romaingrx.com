import type { ImageMetadata } from 'astro';

export interface ImageItem {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}
