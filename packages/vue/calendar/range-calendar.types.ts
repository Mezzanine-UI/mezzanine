import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import type { CalendarFooterActionsProps } from './calendar-footer-actions.types';
import type { CalendarQuickSelectProps } from './calendar-quick-select.types';
import type { CalendarProps } from './calendar.types';

export interface RangeCalendarProps
  extends Pick<
    CalendarProps,
    | 'renderAnnotations'
    | 'isDateDisabled'
    | 'isDateInRange'
    | 'displayWeekDayLocale'
    | 'isMonthDisabled'
    | 'isMonthInRange'
    | 'displayMonthLocale'
    | 'isWeekDisabled'
    | 'isWeekInRange'
    | 'isYearDisabled'
    | 'isYearInRange'
    | 'isQuarterDisabled'
    | 'isQuarterInRange'
    | 'isHalfYearDisabled'
    | 'isHalfYearInRange'
    | 'disabledMonthSwitch'
    | 'disabledYearSwitch'
    | 'disableOnNext'
    | 'disableOnPrev'
    | 'disableOnDoubleNext'
    | 'disableOnDoublePrev'
  > {
  /**
   * Footer action buttons props
   */
  actions?: CalendarFooterActionsProps['actions'];
  /**
   * Other props you may provide to each `MznCalendar`
   */
  calendarProps?: Omit<CalendarProps, 'mode' | 'value' | 'referenceDate'>;
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * The date currently under the pointer, used to preview the range the user
   * is about to complete.
   *
   * Kept separate from `value` on purpose: `value` says what has been
   * committed and drives what a click means, while this only affects what is
   * painted. Folding the two together makes a half-finished range look
   * finished and turns the closing click into a fresh start.
   */
  previewValue?: DateType;
  /**
   * Quick select options for range calendar.
   * Provide options for users to quickly select specific date ranges.
   */
  quickSelect?: Pick<CalendarQuickSelectProps, 'activeId' | 'options'>;
  /**
   * The reference date for getting the calendar.
   * **The type of `referenceDate` should be the same as your declared `DateType`.**
   */
  referenceDate: DateType;
  /**
   * The displaying cells will be marked as active
   * if the single value of it matches any date object in the array.
   * **The type of `value` should be the same as your declared `DateType`.**
   */
  value?: DateType | DateType[];
}
