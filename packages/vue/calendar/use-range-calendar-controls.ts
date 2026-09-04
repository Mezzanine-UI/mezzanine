import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import {
  calendarHalfYearYearsCount,
  calendarQuarterYearsCount,
  calendarYearModuler,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { useCalendarContext } from './calendar-context';
import { useCalendarControlModifiers } from './use-calendar-control-modifiers';
import { useCalendarModeStack } from './use-calendar-mode-stack';

export interface UseRangeCalendarControlsResult {
  /** The mode both calendars are currently showing. */
  currentMode: ComputedRef<CalendarMode>;
  /** Moves both calendars one double step forward. */
  onFirstDoubleNext: ComputedRef<(() => void) | undefined>;
  /** Moves both calendars one double step back. */
  onFirstDoublePrev: ComputedRef<(() => void) | undefined>;
  /** Moves both calendars one step forward. */
  onFirstNext: ComputedRef<(() => void) | undefined>;
  /** Moves both calendars one step back. */
  onFirstPrev: ComputedRef<(() => void) | undefined>;
  /** Switches both calendars to the month picker. */
  onMonthControlClick: () => void;
  /** Same as `onFirstDoubleNext`; the two calendars move together. */
  onSecondDoubleNext: ComputedRef<(() => void) | undefined>;
  /** Same as `onFirstDoublePrev`; the two calendars move together. */
  onSecondDoublePrev: ComputedRef<(() => void) | undefined>;
  /** Same as `onFirstNext`; the two calendars move together. */
  onSecondNext: ComputedRef<(() => void) | undefined>;
  /** Same as `onFirstPrev`; the two calendars move together. */
  onSecondPrev: ComputedRef<(() => void) | undefined>;
  /** Switches both calendars to the year picker. */
  onYearControlClick: () => void;
  /** Returns to the mode the calendars came from. */
  popModeStack: () => void;
  /** The dates the left and right calendars are built around. */
  referenceDates: ComputedRef<[DateType, DateType]>;
  /** Moves the pair so the left calendar lands on this date. */
  updateFirstReferenceDate: (date: DateType) => void;
  /** Moves the pair so the left calendar lands on this date. */
  updateSecondReferenceDate: (date: DateType) => void;
}

/**
 * 雙日曆版本的導航控制項。
 *
 * 兩個日曆永遠一起移動：右邊的參考日期由左邊加上一個模式對應的間距推導而來
 * （日／週為一個月，月為一年，年、季與半年為各自的年數）。
 * 與 React 相同，`referenceDate` prop 之後的變動不會自動同步，避免使用者翻頁時被拉回。
 *
 * @example
 * ```ts
 * const { currentMode, referenceDates, onFirstPrev, onSecondNext } =
 *   useRangeCalendarControls(today, 'day');
 * ```
 *
 * @see MznRangeCalendar 搭配的元件
 * @see useCalendarControls 單一日曆版本
 */
export function useRangeCalendarControls(
  referenceDateProp: DateType,
  mode?: CalendarMode,
): UseRangeCalendarControlsResult {
  const calendar = useCalendarContext();
  const firstReferenceDate = ref<DateType>(referenceDateProp);

  // Calculate the offset between two calendars based on mode
  const getSecondCalendarDate = (firstDate: DateType): DateType => {
    const { addMonth, addYear } = calendar.value;
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
  };

  const secondReferenceDate = ref<DateType>(
    getSecondCalendarDate(referenceDateProp),
  );

  /**
   * @NOTE referenceDate sync off（為了避免自動跳轉）
   */

  const { currentMode, pushModeStack, popModeStack } = useCalendarModeStack(
    mode || 'day',
  );

  const modifierGroup = useCalendarControlModifiers();

  const step = (
    group: 'single' | 'double',
    direction: 0 | 1,
  ): ComputedRef<(() => void) | undefined> =>
    computed(() => {
      const modifiers = modifierGroup.value[currentMode.value][group];

      if (!modifiers) return undefined;

      return () => {
        const newFirst = modifiers[direction](firstReferenceDate.value);

        firstReferenceDate.value = newFirst;
        secondReferenceDate.value = getSecondCalendarDate(newFirst);
      };
    });

  // First calendar controls
  const onFirstPrev = step('single', 0);
  const onFirstNext = step('single', 1);
  const onFirstDoublePrev = step('double', 0);
  const onFirstDoubleNext = step('double', 1);

  const updateReferenceDates = (date: DateType): void => {
    firstReferenceDate.value = date;
    secondReferenceDate.value = getSecondCalendarDate(date);
  };

  return {
    currentMode,
    onMonthControlClick: () => {
      secondReferenceDate.value = calendar.value.addYear(
        firstReferenceDate.value,
        1,
      );
      pushModeStack('month');
    },
    onFirstNext,
    onFirstPrev,
    onFirstDoubleNext,
    onFirstDoublePrev,
    // Second calendar controls (same behavior as first)
    onSecondNext: onFirstNext,
    onSecondPrev: onFirstPrev,
    onSecondDoubleNext: onFirstDoubleNext,
    onSecondDoublePrev: onFirstDoublePrev,
    onYearControlClick: () => {
      secondReferenceDate.value = calendar.value.addYear(
        firstReferenceDate.value,
        calendarYearModuler,
      );
      pushModeStack('year');
    },
    popModeStack,
    referenceDates: computed((): [DateType, DateType] => [
      firstReferenceDate.value,
      secondReferenceDate.value,
    ]),
    updateFirstReferenceDate: updateReferenceDates,
    updateSecondReferenceDate: updateReferenceDates,
  };
}
