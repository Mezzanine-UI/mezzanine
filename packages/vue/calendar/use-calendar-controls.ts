import { computed, ref, toValue, watch } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';
import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { useCalendarControlModifiers } from './use-calendar-control-modifiers';
import { useCalendarModeStack } from './use-calendar-mode-stack';

export interface UseCalendarControlsResult {
  /** The mode the calendar is currently showing. */
  currentMode: ComputedRef<CalendarMode>;
  /** Switches to the month picker. */
  onMonthControlClick: () => void;
  /** Moves one double step forward, or `undefined` when the mode has none. */
  onDoubleNext: ComputedRef<(() => void) | undefined>;
  /** Moves one double step back, or `undefined` when the mode has none. */
  onDoublePrev: ComputedRef<(() => void) | undefined>;
  /** Moves one step forward, or `undefined` when the mode has none. */
  onNext: ComputedRef<(() => void) | undefined>;
  /** Moves one step back, or `undefined` when the mode has none. */
  onPrev: ComputedRef<(() => void) | undefined>;
  /** Switches to the year picker. */
  onYearControlClick: () => void;
  /** Returns to the mode the calendar came from. */
  popModeStack: () => void;
  /** The date the calendar is currently built around. */
  referenceDate: Ref<DateType>;
  /** Moves the calendar to another reference date. */
  updateReferenceDate: (date: DateType) => void;
}

/**
 * 管理日曆導航控制項狀態的 composable。
 *
 * 維護目前顯示的參考日期（`referenceDate`）與顯示模式（`currentMode`），
 * 並提供上一頁、下一頁、雙箭頭跳轉以及切換至月份／年份選擇模式等操作。
 * 沒有對應箭頭的模式會回傳 `undefined`，日曆便不會渲染那顆按鈕。
 *
 * @example
 * ```ts
 * import { useCalendarControls } from '@mezzanine-ui/vue/calendar';
 *
 * const {
 *   currentMode, referenceDate,
 *   onPrev, onNext, onMonthControlClick, onYearControlClick, popModeStack,
 * } = useCalendarControls(today, 'day');
 * ```
 *
 * @see MznCalendar 搭配的元件
 * @see useRangeCalendarControls 雙日曆版本
 */
export function useCalendarControls(
  referenceDateProp: MaybeRefOrGetter<DateType>,
  mode?: CalendarMode,
): UseCalendarControlsResult {
  const referenceDate = ref<DateType>(toValue(referenceDateProp));

  watch(
    () => toValue(referenceDateProp),
    (next) => {
      referenceDate.value = next;
    },
  );

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
        referenceDate.value = modifiers[direction](referenceDate.value);
      };
    });

  return {
    currentMode,
    onMonthControlClick: () => pushModeStack('month'),
    onNext: step('single', 1),
    onPrev: step('single', 0),
    onDoubleNext: step('double', 1),
    onDoublePrev: step('double', 0),
    onYearControlClick: () => pushModeStack('year'),
    popModeStack,
    referenceDate,
    updateReferenceDate: (date: DateType) => {
      referenceDate.value = date;
    },
  };
}
