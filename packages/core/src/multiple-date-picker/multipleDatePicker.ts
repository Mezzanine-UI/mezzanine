import { DateType } from '../calendar';

/** Prefix */
export const multipleDatePickerPrefix = 'mzn-multiple-date-picker';

/** Classes */
export const multipleDatePickerClasses = {
  host: multipleDatePickerPrefix,
  hostFullWidth: `${multipleDatePickerPrefix}--full-width`,
  trigger: `${multipleDatePickerPrefix}-trigger`,
  triggerSelected: `${multipleDatePickerPrefix}-trigger--selected`,
  triggerDisabled: `${multipleDatePickerPrefix}-trigger--disabled`,
  triggerReadOnly: `${multipleDatePickerPrefix}-trigger--readonly`,
  triggerTagsWrapper: `${multipleDatePickerPrefix}-trigger__tags-wrapper`,
  triggerTagsWrapperEllipsis: `${multipleDatePickerPrefix}-trigger__tags-wrapper--ellipsis`,
  triggerTags: `${multipleDatePickerPrefix}-trigger__tags`,
  triggerTagsEllipsis: `${multipleDatePickerPrefix}-trigger__tags--ellipsis`,
  triggerInput: `${multipleDatePickerPrefix}-trigger__input`,
  triggerInputAbsolute: `${multipleDatePickerPrefix}-trigger__input--absolute`,
  triggerSuffixIcon: `${multipleDatePickerPrefix}-trigger__suffix-icon`,
  triggerSuffixIconActive: `${multipleDatePickerPrefix}-trigger__suffix-icon--active`,
} as const;

/** Types */
export type MultipleDatePickerValue = DateType[];
