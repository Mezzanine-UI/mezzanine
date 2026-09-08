import type { DateType } from '@mezzanine-ui/core/calendar';

export interface CalendarHalfYearsProps {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object as its parameter.
   */
  isHalfYearDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the half-year is in range.
   * The method takes the date object as its parameter.
   */
  isHalfYearInRange?: (date: DateType) => boolean;
  /**
   * The reference date for getting the half-years range and computing the date object.
   */
  referenceDate: DateType;
  /**
   * The half-year will be marked as active if it matches the same half-year of any value in the array.
   */
  value?: DateType[];
}
