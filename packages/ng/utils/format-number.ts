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

/**
 * Parses a string representing a number with commas into a number.
 */
export function parseNumberWithCommas(
  input: string,
  strict: boolean = false,
): number | null {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (trimmed === '') return null;

  if (strict) {
    const STRICT_FORMAT = /^-?\d{1,3}(?:,\d{3})*(?:\.\d+)?$/;
    if (!STRICT_FORMAT.test(trimmed)) {
      return null;
    }
  }

  const normalized = trimmed.split(',').join('');
  const value = Number(normalized);

  return Number.isFinite(value) ? value : null;
}
