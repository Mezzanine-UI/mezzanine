import type { DateType } from '@mezzanine-ui/core/calendar';

export interface CalendarYearsProps {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object as its parameter.
   */
  isYearDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the year is in range.
   * The method takes the date object as its parameter.
   */
  isYearInRange?: (date: DateType) => boolean;
  /**
   * The refernce date for getting the years range and computing the date object.
   */
  referenceDate: DateType;
  /**
   * The year will be marked as active if it matches the same year of any value in the array.
   */
  value?: DateType[];
}
