import { TextFieldSize } from '../text-field';

export type SelectInputSize = TextFieldSize;
export type SelectMode = 'single' | 'multiple';
export type SelectTriggerType = 'default' | 'error';

export const selectPrefix = 'mzn-select';
export const treeSelectPrefix = 'mzn-tree-select';
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
  triggerTagsInputWrapper: `${selectTriggerPrefix}__tags-input-wrapper`,
  triggerTagsInputWrapperEllipsis: `${selectTriggerPrefix}__tags-input-wrapper--ellipsis`,
  triggerTagsInput: `${selectTriggerPrefix}__tags-input`,
  triggerTags: `${selectTriggerPrefix}__tags`,
  triggerTagsEllipsis: `${selectTriggerPrefix}__tags--ellipsis`,
  triggerSuffixActionIcon: `${selectTriggerPrefix}__suffix-action-icon`,
  triggerSuffixActionIconActive: `${selectTriggerPrefix}__suffix-action-icon--active`,

  /** Popper classes */
  popper: selectPopperPrefix,

  /** Tree select classes */
  treeSelect: treeSelectPrefix,
  tree: selectTreePrefix,
} as const;
