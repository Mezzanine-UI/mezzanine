'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  DateType,
  CalendarMode,
  calendarYearModuler,
  calendarQuarterYearsCount,
  calendarHalfYearYearsCount,
} from '@mezzanine-ui/core/calendar';
import { useCalendarContext } from './CalendarContext';
import { useCalendarControlModifiers } from './useCalendarControlModifiers';
import { useCalendarModeStack } from './useCalendarModeStack';

export function useRangeCalendarControls(
  referenceDateProp: DateType,
  mode?: CalendarMode,
) {
  const { addMonth, addYear } = useCalendarContext();
  const [firstReferenceDate, setFirstReferenceDate] =
    useState(referenceDateProp);

  // Calculate the offset between two calendars based on mode
  const getSecondCalendarDate = useCallback(
    (firstDate: DateType): DateType => {
      const currentMode = mode || 'day';
      switch (currentMode) {
        case 'year':
          return addYear(firstDate, calendarYearModuler);
        case 'month':
          return addYear(firstDate, 1);
        case 'quarter':
          return addYear(firstDate, calendarQuarterYearsCount);
        case 'half-year':
          return addYear(firstDate, calendarHalfYearYearsCount);
        case 'week':
        case 'day':
        default:
          return addMonth(firstDate, 1);
      }
    },
    [addMonth, addYear, mode],
  );

  const [secondReferenceDate, setSecondReferenceDate] = useState(() =>
    getSecondCalendarDate(referenceDateProp),
  );

  useEffect(() => {
    setFirstReferenceDate(referenceDateProp);
    setSecondReferenceDate(getSecondCalendarDate(referenceDateProp));
  }, [referenceDateProp, getSecondCalendarDate]);

  const { currentMode, pushModeStack, popModeStack } = useCalendarModeStack(
    mode || 'day',
  );

  const modifierGroup = useCalendarControlModifiers();

  // First calendar controls
  const onFirstPrev = () => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    const [handleMinus] = modifiers;
    const newFirst = handleMinus(firstReferenceDate);
    setFirstReferenceDate(newFirst);
    setSecondReferenceDate(getSecondCalendarDate(newFirst));
  };

  const onFirstNext = () => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    const [, handleAdd] = modifiers;
    const newFirst = handleAdd(firstReferenceDate);
    setFirstReferenceDate(newFirst);
    setSecondReferenceDate(getSecondCalendarDate(newFirst));
  };

  const onFirstDoublePrev = () => {
    const [handleMinus] = modifierGroup[currentMode].double;
    const newFirst = handleMinus(firstReferenceDate);
    setFirstReferenceDate(newFirst);
    setSecondReferenceDate(getSecondCalendarDate(newFirst));
  };

  const onFirstDoubleNext = () => {
    const [, handleAdd] = modifierGroup[currentMode].double;
    const newFirst = handleAdd(firstReferenceDate);
    setFirstReferenceDate(newFirst);
    setSecondReferenceDate(getSecondCalendarDate(newFirst));
  };

  // Second calendar controls (same behavior as first)
  const onSecondPrev = onFirstPrev;
  const onSecondNext = onFirstNext;
  const onSecondDoublePrev = onFirstDoublePrev;
  const onSecondDoubleNext = onFirstDoubleNext;

  const onMonthControlClick = () => pushModeStack('month');
  const onYearControlClick = () => pushModeStack('year');

  return {
    currentMode,
    onMonthControlClick,
    onFirstNext,
    onFirstPrev,
    onFirstDoubleNext,
    onFirstDoublePrev,
    onSecondNext,
    onSecondPrev,
    onSecondDoubleNext,
    onSecondDoublePrev,
    onYearControlClick,
    popModeStack,
    referenceDates: useMemo(
      () => [firstReferenceDate, secondReferenceDate] as [DateType, DateType],
      [firstReferenceDate, secondReferenceDate],
    ),
    updateFirstReferenceDate: setFirstReferenceDate,
    updateSecondReferenceDate: setSecondReferenceDate,
  };
}
