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
 * Returns whether `[start, end]` covers at least one disabled unit.
 *
 * Pass `bounds` to restrict the scan to a window — the caller gets an answer
 * about the overlap only, which keeps the cost constant no matter how wide the
 * range is.
 */
export type HasDisabledDateInRange = (
  start: DateType,
  end: DateType,
  bounds?: [DateType, DateType],
) => boolean;

/**
 * 判斷一段區間內是否存在「不可選取」的單位。
 *
 * 掃描以 `mode` 對應的單位為步進（`year` 就一年一步，而非一天一步），
 * 並且在該 `mode` 沒有對應的 disabled predicate 時直接短路回傳 `false`——
 * 沒有 predicate 就沒有東西可判斷，不需要走訪任何日期。
 *
 * 帶入 `bounds` 可把掃描夾在指定視窗內，讓成本與區間長度脫鉤。
 *
 * @example
 * ```tsx
 * const hasDisabledDateInRange = useHasDisabledDateInRange({ isDateDisabled, mode });
 *
 * // 全域語意：整段區間都要檢查
 * hasDisabledDateInRange(start, end);
 *
 * // 夾在可視範圍內：只回答「畫面上看得到的那段」有沒有 disabled
 * hasDisabledDateInRange(start, end, visibleRange);
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
    (start, end, bounds) => {
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

      let [rangeStart, rangeEnd] = isBefore(start, end)
        ? [start, end]
        : [end, start];

      if (bounds) {
        const [boundStart, boundEnd] = isBefore(bounds[0], bounds[1])
          ? bounds
          : [bounds[1], bounds[0]];

        if (isBefore(rangeStart, boundStart)) {
          rangeStart = boundStart;
        }

        if (isBefore(boundEnd, rangeEnd)) {
          rangeEnd = boundEnd;
        }

        // The range and the window do not overlap at all.
        if (isBefore(rangeEnd, rangeStart)) {
          return false;
        }
      }

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

      while (!isBefore(rangeEnd, current)) {
        if (isUnitDisabled(current)) {
          return true;
        }

        current = toNextUnit(current);
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
