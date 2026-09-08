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
    /** Strictly formatted number with commas */
    const STRICT_FORMAT = /^-?\d{1,3}(?:,\d{3})*(?:\.\d+)?$/;
    if (!STRICT_FORMAT.test(trimmed)) {
      return null;
    }
  }

  const normalized = trimmed.split(',').join('');
  const value = Number(normalized);

  return Number.isFinite(value) ? value : null;
}
