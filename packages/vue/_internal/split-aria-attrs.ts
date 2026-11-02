/**
 * Split fallthrough attrs into `[aria-* / role attrs, remaining attrs]`, so a
 * wrapper component can forward accessibility attributes to the element that
 * actually receives focus (e.g. the native `<input>` inside a TextField).
 * Mirrors React's `splitAriaProps`. The source object is not mutated.
 */
export function splitAriaAttrs(
  attrs: Record<string, unknown>,
): [Record<string, unknown>, Record<string, unknown>] {
  const entries = Object.entries(attrs);
  const isAria = (key: string): boolean =>
    key === 'role' || key.startsWith('aria-');

  return [
    Object.fromEntries(
      entries.filter(([key, value]) => isAria(key) && value !== undefined),
    ),
    Object.fromEntries(entries.filter(([key]) => !isAria(key))),
  ];
}
