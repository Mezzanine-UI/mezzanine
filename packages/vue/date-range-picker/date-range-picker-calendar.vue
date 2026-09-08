<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import MznInputTriggerPopper from '../_internal/input-trigger-popper.vue';
import MznRangeCalendar from '../calendar/range-calendar.vue';
import type { DateRangePickerCalendarProps } from './date-range-picker-calendar.types';

/**
 * 區間日期選擇器的日曆浮層。
 *
 * 只是把 MznRangeCalendar 包進 MznInputTriggerPopper，並在指標離開面板時送出
 * `leave`，供呼叫端清掉輸入框的 hover 預覽。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDateRangePickerCalendar } from '@mezzanine-ui/vue/date-range-picker';
 * <\/script>
 *
 * <template>
 *   <MznDateRangePickerCalendar
 *     :anchor="anchor"
 *     :open="open"
 *     :reference-date="referenceDate"
 *     :value="value"
 *     @change="onChange"
 *   />
 * </template>
 * ```
 *
 * @see MznDateRangePicker 使用這個浮層的元件
 */
withDefaults(defineProps<DateRangePickerCalendarProps>(), {
  actions: undefined,
  anchor: undefined,
  calendarProps: undefined,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabledMonthSwitch: undefined,
  disabledYearSwitch: undefined,
  displayMonthLocale: undefined,
  displayWeekDayLocale: undefined,
  fadeProps: undefined,
  isDateDisabled: undefined,
  isDateInRange: undefined,
  isHalfYearDisabled: undefined,
  isHalfYearInRange: undefined,
  isMonthDisabled: undefined,
  isMonthInRange: undefined,
  isQuarterDisabled: undefined,
  isQuarterInRange: undefined,
  isWeekDisabled: undefined,
  isWeekInRange: undefined,
  isYearDisabled: undefined,
  isYearInRange: undefined,
  mode: 'day',
  open: undefined,
  popperProps: undefined,
  previewValue: undefined,
  quickSelect: undefined,
  renderAnnotations: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [value: [DateType, DateType | undefined]];
  dateHover: [target: DateType];
  halfYearHover: [target: DateType];
  leave: [];
  monthHover: [target: DateType];
  quarterHover: [target: DateType];
  weekHover: [target: DateType];
  yearHover: [target: DateType];
}>();

const popper = ref<InstanceType<typeof MznInputTriggerPopper> | null>(null);
const rangeCalendar = ref<InstanceType<typeof MznRangeCalendar> | null>(null);

/**
 * React forwards refs to the popper and to each calendar; the same elements
 * are exposed here instead.
 */
defineExpose({
  element: computed((): HTMLElement | null => popper.value?.element ?? null),
  firstCalendar: computed(
    (): HTMLElement | null => rangeCalendar.value?.firstCalendar ?? null,
  ),
  secondCalendar: computed(
    (): HTMLElement | null => rangeCalendar.value?.secondCalendar ?? null,
  ),
});
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
      <MznRangeCalendar
        ref="rangeCalendar"
        :actions="actions"
        :calendar-props="calendarProps"
        :disable-on-double-next="disableOnDoubleNext"
        :disable-on-double-prev="disableOnDoublePrev"
        :disable-on-next="disableOnNext"
        :disable-on-prev="disableOnPrev"
        :disabled-month-switch="disabledMonthSwitch"
        :disabled-year-switch="disabledYearSwitch"
        :display-month-locale="displayMonthLocale"
        :display-week-day-locale="displayWeekDayLocale"
        :is-date-disabled="isDateDisabled"
        :is-date-in-range="isDateInRange"
        :is-half-year-disabled="isHalfYearDisabled"
        :is-half-year-in-range="isHalfYearInRange"
        :is-month-disabled="isMonthDisabled"
        :is-month-in-range="isMonthInRange"
        :is-quarter-disabled="isQuarterDisabled"
        :is-quarter-in-range="isQuarterInRange"
        :is-week-disabled="isWeekDisabled"
        :is-week-in-range="isWeekInRange"
        :is-year-disabled="isYearDisabled"
        :is-year-in-range="isYearInRange"
        :mode="mode"
        :preview-value="previewValue"
        :quick-select="quickSelect"
        :reference-date="referenceDate"
        :render-annotations="renderAnnotations"
        :value="value"
        @change="emit('change', $event)"
        @date-hover="emit('dateHover', $event)"
        @half-year-hover="emit('halfYearHover', $event)"
        @month-hover="emit('monthHover', $event)"
        @quarter-hover="emit('quarterHover', $event)"
        @week-hover="emit('weekHover', $event)"
        @year-hover="emit('yearHover', $event)"
      />
    </div>
  </MznInputTriggerPopper>
</template>
