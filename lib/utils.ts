import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function toReadableDate(date: string) {
  const d = new Date(date);
  const diff = new Date().getTime() - d.getTime();
  // If less than five days ago, return "X days ago"
  if (diff < 24 * 60 * 60 * 1000) {
    return 'Today';
  } else if (diff < 2 * 24 * 60 * 60 * 1000) {
    return 'Yesterday';
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / 86400000)} days ago`;
  } else {
    // Otherwise, return "Month Day, Year"
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

export function pluralize(
  count: number,
  noun: string,
  suffix = 's',
  withCount = true,
) {
  return withCount
    ? `${count} ${noun}${count > 1 ? suffix : ''}`
    : `${noun}${count > 1 ? suffix : ''}`;
}
