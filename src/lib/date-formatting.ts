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

const shortTimeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
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

export function hasMeaningfulUtcTime(value: Date | string | number) {
  const date = normalizeDateInput(value);
  return (
    date.getUTCHours() !== 0
    || date.getUTCMinutes() !== 0
    || date.getUTCSeconds() !== 0
    || date.getUTCMilliseconds() !== 0
  );
}

export function formatShortArchiveUtcDate(value: Date | string | number) {
  const date = normalizeDateInput(value);
  if (!hasMeaningfulUtcTime(date)) return shortDateFormatter.format(date);
  return `${shortDateFormatter.format(date)} · ${shortTimeFormatter.format(date)} UTC`;
}

export function formatLongArchiveUtcDate(value: Date | string | number) {
  const date = normalizeDateInput(value);
  if (!hasMeaningfulUtcTime(date)) return longDateFormatter.format(date);
  return `${longDateFormatter.format(date)} · ${shortTimeFormatter.format(date)} UTC`;
}
