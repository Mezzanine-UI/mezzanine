'use client';

import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { useCallback } from 'react';
import { useCalendarContext } from './CalendarContext';

export interface UseRangeScanProps {
  /** Locale defining the first day of each displayed week. */
  displayWeekDayLocale?: string;
  /**
   * Predicate marking a date as unselectable. Consulted in `day` mode.
   */
  isDateDisabled?: (target: DateType) => boolean;
  /**
   * Predicate marking a half year as unselectable. Consulted in `half-year` mode.
   */
  isHalfYearDisabled?: (target: DateType) => boolean;
  /**
   * Predicate marking a month as unselectable. Consulted in `month` mode.
   */
  isMonthDisabled?: (target: DateType) => boolean;
  /**
   * Predicate marking a quarter as unselectable. Consulted in `quarter` mode.
   */
  isQuarterDisabled?: (target: DateType) => boolean;
  /**
   * Predicate marking a week as unselectable. Consulted in `week` mode.
   */
  isWeekDisabled?: (target: DateType) => boolean;
  /**
   * Predicate marking a year as unselectable. Consulted in `year` mode.
   */
  isYearDisabled?: (target: DateType) => boolean;
  /**
   * The granularity the calendar is selecting at. Decides which predicate is
   * consulted and how wide each step of the scan is.
   */
  mode: CalendarMode;
}

/** Maximum predicate calls per scan, regardless of the supplied range. */
export const maxRangeScanSteps = 4000;

/** An incomplete scan does not establish that a range is selectable. */
export type RangeScanResult = 'clear' | 'disabled' | 'incomplete';

export type RangeScan = (start: DateType, end: DateType) => RangeScanResult;

/**
 * Checks each selection unit once, using the displayed calendar's week start.
 * With no predicate, every range is clear without walking any dates.
 * A capped scan reports incomplete so callers can withhold highlighting and
 * selection without mistaking an unchecked range for a valid one.
 */
export function useRangeScan({
  displayWeekDayLocale,
  isDateDisabled,
  isHalfYearDisabled,
  isMonthDisabled,
  isQuarterDisabled,
  isWeekDisabled,
  isYearDisabled,
  mode,
}: UseRangeScanProps): RangeScan {
  const {
    addDay,
    addMonth,
    addYear,
    getCurrentHalfYearFirstDate,
    getCurrentMonthFirstDate,
    getCurrentQuarterFirstDate,
    getCurrentWeekFirstDate,
    getCurrentYearFirstDate,
    isBefore,
    locale,
    setHour,
    setMillisecond,
    setMinute,
    setSecond,
  } = useCalendarContext();

  return useCallback(
    (start, end) => {
      const isUnitDisabled = {
        day: isDateDisabled,
        'half-year': isHalfYearDisabled,
        month: isMonthDisabled,
        quarter: isQuarterDisabled,
        week: isWeekDisabled,
        year: isYearDisabled,
      }[mode];

      /**
       * No predicate for this mode means nothing can be disabled, so there is
       * nothing to walk. Every consumer that does not restrict dates — the
       * common case — stops here.
       */
      if (!isUnitDisabled) {
        return 'clear';
      }

      const [rangeStart, rangeEnd] = isBefore(start, end)
        ? [start, end]
        : [end, start];

      /**
       * Snap to the first date of the unit that contains `rangeStart`, so each
       * unit is visited exactly once and the final unit is never skipped
       * because of a time-of-day difference between the two ends.
       */
      const toUnitStart = (target: DateType): DateType => {
        switch (mode) {
          case 'half-year':
            return getCurrentHalfYearFirstDate(target);
          case 'month':
            return getCurrentMonthFirstDate(target);
          case 'quarter':
            return getCurrentQuarterFirstDate(target);
          case 'week':
            return getCurrentWeekFirstDate(
              target,
              displayWeekDayLocale ?? locale,
            );
          case 'year':
            return getCurrentYearFirstDate(target);
          case 'day':
          default:
            return setMillisecond(
              setSecond(setMinute(setHour(target, 0), 0), 0),
              0,
            );
        }
      };

      /** Step by the mode's own unit rather than by day. */
      const toNextUnit = (target: DateType): DateType => {
        switch (mode) {
          case 'half-year':
            return addMonth(target, 6);
          case 'month':
            return addMonth(target, 1);
          case 'quarter':
            return addMonth(target, 3);
          case 'week':
            return addDay(target, 7);
          case 'year':
            return addYear(target, 1);
          case 'day':
          default:
            return addDay(target, 1);
        }
      };

      let current = toUnitStart(rangeStart);
      let steps = 0;

      while (!isBefore(rangeEnd, current)) {
        if (steps >= maxRangeScanSteps) {
          return 'incomplete';
        }

        if (isUnitDisabled(current)) {
          return 'disabled';
        }

        current = toNextUnit(current);
        steps += 1;
      }

      return 'clear';
    },
    [
      addDay,
      addMonth,
      addYear,
      displayWeekDayLocale,
      getCurrentHalfYearFirstDate,
      getCurrentMonthFirstDate,
      getCurrentQuarterFirstDate,
      getCurrentWeekFirstDate,
      getCurrentYearFirstDate,
      isBefore,
      isDateDisabled,
      isHalfYearDisabled,
      isMonthDisabled,
      isQuarterDisabled,
      isWeekDisabled,
      isYearDisabled,
      locale,
      mode,
      setHour,
      setMillisecond,
      setMinute,
      setSecond,
    ],
  );
}
