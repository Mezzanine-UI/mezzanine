import { ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import {
  calendarYearModuler,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { useCalendarContext } from '../calendar/calendar-context';
import { useCalendarControlModifiers } from '../calendar/use-calendar-control-modifiers';
import { useCalendarModeStack } from '../calendar/use-calendar-mode-stack';

export interface UseDateRangeCalendarControlsResult {
  /** The mode both calendars are currently showing. */
  currentMode: ComputedRef<CalendarMode>;
  /** Moves the left calendar forward. */
  onFirstNext: () => void;
  /** Moves the left calendar back. */
  onFirstPrev: () => void;
  /** Switches both calendars to the month picker. */
  onMonthControlClick: () => void;
  /** Moves the right calendar forward. */
  onSecondNext: () => void;
  /** Moves the right calendar back. */
  onSecondPrev: () => void;
  /** Switches both calendars to the year picker. */
  onYearControlClick: () => void;
  /** Returns to the mode the calendars came from. */
  popModeStack: () => void;
  /** The dates the left and right calendars are built around. */
  referenceDates: Ref<DateType[]>;
  /** Moves the pair so the left calendar lands on this date. */
  updateFirstReferenceDate: (date: DateType) => void;
  /** Moves the pair so the right calendar lands on this date. */
  updateSecondReferenceDate: (date: DateType) => void;
}

/**
 * 兩個並排日曆各自換頁的控制項。
 *
 * 與 useRangeCalendarControls 不同，這裡兩個日曆可以分別移動；只有在停在
 * 呼叫端指定的模式時，移動其中一個才會把另一個推回固定的間距
 * （日／週差一個月、月差一年、年差一個年段）。
 *
 * @example
 * ```ts
 * const { currentMode, referenceDates, onFirstPrev, onSecondNext } =
 *   useDateRangeCalendarControls(today, 'day');
 * ```
 *
 * @see MznDateRangePicker 區間日期選擇器
 */
export function useDateRangeCalendarControls(
  referenceDate: DateType,
  mode: CalendarMode,
): UseDateRangeCalendarControlsResult {
  const calendar = useCalendarContext();
  const modifierGroup = useCalendarControlModifiers();

  const { currentMode, popModeStack, pushModeStack } =
    useCalendarModeStack(mode);

  function getAdder(target: 0 | 1): (date: DateType) => DateType {
    const { addMonth, addYear } = calendar.value;

    if (mode === 'year') {
      return (date) =>
        addYear(date, target ? -calendarYearModuler : calendarYearModuler);
    }

    if (mode === 'month') {
      return (date) => addYear(date, target ? -1 : 1);
    }

    return (date) => addMonth(date, target ? -1 : 1);
  }

  const referenceDates = ref<DateType[]>([
    referenceDate,
    getAdder(0)(referenceDate),
  ]);

  watch(
    () => referenceDate,
    (next) => {
      referenceDates.value = [next, getAdder(0)(next)];
    },
  );

  function move(target: 0 | 1, direction: 0 | 1): void {
    const modifiers = modifierGroup.value[currentMode.value];
    const activeModifiers = modifiers.single ?? modifiers.double;

    if (!activeModifiers) return;

    const newAnchor = activeModifiers[direction](referenceDates.value[target]);
    const newDates = [...referenceDates.value];

    newDates[target] = newAnchor;

    if (currentMode.value === mode) {
      const anotherIndex = Math.abs(target - 1);

      newDates[anotherIndex] = getAdder(target)(newAnchor);
    }

    referenceDates.value = newDates;
  }

  return {
    currentMode,
    onFirstNext: () => move(0, 1),
    onFirstPrev: () => move(0, 0),
    onMonthControlClick: () => pushModeStack('month'),
    onSecondNext: () => move(1, 1),
    onSecondPrev: () => move(1, 0),
    onYearControlClick: () => pushModeStack('year'),
    popModeStack,
    referenceDates,
    updateFirstReferenceDate: (date) => {
      referenceDates.value = [date, getAdder(0)(date)];
    },
    updateSecondReferenceDate: (date) => {
      referenceDates.value = [getAdder(1)(date), date];
    },
  };
}
