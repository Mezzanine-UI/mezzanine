import { DateType } from '../calendar';

/** Classes */
export const pickerPrefix = 'mzn-picker';

export const pickerClasses = {
  host: pickerPrefix,
  arrowIcon: `${pickerPrefix}__arrow-icon`,
} as const;

/** Types */
export type RangePickerValue<T = DateType> = undefined[] | [T, T];
export type RangePickerPickingValue<T = DateType> =
 | RangePickerValue
 | [T]
 | [undefined, T]
 | [T, undefined];
