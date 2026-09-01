'use client';

import { useState, useCallback, useMemo } from 'react';
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

  // Calculate how far apart two adjacent calendars sit, based on mode
  const addCalendarPeriod = useCallback(
    (date: DateType, diff: number): DateType => {
      const currentMode = mode || 'day';
      switch (currentMode) {
        case 'year':
          return addYear(date, calendarYearModuler * diff);
        case 'month':
          return addYear(date, diff);
        case 'quarter':
          return addYear(date, calendarQuarterYearsCount * diff);
        case 'half-year':
          return addYear(date, calendarHalfYearYearsCount * diff);
        case 'week':
        case 'day':
        default:
          return addMonth(date, diff);
      }
    },
    [addMonth, addYear, mode],
  );

  const getSecondCalendarDate = useCallback(
    (firstDate: DateType): DateType => addCalendarPeriod(firstDate, 1),
    [addCalendarPeriod],
  );

  const [secondReferenceDate, setSecondReferenceDate] = useState(() =>
    getSecondCalendarDate(referenceDateProp),
  );

  /**
   * @NOTE referenceDate sync off（為了避免自動跳轉）
   */
  // useEffect(() => {
  //   setFirstReferenceDate(referenceDateProp);
  //   setSecondReferenceDate(getSecondCalendarDate(referenceDateProp));
  // }, [referenceDateProp, getSecondCalendarDate]);

  const { currentMode, pushModeStack, popModeStack } = useCalendarModeStack(
    mode || 'day',
  );

  const modifierGroup = useCalendarControlModifiers();

  // First calendar controls
  const onFirstPrev = useMemo(() => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    return () => {
      const [handleMinus] = modifiers;
      const newFirst = handleMinus(firstReferenceDate);
      setFirstReferenceDate(newFirst);
      setSecondReferenceDate(getSecondCalendarDate(newFirst));
    };
  }, [currentMode, modifierGroup, firstReferenceDate, getSecondCalendarDate]);

  const onFirstNext = useMemo(() => {
    const modifiers = modifierGroup[currentMode].single;
    if (!modifiers) return;

    return () => {
      const [, handleAdd] = modifiers;
      const newFirst = handleAdd(firstReferenceDate);
      setFirstReferenceDate(newFirst);
      setSecondReferenceDate(getSecondCalendarDate(newFirst));
    };
  }, [currentMode, modifierGroup, firstReferenceDate, getSecondCalendarDate]);

  const onFirstDoublePrev = useMemo(() => {
    const modifiers = modifierGroup[currentMode].double;
    if (!modifiers) return;

    return () => {
      const [handleMinus] = modifiers;
      const newFirst = handleMinus(firstReferenceDate);
      setFirstReferenceDate(newFirst);
      setSecondReferenceDate(getSecondCalendarDate(newFirst));
    };
  }, [currentMode, modifierGroup, firstReferenceDate, getSecondCalendarDate]);

  const onFirstDoubleNext = useMemo(() => {
    const modifiers = modifierGroup[currentMode].double;
    if (!modifiers) return;

    return () => {
      const [, handleAdd] = modifiers;
      const newFirst = handleAdd(firstReferenceDate);
      setFirstReferenceDate(newFirst);
      setSecondReferenceDate(getSecondCalendarDate(newFirst));
    };
  }, [currentMode, modifierGroup, firstReferenceDate, getSecondCalendarDate]);

  // Second calendar controls (same behavior as first)
  const onSecondPrev = onFirstPrev;
  const onSecondNext = onFirstNext;
  const onSecondDoublePrev = onFirstDoublePrev;
  const onSecondDoubleNext = onFirstDoubleNext;

  const onMonthControlClick = useCallback(() => {
    setFirstReferenceDate(firstReferenceDate);
    setSecondReferenceDate(addYear(firstReferenceDate, 1));
    pushModeStack('month');
  }, [firstReferenceDate, pushModeStack, addYear]);

  const onYearControlClick = useCallback(() => {
    setFirstReferenceDate(firstReferenceDate);
    setSecondReferenceDate(addYear(firstReferenceDate, calendarYearModuler));
    pushModeStack('year');
  }, [firstReferenceDate, pushModeStack, addYear]);

  const updateFirstReferenceDate = useCallback(
    (date: DateType) => {
      setFirstReferenceDate(date);
      setSecondReferenceDate(getSecondCalendarDate(date));
    },
    [getSecondCalendarDate],
  );

  const updateSecondReferenceDate = useCallback(
    (date: DateType) => {
      setFirstReferenceDate(date);
      setSecondReferenceDate(getSecondCalendarDate(date));
    },
    [getSecondCalendarDate],
  );

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
    updateFirstReferenceDate,
    updateSecondReferenceDate,
    /**
     * The span the two calendars can currently paint, padded by one period on
     * each side so the leading/trailing overflow cells of each grid are
     * covered. Work that only affects what is on screen can be clamped to it.
     */
    visibleRange: useMemo(
      () =>
        [
          addCalendarPeriod(firstReferenceDate, -1),
          addCalendarPeriod(secondReferenceDate, 1),
        ] as [DateType, DateType],
      [addCalendarPeriod, firstReferenceDate, secondReferenceDate],
    ),
  };
}
