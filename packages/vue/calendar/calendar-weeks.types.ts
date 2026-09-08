import type { DateType } from '@mezzanine-ui/core/calendar';
import type { CalendarDayOfWeekProps } from './calendar-day-of-week.types';
import type { CalendarMonthsProps } from './calendar-months.types';
import type { CalendarYearsProps } from './calendar-years.types';

export interface CalendarWeeksProps
  extends Pick<CalendarDayOfWeekProps, 'displayWeekDayLocale'>,
    Pick<CalendarYearsProps, 'isYearDisabled'>,
    Pick<CalendarMonthsProps, 'isMonthDisabled'> {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object of first date in week as its parameter.
   */
  isWeekDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the week is in range.
   * The method takes the date object of first date in week as its parameter.
   */
  isWeekInRange?: (firstDateOfWeek: DateType) => boolean;
  /**
   * The reference date for getting the dates of calendar.
   */
  referenceDate: DateType;
  /**
   * The week will be marked as active if the first date of week matches the same date of any value in the array.
   */
  value?: DateType[];
}
