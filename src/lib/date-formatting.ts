const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

function normalizeDateInput(value: Date | string | number) {
  return value instanceof Date ? value : new Date(value);
}

export function formatShortUtcDate(value: Date | string | number) {
  return shortDateFormatter.format(normalizeDateInput(value));
}

export function formatLongUtcDate(value: Date | string | number) {
  return longDateFormatter.format(normalizeDateInput(value));
}
