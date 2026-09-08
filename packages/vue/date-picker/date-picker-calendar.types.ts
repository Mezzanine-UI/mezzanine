import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import type { InputTriggerPopperProps } from '../_internal/input-trigger-popper.types';
import type { CalendarProps } from '../calendar/calendar.types';

export interface DatePickerCalendarProps
  extends Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>,
    Pick<
      CalendarProps,
      | 'disabledMonthSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'isDateDisabled'
      | 'isMonthDisabled'
      | 'isQuarterDisabled'
      | 'isHalfYearDisabled'
      | 'isWeekDisabled'
      | 'isYearDisabled'
      | 'referenceDate'
    > {
  /**
   * Other calendar props you may provide to `MznCalendar`.
   */
  calendarProps?: Omit<
    CalendarProps,
    | 'disableOnNext'
    | 'disableOnPrev'
    | 'disableOnDoubleNext'
    | 'disableOnDoublePrev'
    | 'displayMonthLocale'
    | 'isDateDisabled'
    | 'isMonthDisabled'
    | 'isQuarterDisabled'
    | 'isHalfYearDisabled'
    | 'isWeekDisabled'
    | 'isYearDisabled'
    | 'mode'
    | 'referenceDate'
    | 'value'
  >;
  /**
   * The desired mode of calendar.<br />
   * The `change` event will only fire if the calendar mode meets this prop.
   */
  mode?: CalendarMode;
  /**
   * Other props you may provide to `MznPopper` component
   */
  popperProps?: Omit<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>;
  /**
   * The calendar cell will be marked as active if it matches the same date of given value.
   */
  value?: DateType;
}
