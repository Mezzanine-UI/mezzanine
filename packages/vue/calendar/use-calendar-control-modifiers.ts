import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import {
  calendarHalfYearYearsCount,
  calendarQuarterYearsCount,
  calendarYearModuler,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { useCalendarContext } from './calendar-context';

export type CalendarControlModifier = (value: DateType) => DateType;

export type UseCalendarControlModifiersResult = Record<
  CalendarMode,
  {
    double: [CalendarControlModifier, CalendarControlModifier] | null;
    single: [CalendarControlModifier, CalendarControlModifier] | null;
  }
>;

/**
 * 每個日曆模式的上一頁／下一頁位移函式。
 *
 * `single` 是單箭頭的位移、`double` 是雙箭頭的位移；為 `null` 代表該模式沒有那組箭頭，
 * 日曆便不會渲染對應按鈕。
 *
 * @example
 * ```ts
 * const modifiers = useCalendarControlModifiers();
 * const [minusOneMonth] = modifiers.value.day.single!;
 * ```
 *
 * @see useCalendarControls 使用這些位移函式的控制項
 */
export function useCalendarControlModifiers(): ComputedRef<UseCalendarControlModifiersResult> {
  const calendar = useCalendarContext();

  return computed((): UseCalendarControlModifiersResult => {
    const { addMonth, addYear } = calendar.value;

    return {
      // day and week modes: single=month, double=year
      day: {
        single: [(date) => addMonth(date, -1), (date) => addMonth(date, 1)],
        double: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
      },
      week: {
        single: [(date) => addMonth(date, -1), (date) => addMonth(date, 1)],
        double: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
      },
      // month mode: only single
      month: {
        single: [(date) => addYear(date, -1), (date) => addYear(date, 1)],
        double: null,
      },
      // year mode: only single
      year: {
        single: [
          (date) => addYear(date, -calendarYearModuler),
          (date) => addYear(date, calendarYearModuler),
        ],
        double: null,
      },
      // quarter mode: only single
      quarter: {
        single: [
          (date) => addYear(date, -calendarQuarterYearsCount),
          (date) => addYear(date, calendarQuarterYearsCount),
        ],
        double: null,
      },
      // half-year mode: only single
      'half-year': {
        single: [
          (date) => addYear(date, -calendarHalfYearYearsCount),
          (date) => addYear(date, calendarHalfYearYearsCount),
        ],
        double: null,
      },
    };
  });
}
