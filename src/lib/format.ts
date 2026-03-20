import { format, isThisYear, isToday, isYesterday, parseISO } from 'date-fns';

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
export function formatCompactDate(date: Date | string, formatStr: string = 'yyyy MMMM d'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  return format(dateObj, formatStr);
}

/**
 * Format ISO string for datetime attributes
 */
export function formatISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.toISOString();
}
