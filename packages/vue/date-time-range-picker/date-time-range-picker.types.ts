import type { DateType } from '@mezzanine-ui/core/calendar';
import type { DateTimePickerProps } from '../date-time-picker/date-time-picker.types';

export type DateTimeRangePickerValue = [
  DateType | undefined,
  DateType | undefined,
];

export interface DateTimeRangePickerProps
  extends Omit<DateTimePickerProps, 'defaultValue' | 'value'> {
  /**
   * The direction of the two date-time pickers.
   * @default 'row'
   */
  direction?: 'row' | 'column';
  /**
   * Current value of date-time range picker.
   * Array of [from, to] where each can be a DateType or undefined.
   */
  value?: DateTimeRangePickerValue;
}
