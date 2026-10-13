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

/**
 * Format a YYYY-MM period as years (e.g. "2023 – 2026", "2026 – Present", "2023")
 */
export function formatPeriod(start: string, end?: string): string {
  const startYear = start.slice(0, 4);
  if (!end) return startYear;
  const endYear = end === 'present' ? 'Present' : end.slice(0, 4);
  return startYear === endYear ? startYear : `${startYear} – ${endYear}`;
}
