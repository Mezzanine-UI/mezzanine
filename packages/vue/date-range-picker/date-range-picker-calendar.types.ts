import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import type { InputTriggerPopperProps } from '../_internal/input-trigger-popper.types';
import type { RangeCalendarProps } from '../calendar/range-calendar.types';

export interface DateRangePickerCalendarProps
  extends Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>,
    Pick<
      RangeCalendarProps,
      | 'actions'
      | 'calendarProps'
      | 'disabledMonthSwitch'
      | 'disabledYearSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'displayMonthLocale'
      | 'displayWeekDayLocale'
      | 'isDateDisabled'
      | 'isDateInRange'
      | 'isMonthDisabled'
      | 'isMonthInRange'
      | 'isWeekDisabled'
      | 'isWeekInRange'
      | 'isYearDisabled'
      | 'isYearInRange'
      | 'isQuarterDisabled'
      | 'isQuarterInRange'
      | 'isHalfYearDisabled'
      | 'isHalfYearInRange'
      | 'previewValue'
      | 'quickSelect'
      | 'renderAnnotations'
      | 'value'
    > {
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Other props you may provide to `MznPopper` component
   */
  popperProps?: Omit<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>;
  /**
   * The reference date for getting the calendar.
   */
  referenceDate: DateType;
}
