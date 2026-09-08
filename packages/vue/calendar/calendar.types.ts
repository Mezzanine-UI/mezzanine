import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import type { CalendarControlsProps } from './calendar-controls.types';
import type { CalendarDaysProps } from './calendar-days.types';
import type { CalendarHalfYearsProps } from './calendar-half-years.types';
import type { CalendarMonthsProps } from './calendar-months.types';
import type { CalendarQuartersProps } from './calendar-quarters.types';
import type { CalendarQuickSelectProps } from './calendar-quick-select.types';
import type { CalendarWeeksProps } from './calendar-weeks.types';
import type { CalendarYearsProps } from './calendar-years.types';

export interface CalendarProps
  extends Pick<
      CalendarDaysProps,
      | 'renderAnnotations'
      | 'isDateDisabled'
      | 'isDateInRange'
      | 'displayWeekDayLocale'
    >,
    Pick<
      CalendarMonthsProps,
      'isMonthDisabled' | 'isMonthInRange' | 'displayMonthLocale'
    >,
    Pick<CalendarWeeksProps, 'isWeekDisabled' | 'isWeekInRange'>,
    Pick<CalendarYearsProps, 'isYearDisabled' | 'isYearInRange'>,
    Pick<CalendarQuartersProps, 'isQuarterDisabled' | 'isQuarterInRange'>,
    Pick<CalendarHalfYearsProps, 'isHalfYearDisabled' | 'isHalfYearInRange'>,
    Pick<
      CalendarControlsProps,
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
    > {
  /**
   * Other props you may provide to `MznCalendarDays`
   */
  calendarDaysProps?: Omit<
    CalendarDaysProps,
    | 'referenceDate'
    | 'value'
    | 'displayWeekDayLocale'
    | 'isDateDisabled'
    | 'isDateInRange'
  >;
  /**
   * Other props you may provide to `MznCalendarHalfYears`
   */
  calendarHalfYearsProps?: Omit<
    CalendarHalfYearsProps,
    'referenceDate' | 'value' | 'isHalfYearDisabled' | 'isHalfYearInRange'
  >;
  /**
   * Other props you may provide to `MznCalendarMonths`
   */
  calendarMonthsProps?: Omit<
    CalendarMonthsProps,
    | 'referenceDate'
    | 'value'
    | 'isMonthDisabled'
    | 'isMonthInRange'
    | 'displayMonthLocale'
  >;
  /**
   * Other props you may provide to `MznCalendarQuarters`
   */
  calendarQuartersProps?: Omit<
    CalendarQuartersProps,
    'referenceDate' | 'value' | 'isQuarterDisabled' | 'isQuarterInRange'
  >;
  /**
   * Other props you may provide to `MznCalendarWeeks`
   */
  calendarWeeksProps?: Omit<
    CalendarWeeksProps,
    | 'referenceDate'
    | 'value'
    | 'displayWeekDayLocale'
    | 'isWeekDisabled'
    | 'isWeekInRange'
  >;
  /**
   * Other props you may provide to `MznCalendarYears`
   */
  calendarYearsProps?: Omit<
    CalendarYearsProps,
    'referenceDate' | 'value' | 'isYearDisabled' | 'isYearInRange'
  >;
  /**
   * Disabled footer control element
   * @default false
   */
  disabledFooterControl?: boolean;
  /**
   * Disabled `Month` calendar button click
   * @default false
   */
  disabledMonthSwitch?: boolean;
  /**
   * Disabled `Year` calendar button click
   * @default false
   */
  disabledYearSwitch?: boolean;
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Quick select options for calendar.
   * Provide options for users to quickly select specific dates or ranges.
   */
  quickSelect?: Pick<CalendarQuickSelectProps, 'activeId' | 'options'>;
  /**
   * The reference date for getting the calendar.
   * **The type of `referenceDate` should be the same as your declared `DateType`.**
   */
  referenceDate: DateType;
  /**
   * The displaying cells will be marked as active
   * if the single value of it matches any date object in the array. <br />
   * **The type of `value` should be the same as your declared `DateType`.**
   */
  value?: DateType | DateType[];
}
