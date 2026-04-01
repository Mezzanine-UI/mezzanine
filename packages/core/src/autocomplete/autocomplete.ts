import { GeneralSize } from '@mezzanine-ui/system/size';

export type AutoCompleteInputSize = GeneralSize;

/**
 * AutoComplete 的選取模式。
 * - `'single'` — 單選模式
 * - `'multiple'` — 多選模式，已選項目以標籤顯示
 */
export type AutoCompleteMode = 'single' | 'multiple';

/**
 * AutoComplete 輸入框的觸發狀態樣式。
 * - `'default'` — 預設樣式
 * - `'error'` — 錯誤狀態樣式
 */
export type AutoCompleteTriggerType = 'default' | 'error';

/**
 * AutoComplete 中鍵盤焦點的目標元素。
 * - `'input'` — 焦點位於輸入框
 * - `'selection'` — 焦點位於已選標籤（多選模式）
 */
export type AutoCompleteSelector = 'input' | 'selection';

export const autocompletePrefix = 'mzn-autocomplete';

export const autocompleteClasses = {
  host: autocompletePrefix,
  hostInsideClosed: `${autocompletePrefix}--inside-closed`,
  hostMode: (mode: AutoCompleteMode) => `${autocompletePrefix}--${mode}`,
} as const;
