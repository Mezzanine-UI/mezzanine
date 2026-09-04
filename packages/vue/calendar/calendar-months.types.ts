import type { DateType } from '@mezzanine-ui/core/calendar';
import type { CalendarYearsProps } from './calendar-years.types';

export interface CalendarMonthsProps
  extends Pick<CalendarYearsProps, 'isYearDisabled'> {
  /**
   * The locale you want to use when rendering the names of month.
   * If none provided, it will use the `displayMonthLocale` from calendar context.
   */
  displayMonthLocale?: string;
  /**
   * Provide if you have a custom disabling logic. The method takes the date object as its parameter.
   */
  isMonthDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the month is in range.
   * The method takes the date object as its parameter.
   */
  isMonthInRange?: (date: DateType) => boolean;
  /**
   * The refernce date for computing the date object.
   */
  referenceDate: DateType;
  /**
   * If provided, each month that matches the same months in this array will be marked as active.
   */
  value?: DateType[];
}
