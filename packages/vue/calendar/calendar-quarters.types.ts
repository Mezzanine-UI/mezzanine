import type { DateType } from '@mezzanine-ui/core/calendar';

export interface CalendarQuartersProps {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object as its parameter.
   */
  isQuarterDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the quarter is in range.
   * The method takes the date object as its parameter.
   */
  isQuarterInRange?: (date: DateType) => boolean;
  /**
   * The reference date for getting the quarters range and computing the date object.
   */
  referenceDate: DateType;
  /**
   * The quarter will be marked as active if it matches the same quarter of any value in the array.
   */
  value?: DateType[];
}
