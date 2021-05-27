import { Size } from '@mezzanine-ui/system/size';

export type SelectInputSize = Size;
export type SelectMode = 'single' | 'multiple';

export const selectPrefix = 'mzn-select';
export const selectTriggerPrefix = `${selectPrefix}-trigger`;
export const selectPopperPrefix = `${selectPrefix}-popper`;

export const selectClasses = {
  host: selectPrefix,

  /** Trigger classes */
  trigger: selectTriggerPrefix,
  triggerTags: `${selectTriggerPrefix}__tags`,
  triggerSuffixActionIcon: `${selectTriggerPrefix}__suffix-action-icon`,
  triggerSuffixActionIconActive: `${selectTriggerPrefix}__suffix-action-icon--active`,

  /** Popper classes */
  _popper: selectPopperPrefix,

  /** below to be deprecated */
  popper: `${selectPrefix}__popper`,
  suffixIconActive: `${selectPrefix}__text-field__suffix-icon--active`,
  tags: `${selectPrefix}__text-field__tags`,
  textField: `${selectPrefix}__text-field`,
  /** deprecated block code ends */
} as const;
