import type { Params } from 'astro';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Converts a relative path to an absolute URL
 * @param {string} path - The relative path to convert
 * @param {URL} siteUrl - The base site URL
 * @param {Params?} params - Any search params to pass in the url
 * @returns {string} The absolute URL
 */
export function getAbsoluteUrl(path: string, siteUrl: URL, params?: Params): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(cleanPath, siteUrl);

  if (!params) {
    return url.toString();
  }
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    url.searchParams.set(key, value);
  }
  return url.toString();
}
