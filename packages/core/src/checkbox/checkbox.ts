export const checkboxPrefix = 'mzn-checkbox';

export type CheckboxMode = 'main' | 'sub' | 'chip';

export const checkboxClasses = {
  host: checkboxPrefix,
  labelContainer: `${checkboxPrefix}__label-container`,
  // status
  checked: `${checkboxPrefix}--checked`,
  indeterminate: `${checkboxPrefix}--indeterminate`,
  disabled: `${checkboxPrefix}--disabled`,
  // mode
  mode: (mode: CheckboxMode) => `${checkboxPrefix}--${mode}`,
  // controller
  inputContainer: `${checkboxPrefix}__input-container`,
  inputContent: `${checkboxPrefix}__input-content`,
  input: `${checkboxPrefix}__input`,
  icon: `${checkboxPrefix}__icon`,
  indeterminateLine: `${checkboxPrefix}__indeterminate-line`,
  // text content
  textContainer: `${checkboxPrefix}__text-container`,
  label: `${checkboxPrefix}__label`,
  description: `${checkboxPrefix}__description`,
  // editable input
  editableInputContainer: `${checkboxPrefix}__editable-input-container`,
  editableInput: `${checkboxPrefix}__editable-input`,
} as const;
