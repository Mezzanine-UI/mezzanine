/**
 * Convert a CSS length prop to a value the browser will accept.
 *
 * React appends `px` to numeric style values; Vue passes them through and the
 * browser then drops the declaration as invalid. Several Mezzanine props are
 * documented as accepting a bare number meaning pixels (`width`, `height`,
 * `maxWidth`, `maxHeight`, …), so the conversion has to be explicit on the Vue
 * side. The failure is silent — the dimension simply has no effect.
 */
export function toCssLength(
  value: number | string | undefined | null,
): string | undefined {
  if (value == null || value === '') return undefined;

  return typeof value === 'number' ? `${value}px` : String(value);
}
