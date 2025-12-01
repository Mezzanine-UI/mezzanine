import { DateType } from '../calendar';

/** Classes */
export const pickerPrefix = 'mzn-picker';

export const pickerClasses = {
  host: pickerPrefix,
  arrowIcon: `${pickerPrefix}__arrow-icon`,
  inputMono: `${pickerPrefix}__input-mono`,
  formattedInput: `${pickerPrefix}__formatted-input`,
  formattedInputHidden: `${pickerPrefix}__formatted-input-hidden`,
  formattedInputDisplay: `${pickerPrefix}__formatted-input-display`,
  formattedInputSegment: `${pickerPrefix}__formatted-input-segment`,
  formattedInputSegmentFilled: `${pickerPrefix}__formatted-input-segment--filled`,
} as const;

/** Types */
export type RangePickerValue<T = DateType> = undefined[] | [T, T];
export type RangePickerPickingValue<T = DateType> =
  | RangePickerValue
  | [T]
  | [undefined, T]
  | [T, undefined];
