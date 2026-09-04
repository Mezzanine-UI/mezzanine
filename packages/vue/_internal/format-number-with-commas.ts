'use client';

/**
 * Formats a number or numeric string with commas according to the specified locale.
 */
export function formatNumberWithCommas(
  input: number | string,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions,
): string {
  let value: number;

  if (typeof input === 'number') {
    if (!Number.isFinite(input)) return '';
    value = input;
  } else {
    const trimmed = input.trim();
    if (trimmed === '') return '';

    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return '';

    value = parsed;
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 20,
    ...options,
  }).format(value);
}
