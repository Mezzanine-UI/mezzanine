import type { DateType } from '@mezzanine-ui/core/calendar';
import type { DatePickerCalendarProps } from '../date-picker/date-picker-calendar.types';
import type { PickerTriggerWithSeparatorProps } from '../picker/picker-trigger-with-separator.types';
import type { TimePickerPanelProps } from '../time-picker/time-picker-panel.types';

/** Which of the two inputs the user is in, if either. */
export type DateTimePickerFocusedInput = 'left' | 'right' | null;

export interface DateTimePickerProps
  extends Omit<
      DatePickerCalendarProps,
      'anchor' | 'open' | 'referenceDate' | 'value'
    >,
    Omit<TimePickerPanelProps, 'anchor' | 'open' | 'popperProps' | 'value'>,
    Omit<
      PickerTriggerWithSeparatorProps,
      'formatLeft' | 'formatRight' | 'valueLeft' | 'valueRight'
    > {
  /**
   * Default value for date-time picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying date (left input).
   */
  formatDate?: string;
  /**
   * The format for displaying time (right input).
   */
  formatTime?: string;
  /**
   * Other props you may provide to the time picker panel's `MznPopper` component
   */
  popperPropsTime?: TimePickerPanelProps['popperProps'];
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateType;
  /**
   * Current value of date-time picker.
   */
  value?: DateType;
}
