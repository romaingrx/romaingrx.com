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

const taxonomyAbbreviations: Record<string, string> = {
  ai: 'AI',
  cuda: 'CUDA',
  dna: 'DNA',
  llm: 'LLM',
  ml: 'ML',
};

/** Format a taxonomy key for display without changing the key used by its URL. */
export function formatTaxonomyLabel(value: string): string {
  return value
    .split(/([\s-]+)/)
    .map((part) => {
      const abbreviation = taxonomyAbbreviations[part.toLowerCase()];
      if (abbreviation) return abbreviation;
      if (/^[\s-]+$/.test(part)) return part;
      return part.charAt(0).toLocaleUpperCase() + part.slice(1);
    })
    .join('');
}

/** Format YYYY-MM timeline dates without parsing them in the local timezone. */
export function formatMonthDate(value: string | undefined): string {
  if (!value || value.toLowerCase() === 'present') return 'Present';
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
