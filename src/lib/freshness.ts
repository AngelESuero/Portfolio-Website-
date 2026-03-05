const DEFAULT_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? null : value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? null : parsed;
  }

  return null;
};

export const formatFreshnessLabel = (value: unknown): string => {
  const parsed = toDate(value);
  if (!parsed) return 'Archival snapshot';
  return `Last updated: ${DEFAULT_FORMATTER.format(parsed)}`;
};

