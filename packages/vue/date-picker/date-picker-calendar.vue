<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import MznInputTriggerPopper from '../_internal/input-trigger-popper.vue';
import { resolveElement } from '../_internal/resolve-element';
import { useCalendarContext } from '../calendar/calendar-context';
import MznCalendar from '../calendar/calendar.vue';
import { useCalendarControls } from '../calendar/use-calendar-controls';
import type { DatePickerCalendarProps } from './date-picker-calendar.types';

/**
 * 日期選擇器的日曆浮層。
 *
 * 自己管理模式堆疊：點月份或年份會切換面板，選完之後回到 `mode` 指定的模式，
 * 只有停在該模式時的選取才會送出 `change`。滑過任何格子都會送出 `hover`，
 * 離開面板時送出 `leave`，供呼叫端做輸入框的預覽。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDatePickerCalendar } from '@mezzanine-ui/vue/date-picker';
 * <\/script>
 *
 * <template>
 *   <MznDatePickerCalendar
 *     :anchor="anchor"
 *     :open="open"
 *     :reference-date="referenceDate"
 *     :value="value"
 *     @change="onChange"
 *   />
 * </template>
 * ```
 *
 * @see MznDatePicker 使用這個浮層的元件
 */
const props = withDefaults(defineProps<DatePickerCalendarProps>(), {
  anchor: undefined,
  calendarProps: undefined,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabledMonthSwitch: undefined,
  disabledYearSwitch: undefined,
  displayMonthLocale: undefined,
  fadeProps: undefined,
  isDateDisabled: undefined,
  isHalfYearDisabled: undefined,
  isMonthDisabled: undefined,
  isQuarterDisabled: undefined,
  isWeekDisabled: undefined,
  isYearDisabled: undefined,
  mode: 'day',
  open: undefined,
  popperProps: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [target: DateType];
  hover: [date: DateType];
  leave: [];
}>();

const calendar = useCalendarContext();

const popper = ref<InstanceType<typeof MznInputTriggerPopper> | null>(null);
const calendarComponent = ref<InstanceType<typeof MznCalendar> | null>(null);

/**
 * React forwards refs to the popper and to the calendar; both elements are
 * exposed here instead.
 */
defineExpose({
  calendar: computed((): HTMLElement | null =>
    resolveElement(calendarComponent.value as ComponentPublicInstance | null),
  ),
  element: computed((): HTMLElement | null => popper.value?.element ?? null),
});

const displayMonthLocale = computed(
  (): string => props.displayMonthLocale ?? calendar.value.locale,
);

const {
  currentMode,
  onMonthControlClick,
  onNext,
  onPrev,
  onDoublePrev,
  onDoubleNext,
  onYearControlClick,
  popModeStack,
  referenceDate,
  updateReferenceDate,
} = useCalendarControls(() => props.referenceDate, props.mode);

// Helper to handle mode switching with optional value transformation
function handleModeChange(
  target: DateType,
  transformValue?: (target: DateType, reference: DateType) => DateType,
): void {
  const result = transformValue
    ? transformValue(target, referenceDate.value)
    : target;
  // React reads `currentMode` from the render closure, so the comparison
  // below sees the mode as it was before the stack was popped.
  const modeBeforePop = currentMode.value;

  updateReferenceDate(result);
  popModeStack();

  if (modeBeforePop === props.mode) {
    emit('change', result);
  }
}

function onChange(target: DateType): void {
  const { getMonth, getYear, setMonth, setYear } = calendar.value;

  switch (currentMode.value) {
    case 'month':
      handleModeChange(target, (value, reference) =>
        currentMode.value === props.mode
          ? value
          : setMonth(reference, getMonth(value)),
      );
      break;
    case 'year':
      handleModeChange(target, (value, reference) =>
        currentMode.value === props.mode
          ? value
          : setYear(reference, getYear(value)),
      );
      break;
    case 'day':
    case 'week':
    case 'quarter':
    case 'half-year':
    default:
      handleModeChange(target);
  }
}

/** Only the granularity currently on screen previews a hover. */
function hoverListeners(): Record<string, (date: DateType) => void> {
  const forMode: Record<CalendarMode, string> = {
    day: 'dateHover',
    week: 'weekHover',
    month: 'monthHover',
    year: 'yearHover',
    quarter: 'quarterHover',
    'half-year': 'halfYearHover',
  };

  return { [forMode[currentMode.value]]: (date) => emit('hover', date) };
}
</script>

<template>
  <MznInputTriggerPopper
    ref="popper"
    v-bind="popperProps"
    :anchor="anchor"
    :fade-props="fadeProps"
    :open="open"
  >
    <div @mouseleave="emit('leave')">
      <MznCalendar
        ref="calendarComponent"
        v-bind="calendarProps"
        :disable-on-double-next="disableOnDoubleNext"
        :disable-on-double-prev="disableOnDoublePrev"
        :disable-on-next="disableOnNext"
        :disable-on-prev="disableOnPrev"
        :disabled-month-switch="disabledMonthSwitch"
        :disabled-year-switch="disabledYearSwitch"
        :display-month-locale="displayMonthLocale"
        :is-date-disabled="isDateDisabled"
        :is-half-year-disabled="isHalfYearDisabled"
        :is-month-disabled="isMonthDisabled"
        :is-quarter-disabled="isQuarterDisabled"
        :is-week-disabled="isWeekDisabled"
        :is-year-disabled="isYearDisabled"
        :mode="currentMode"
        :reference-date="referenceDate"
        :value="value"
        @change="onChange"
        @double-next="onDoubleNext"
        @double-prev="onDoublePrev"
        @month-control-click="onMonthControlClick"
        @next="onNext"
        @prev="onPrev"
        @year-control-click="onYearControlClick"
        v-on="hoverListeners()"
      />
    </div>
  </MznInputTriggerPopper>
</template>
