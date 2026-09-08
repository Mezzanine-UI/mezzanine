/**
 * Normalizes an option name for comparison: lower-cased by default, returned
 * as-is when `caseSensitive` is set.
 *
 * Shared basis for `isSameOptionName`, the option filter (substring match), and
 * the `Set`-based duplicate checks in the bulk-create flow, so every comparison
 * site folds case through a single decision point instead of hand-writing
 * `caseSensitive ? x : x.toLowerCase()`.
 *
 * @example
 * ```ts
 * normalizeOptionName('Colorado'); // 'colorado'
 * ```
 *
 * @see isSameOptionName 以此為基礎的比較函式
 */
export function normalizeOptionName(
  name: string,
  caseSensitive = false,
): string {
  return caseSensitive ? name : name.toLowerCase();
}

/**
 * Compares two option names, ignoring letter casing unless `caseSensitive` is set.
 *
 * Kept in sync with the option filter in `useAutoCompleteValueControl`: if typing
 * `colorado` surfaces `Colorado` in the list, the creation flow must also treat the
 * two as the same item, otherwise `addable` mode offers to create a duplicate of an
 * option the user can already see.
 *
 * @example
 * ```ts
 * isSameOptionName('Colorado', 'colorado'); // true
 * ```
 *
 * @see MznAutoComplete 使用這個比較的元件
 */
export function isSameOptionName(
  a: string,
  b: string,
  caseSensitive = false,
): boolean {
  return (
    normalizeOptionName(a, caseSensitive) ===
    normalizeOptionName(b, caseSensitive)
  );
}
