import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import type { CalendarMode } from '@mezzanine-ui/core/calendar';

export interface UseCalendarModeStackResult {
  /** The mode on top of the stack — what the calendar is currently showing. */
  currentMode: ComputedRef<CalendarMode>;
  /** Drops the top mode, returning to the one below it. */
  popModeStack: () => void;
  /** Shows another mode without losing the one it came from. */
  pushModeStack: (newMode: CalendarMode) => void;
}

/**
 * 以堆疊管理日曆目前顯示的模式。
 *
 * 點日曆上方的月份／年份按鈕會 push 新模式，選完之後 pop 回原本的模式，
 * 因此「日 → 月 → 日」這種來回切換不需要呼叫端自己記住前一個狀態。
 * 初始模式只在建立時取一次，之後的變動由 push／pop 決定。
 *
 * @example
 * ```ts
 * const { currentMode, popModeStack, pushModeStack } = useCalendarModeStack('day');
 *
 * pushModeStack('month');
 * ```
 *
 * @see useCalendarControls 建於此之上的完整控制項
 */
export function useCalendarModeStack(
  mode: CalendarMode,
): UseCalendarModeStackResult {
  const modeStack = ref<CalendarMode[]>([mode]);
  const currentMode = computed((): CalendarMode => modeStack.value[0]);

  const pushModeStack = (newMode: CalendarMode): void => {
    modeStack.value = [newMode, ...modeStack.value];
  };

  const popModeStack = (): void => {
    modeStack.value =
      modeStack.value.length > 1
        ? modeStack.value.slice(1, modeStack.value.length)
        : modeStack.value;
  };

  return {
    currentMode,
    popModeStack,
    pushModeStack,
  };
}
