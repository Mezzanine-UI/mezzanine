/**
 * Compares two option names, ignoring letter casing unless `caseSensitive` is set.
 *
 * Kept in sync with the option filter in `useAutoCompleteValueControl`: if typing
 * `colorado` surfaces `Colorado` in the list, the creation flow must also treat the
 * two as the same item, otherwise `addable` mode offers to create a duplicate of an
 * option the user can already see.
 */
export function isSameOptionName(
  a: string,
  b: string,
  caseSensitive = false,
): boolean {
  return caseSensitive ? a === b : a.toLowerCase() === b.toLowerCase();
}
