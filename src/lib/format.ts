import { format, formatDistanceToNow, isThisYear, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format date for blog cards and posts
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d');
  }

  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Format date for compact display in cards
 */
export function formatCompactDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  return format(dateObj, 'MMM d');
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min read';
  }
  return `${Math.round(minutes)} min read`;
}

/**
 * Format ISO string for datetime attributes
 */
export function formatISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString();
}
