import {
  CalendarMode,
  DateType,
  calendarYearModuler,
} from '@mezzanine-ui/core/calendar';
import { useMemo } from 'react';
import { useCalendarContext } from './CalendarContext';

export type CalendarControlModifier = (value: DateType) => DateType;

export type UseCalendarControlModifiersResult = Record<
  CalendarMode,
  [CalendarControlModifier, CalendarControlModifier]
>;

export function useCalendarControlModifiers(): UseCalendarControlModifiersResult {
  const { addYear, addMonth } = useCalendarContext();

  return useMemo(
    () => ({
      year: [
        (date) => addYear(date, -calendarYearModuler),
        (date) => addYear(date, calendarYearModuler),
      ],
      month: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
      week: [(date) => addMonth(date, -1), (date) => addMonth(date, 1)],
      day: [(date) => addMonth(date, -1), (date) => addMonth(date, 1)],
    }),
    [addYear, addMonth],
  );
}
