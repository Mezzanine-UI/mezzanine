/**
 * ClearActions 的顯示類型。
 * - `'embedded'` — 嵌入式樣式
 * - `'standard'` — 標準樣式
 * - `'clearable'` — 可清除樣式
 */
export type ClearActionsType = 'embedded' | 'standard' | 'clearable';

/**
 * 嵌入式（embedded）類型的 ClearActions 變體。
 * - `'contrast'` — 對比色調變體
 * - `'emphasis'` — 強調色調變體
 */
export type ClearActionsEmbeddedVariant = 'contrast' | 'emphasis';

/**
 * 標準（standard）類型的 ClearActions 變體。
 * - `'base'` — 基礎樣式變體
 * - `'inverse'` — 反色樣式變體
 */
export type ClearActionsStandardVariant = 'base' | 'inverse';

export type ClearActionsVariant =
  | ClearActionsEmbeddedVariant
  | ClearActionsStandardVariant
  | 'default';

export const clearActionsPrefix = 'mzn-clear-actions';

export const clearActionsClasses = {
  host: clearActionsPrefix,
  icon: `${clearActionsPrefix}__icon`,
  type: (type: ClearActionsType) => `${clearActionsPrefix}--type-${type}`,
  variant: (variant: ClearActionsVariant) =>
    `${clearActionsPrefix}--variant-${variant}`,
};
