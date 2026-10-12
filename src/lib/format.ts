const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Format a date for display (e.g. "March 20, 2026")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatter.format(dateObj);
}

const numberFormatter = new Intl.NumberFormat('en-US');

/**
 * Format a count for display (e.g. "12,345")
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
