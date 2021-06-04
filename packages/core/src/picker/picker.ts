import { DateType } from '../calendar';

/** Classes */
export const pickerPrefix = 'mzn-picker';

export const pickerClasses = {
  host: pickerPrefix,
  arrowIcon: `${pickerPrefix}__arrow-icon`,
} as const;

/** Types */
export type RangePickerValue = undefined[] | [DateType, DateType];
export type RangePickerPickingValue =
 | RangePickerValue
 | [DateType]
 | [undefined, DateType]
 | [DateType, undefined];
