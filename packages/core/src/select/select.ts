import { Size } from '@mezzanine-ui/system/size';

export type SelectInputSize = Size;
export type SelectMode = 'single' | 'multiple';

export const selectPrefix = 'mzn-select';
export const treeSelectPrefix = 'mzn-tree-select';
export const selectTriggerPrefix = `${selectPrefix}-trigger`;
export const selectPopperPrefix = `${selectPrefix}-popper`;
export const selectTreePrefix = `${selectPrefix}-tree`;
export const autoCompletePrefix = `${selectPrefix}-autocomplete`;

export const selectClasses = {
  host: selectPrefix,
  hostFullWidth: `${selectPrefix}--full-width`,

  /** Trigger classes */
  trigger: selectTriggerPrefix,
  triggerTags: `${selectTriggerPrefix}__tags`,
  triggerSuffixActionIcon: `${selectTriggerPrefix}__suffix-action-icon`,
  triggerSuffixActionIconActive: `${selectTriggerPrefix}__suffix-action-icon--active`,

  /** Popper classes */
  popper: selectPopperPrefix,

  /** Tree select classes */
  treeSelect: treeSelectPrefix,
  tree: selectTreePrefix,

  /** AutoComplete classes */
  autoComplete: autoCompletePrefix,
  autoCompleteIcon: `${autoCompletePrefix}__icon`,
  autoCompleteIconActive: `${autoCompletePrefix}__icon--active`,
} as const;
