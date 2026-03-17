export const checkboxPrefix = 'mzn-checkbox';

/**
 * Checkbox 的顯示模式。
 * - `'default'` — 標準核取方塊樣式
 * - `'chip'` — 標籤（Chip）樣式
 */
export type CheckboxMode = 'default' | 'chip';

/**
 * 預設模式下 Checkbox 的尺寸。
 * - `'main'` — 主要尺寸
 * - `'sub'` — 次要尺寸
 */
export type CheckboxSizeDefault = 'main' | 'sub';

/**
 * Chip 模式下 Checkbox 的尺寸。
 * - `'main'` — 主要尺寸
 * - `'sub'` — 次要尺寸
 * - `'minor'` — 最小尺寸
 */
export type CheckboxSizeChip = 'main' | 'sub' | 'minor';

export type CheckboxSize<M extends CheckboxMode = CheckboxMode> =
  M extends 'chip' ? CheckboxSizeChip : CheckboxSizeDefault;

/**
 * Checkbox 的語意狀態。
 * - `'info'` — 一般資訊狀態
 * - `'error'` — 錯誤狀態
 */
export type CheckboxSeverity = 'info' | 'error';

export const checkboxClasses = {
  host: checkboxPrefix,
  labelContainer: `${checkboxPrefix}__label-container`,
  // status
  checked: `${checkboxPrefix}--checked`,
  indeterminate: `${checkboxPrefix}--indeterminate`,
  disabled: `${checkboxPrefix}--disabled`,
  // mode
  mode: (mode: CheckboxMode) => `${checkboxPrefix}--${mode}`,
  // size
  size: (size: CheckboxSize) => `${checkboxPrefix}--${size}`,
  // severity
  severity: (severity: CheckboxSeverity) => `${checkboxPrefix}--${severity}`,
  // controller
  inputContainer: `${checkboxPrefix}__input-container`,
  inputContent: `${checkboxPrefix}__input-content`,
  input: `${checkboxPrefix}__input`,
  icon: `${checkboxPrefix}__icon`,
  chipIcon: `${checkboxPrefix}__icon--chip`,
  indeterminateLine: `${checkboxPrefix}__indeterminate-line`,
  // text content
  textContainer: `${checkboxPrefix}__text-container`,
  label: `${checkboxPrefix}__label`,
  description: `${checkboxPrefix}__description`,
  // editable input
  editableInputContainer: `${checkboxPrefix}__editable-input-container`,
  editableInput: `${checkboxPrefix}__editable-input`,
};
