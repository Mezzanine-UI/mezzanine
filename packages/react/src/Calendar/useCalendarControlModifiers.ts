'use client';

import {
  CalendarMode,
  DateType,
  calendarYearModuler,
  calendarQuarterYearsCount,
  calendarHalfYearYearsCount,
} from '@mezzanine-ui/core/calendar';
import { useMemo } from 'react';
import { useCalendarContext } from './CalendarContext';

export type CalendarControlModifier = (value: DateType) => DateType;

export type UseCalendarControlModifiersResult = Record<
  CalendarMode,
  {
    single: [CalendarControlModifier, CalendarControlModifier] | null;
    double: [CalendarControlModifier, CalendarControlModifier] | null;
  }
>;

export function useCalendarControlModifiers(): UseCalendarControlModifiersResult {
  const { addYear, addMonth } = useCalendarContext();

  return useMemo(
    () => ({
      // day and week modes: single=month, double=year
      day: {
        single: [(date) => addMonth(date, -1), (date) => addMonth(date, 1)],
        double: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
      },
      week: {
        single: [(date) => addMonth(date, -1), (date) => addMonth(date, 1)],
        double: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
      },
      // month mode: only single (year)
      month: {
        single: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
        double: null,
      },
      // year mode: only single (10 years)
      year: {
        single: [
          (date) => addYear(date, -calendarYearModuler),
          (date) => addYear(date, calendarYearModuler),
        ],
        double: null,
      },
      // quarter mode: only single (5 years)
      quarter: {
        single: [
          (date) => addYear(date, -calendarQuarterYearsCount),
          (date) => addYear(date, calendarQuarterYearsCount),
        ],
        double: null,
      },
      // half-year mode: only single (5 years)
      'half-year': {
        single: [
          (date) => addYear(date, -calendarHalfYearYearsCount),
          (date) => addYear(date, calendarHalfYearYearsCount),
        ],
        double: null,
      },
    }),
    [addYear, addMonth],
  );
}
