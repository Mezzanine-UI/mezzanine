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
  popper: selectPopperPrefix,
} as const;
