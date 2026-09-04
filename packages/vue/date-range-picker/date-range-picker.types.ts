import type { DateType } from '@mezzanine-ui/core/calendar';
import type { RangePickerValue } from '@mezzanine-ui/core/picker';
import type { CalendarFooterActionsProps } from '../calendar/calendar-footer-actions.types';
import type { RangePickerTriggerProps } from '../picker/range-picker-trigger.types';
import type { DateRangePickerCalendarProps } from './date-range-picker-calendar.types';

export interface DateRangePickerProps
  extends Pick<
      DateRangePickerCalendarProps,
      | 'calendarProps'
      | 'disabledMonthSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'displayWeekDayLocale'
      | 'fadeProps'
      | 'isDateDisabled'
      | 'isWeekDisabled'
      | 'isMonthDisabled'
      | 'isYearDisabled'
      | 'isQuarterDisabled'
      | 'isHalfYearDisabled'
      | 'mode'
      | 'popperProps'
      | 'quickSelect'
      | 'renderAnnotations'
    >,
    Pick<
      RangePickerTriggerProps,
      | 'clearable'
      | 'disabled'
      | 'error'
      | 'errorMessagesFrom'
      | 'errorMessagesTo'
      | 'fullWidth'
      | 'inputFromPlaceholder'
      | 'inputFromProps'
      | 'inputToPlaceholder'
      | 'inputToProps'
      | 'readOnly'
      | 'required'
      | 'size'
      | 'validateFrom'
      | 'validateTo'
    > {
  /**
   * Footer action buttons props.
   * When provided, the calendar will NOT auto-close after range selection.
   * This allows users to interact with the action buttons before confirming.
   */
  actions?: CalendarFooterActionsProps['actions'];
  /**
   * The confirm mode for date range selection.
   * - `'immediate'` (default): change is emitted immediately after selecting both dates,
   *   and calendar auto-closes (unless actions prop is provided).
   * - `'manual'`: change is emitted only when user clicks the confirm button.
   *   Default actions (Confirm/Cancel) will be auto-generated if not provided.
   * @default 'immediate'
   */
  confirmMode?: 'immediate' | 'manual';
  /**
   * Default value for date range picker.
   */
  defaultValue?: [DateType, DateType];
  /**
   * The format for displaying date.
   */
  format?: string;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateRangePickerCalendarProps['referenceDate'];
  /**
   * Value of the range picker.
   * It is an array of your declared `DateType` which represents from and to in order.
   */
  value?: RangePickerValue;
}
