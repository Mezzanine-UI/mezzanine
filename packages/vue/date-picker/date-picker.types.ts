import type { DateType } from '@mezzanine-ui/core/calendar';
import type { PickerTriggerProps } from '../picker/picker-trigger.types';
import type { DatePickerCalendarProps } from './date-picker-calendar.types';

export interface DatePickerProps
  extends Omit<
      DatePickerCalendarProps,
      | 'anchor'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'open'
      | 'referenceDate'
    >,
    Omit<PickerTriggerProps, 'defaultValue' | 'format' | 'value'> {
  /**
   * Default value for date picker.
   */
  defaultValue?: DateType;
  /**
   * Disabled "double next" button on calendar controls
   * @default false
   */
  disableOnDoubleNext?: boolean;
  /**
   * Disabled "double prev" button on calendar controls
   * @default false
   */
  disableOnDoublePrev?: boolean;
  /**
   * The format for displaying date.
   * The length of the format must match the length of the actual generated value. For example, "gggg-wo" may cause a length mismatch when the week of year is a single digit. It is recommended to use the system's default format instead.
   */
  format?: string;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateType;
  /**
   * Current value of date picker.
   */
  value?: DateType;
}
