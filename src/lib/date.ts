interface FormatTimestampOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  fallback?: string;
  locale?: string;
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
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
