'use client';

import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { useCallback } from 'react';
import { useCalendarContext } from './CalendarContext';

export interface UseHasDisabledDateInRangeProps {
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

/**
 * Upper bound on how many units one scan will walk.
 *
 * Ranges are user-supplied and not always sane — a mistyped year in the inputs
 * produces a span of hundreds of thousands of days. Past this many steps the
 * scan gives up and reports "no disabled unit found", which leaves the range
 * selectable and painted rather than silently blocking it. In `day` mode this
 * covers roughly eleven years; every other mode covers far longer.
 */
export const maxRangeScanSteps = 4000;

/**
 * Returns whether `[start, end]` covers at least one disabled unit.
 *
 * Answers for the whole range, so callers deciding what to paint and callers
 * deciding what may be selected always agree.
 */
export type HasDisabledDateInRange = (
  start: DateType,
  end: DateType,
) => boolean;

/**
 * 判斷一段區間內是否存在「不可選取」的單位。
 *
 * 掃描以 `mode` 對應的單位為步進（`year` 就一年一步，而非一天一步），
 * 並且在該 `mode` 沒有對應的 disabled predicate 時直接短路回傳 `false`——
 * 沒有 predicate 就沒有東西可判斷，不需要走訪任何日期。
 *
 * 走訪步數上限為 {@link maxRangeScanSteps}，超過就視為找不到，
 * 避免打字誤植出來的荒謬區間把畫面鎖死。
 *
 * @example
 * ```tsx
 * const hasDisabledDateInRange = useHasDisabledDateInRange({ isDateDisabled, mode });
 *
 * if (hasDisabledDateInRange(start, end)) {
 *   // 區間跨越了不可選取的單位
 * }
 * ```
 *
 * @see {@link RangeCalendar} 搭配的元件
 */
export function useHasDisabledDateInRange({
  isDateDisabled,
  isHalfYearDisabled,
  isMonthDisabled,
  isQuarterDisabled,
  isWeekDisabled,
  isYearDisabled,
  mode,
}: UseHasDisabledDateInRangeProps): HasDisabledDateInRange {
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
        return false;
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
            return getCurrentWeekFirstDate(target, locale);
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
        // Give up rather than lock the tab on an absurd range. Reporting
        // "nothing disabled found" keeps such a range usable; reporting the
        // opposite would make it permanently unselectable.
        if (steps >= maxRangeScanSteps) {
          return false;
        }

        if (isUnitDisabled(current)) {
          return true;
        }

        current = toNextUnit(current);
        steps += 1;
      }

      return false;
    },
    [
      addDay,
      addMonth,
      addYear,
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
