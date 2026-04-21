import { TextFieldSize } from '../text-field';

export type SelectInputSize = TextFieldSize;
/**
 * Select 的選取模式。
 * - `'single'` — 單選模式
 * - `'multiple'` — 多選模式
 */
export type SelectMode = 'single' | 'multiple';
/**
 * Select 觸發按鈕的顯示狀態類型。
 * - `'default'` — 預設樣式
 * - `'error'` — 錯誤樣式
 */
export type SelectTriggerType = 'default' | 'error';

export const selectPrefix = 'mzn-select';
export const selectTriggerPrefix = `${selectPrefix}-trigger`;
export const selectPopperPrefix = `${selectPrefix}-popper`;
export const selectTreePrefix = `${selectPrefix}-tree`;
export const autoCompletePrefix = `${selectPrefix}-autocomplete`;

export const selectClasses = {
  host: selectPrefix,
  hostFullWidth: `${selectPrefix}--full-width`,
  hostMode: (mode: SelectMode) => `${selectPrefix}--${mode}`,

  /** Trigger classes */
  trigger: selectTriggerPrefix,
  triggerMode: (mode: SelectMode) => `${selectTriggerPrefix}--${mode}`,
  triggerSelected: (value: unknown) =>
    value ? `${selectTriggerPrefix}--selected` : '',
  triggerReadOnly: `${selectTriggerPrefix}--readonly`,
  triggerDisabled: `${selectTriggerPrefix}--disabled`,
  triggerInput: `${selectTriggerPrefix}__input`,
  triggerPrefix: `${selectTriggerPrefix}__prefix`,
  triggerClearIcon: `${selectTriggerPrefix}__clear-icon`,
  triggerTagsInputWrapper: `${selectTriggerPrefix}__tags-input-wrapper`,
  triggerTagsInputWrapperEllipsis: `${selectTriggerPrefix}__tags-input-wrapper--ellipsis`,
  triggerTagsInputWrapperWrap: `${selectTriggerPrefix}__tags-input-wrapper--wrap`,
  triggerTagsInput: `${selectTriggerPrefix}__tags-input`,
  triggerTags: `${selectTriggerPrefix}__tags`,
  triggerTagsEllipsis: `${selectTriggerPrefix}__tags--ellipsis`,
  triggerSuffixActionIcon: `${selectTriggerPrefix}__suffix-action-icon`,
  triggerSuffixActionIconActive: `${selectTriggerPrefix}__suffix-action-icon--active`,
} as const;
