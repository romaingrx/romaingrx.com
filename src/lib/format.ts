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

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });

function parseMonth(value: string): { year: string; month: string } {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Expected a YYYY-MM date, got "${value}"`);
  const [, year, month] = match;
  return {
    year,
    month: monthFormatter.format(new Date(Date.UTC(Number(year), Number(month) - 1))),
  };
}

/**
 * Format a YYYY-MM period (e.g. "Jan 2023 – Jun 2026", "Jul – Nov 2026", "Nov 2026 – Present", "Dec 2023")
 */
export function formatPeriod(start: string, end?: string): string {
  const from = parseMonth(start);
  if (!end) return `${from.month} ${from.year}`;
  if (end === 'present') return `${from.month} ${from.year} – Present`;
  const to = parseMonth(end);
  if (from.year !== to.year) return `${from.month} ${from.year} – ${to.month} ${to.year}`;
  if (from.month !== to.month) return `${from.month} – ${to.month} ${to.year}`;
  return `${to.month} ${to.year}`;
}

const numberFormatter = new Intl.NumberFormat('en-US');

/**
 * Format a count for display (e.g. "12,345")
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
