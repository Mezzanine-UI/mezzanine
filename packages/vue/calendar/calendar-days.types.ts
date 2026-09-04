import type { DateType } from '@mezzanine-ui/core/calendar';
import type { TypographyColor } from '@mezzanine-ui/core/typography';
import type { CalendarDayOfWeekProps } from './calendar-day-of-week.types';
import type { CalendarMonthsProps } from './calendar-months.types';
import type { CalendarYearsProps } from './calendar-years.types';

export interface CalendarDaysProps
  extends Pick<CalendarDayOfWeekProps, 'displayWeekDayLocale'>,
    Pick<CalendarYearsProps, 'isYearDisabled'>,
    Pick<CalendarMonthsProps, 'isMonthDisabled'> {
  /**
   * Provide if you have a custom disabling logic. The method takes the date object as its parameter.
   */
  isDateDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the date is in range.
   * The method takes the date object as its parameter.
   */
  isDateInRange?: (date: DateType) => boolean;
  /**
   * The reference date for getting the month of the calendar.
   */
  referenceDate: DateType;
  /**
   * The extra annotations for specific dates.
   */
  renderAnnotations?: (date: DateType) => {
    value: string;
    color?: TypographyColor;
  };
  /**
   * If provided, each date that matches the same dates in this array will be marked as active.
   */
  value?: DateType[];
}
