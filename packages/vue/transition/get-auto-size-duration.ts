/**
 * The duration a height transition should take for a given size, in
 * milliseconds. Ported verbatim from React's `getAutoSizeDuration`, which is
 * where `duration: 'auto'` gets its number.
 *
 * @example
 * ```ts
 * getAutoSizeDuration(120); // the ms a 120px collapse should animate for
 * ```
 *
 * @see MznCollapse 唯一使用 `duration: 'auto'` 的轉場
 */
export function getAutoSizeDuration(size?: number): number {
  if (!size) {
    return 0;
  }

  const constant = size / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
