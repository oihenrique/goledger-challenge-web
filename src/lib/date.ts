interface FormatTimestampOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  fallback?: string;
  locale?: string;
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  timeZone?: string;
}

interface DateTimeLocalFormatOptions {
  fallback?: string;
}

interface DateFormatOptions {
  fallback?: string;
  locale?: string;
  timeZone?: string;
}

export function toTimestamp(value: string | number | Date): number | null {
  const parsedDate =
    value instanceof Date
      ? value
      : new Date(typeof value === 'number' ? value : value);

  const timestamp = parsedDate.getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return timestamp;
}

export function formatTimestamp(
  value: string | number | Date,
  options: FormatTimestampOptions = {},
): string {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return options.fallback ?? 'Unknown';
  }

  return new Intl.DateTimeFormat(options.locale ?? 'en-US', {
    dateStyle: options.dateStyle ?? 'medium',
    timeStyle: options.timeStyle ?? 'short',
    timeZone: options.timeZone ?? 'UTC',
  }).format(timestamp);
}

export function formatDate(
  value: string | number | Date,
  options: DateFormatOptions = {},
): string {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return options.fallback ?? 'Unknown';
  }

  return new Intl.DateTimeFormat(options.locale ?? 'en-US', {
    dateStyle: 'medium',
    timeZone: options.timeZone ?? 'UTC',
  }).format(timestamp);
}

export function toDateTimeLocalInputValue(
  value: string | number | Date,
  options: DateTimeLocalFormatOptions = {},
): string {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return options.fallback ?? '';
  }

  const date = new Date(timestamp);
  const timezoneOffsetInMilliseconds = date.getTimezoneOffset() * 60_000;
  const localDate = new Date(date.getTime() - timezoneOffsetInMilliseconds);

  return localDate.toISOString().slice(0, 16);
}

export function toIsoDateTimeFromLocalInput(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  const timestamp = parsedDate.getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return parsedDate.toISOString();
}

export function toDateInputValue(
  value: string | number | Date,
  options: DateTimeLocalFormatOptions = {},
): string {
  const timestamp = toTimestamp(value);

  if (timestamp === null) {
    return options.fallback ?? '';
  }

  return new Date(timestamp).toISOString().slice(0, 10);
}

export function toIsoDateTimeFromDateInput(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  const timestamp = parsedDate.getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return parsedDate.toISOString();
}
