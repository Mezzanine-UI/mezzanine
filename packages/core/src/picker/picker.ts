import { DateType } from '../calendar';

/** Classes */
export const pickerPrefix = 'mzn-picker';
export const pickerPopperPrefix = `${pickerPrefix}-popper`;

export const pickerClasses = {
  host: pickerPrefix,
  arrowIcon: `${pickerPrefix}__arrow-icon`,

  /** Popper classes */
  popper: pickerPopperPrefix,
} as const;

/** Types */
export type RangePickerValue = undefined[] | [DateType, DateType];
export type RangePickerPickingValue =
 | RangePickerValue
 | [DateType]
 | [undefined, DateType]
 | [DateType, undefined];
