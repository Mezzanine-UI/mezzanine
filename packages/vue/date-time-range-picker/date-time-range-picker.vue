<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { dateTimeRangePickerClasses as classes } from '@mezzanine-ui/core/date-time-range-picker';
import {
  LongTailArrowDownIcon,
  LongTailArrowRightIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznDateTimePicker from '../date-time-picker/date-time-picker.vue';
import type { DateTimePickerFocusedInput } from '../date-time-picker/date-time-picker.types';
import MznIcon from '../icon/icon.vue';
import type {
  DateTimeRangePickerProps,
  DateTimeRangePickerValue,
} from './date-time-range-picker.types';

/**
 * 日期時間區間選擇器：兩個 MznDateTimePicker 中間夾一個箭頭。
 *
 * `direction` 決定橫排或直排，箭頭跟著換向；其餘設定兩邊共用，
 * 任一端變動都會送出完整的 `[from, to]`。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDateTimeRangePicker } from '@mezzanine-ui/vue/date-time-range-picker';
 * <\/script>
 *
 * <template>
 *   <MznDateTimeRangePicker :value="value" @change="onChange" />
 *   <MznDateTimeRangePicker direction="column" :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznDateTimePicker 單一日期時間選擇器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DateTimeRangePickerProps>(), {
  calendarProps: undefined,
  clearable: undefined,
  direction: 'row',
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabled: undefined,
  disabledMonthSwitch: undefined,
  disabledYearSwitch: undefined,
  displayMonthLocale: undefined,
  error: undefined,
  errorMessagesLeft: undefined,
  errorMessagesRight: undefined,
  fadeProps: undefined,
  formatDate: undefined,
  formatTime: undefined,
  fullWidth: undefined,
  hideHour: undefined,
  hideMinute: undefined,
  hideSecond: undefined,
  hourStep: undefined,
  hoverValueLeft: undefined,
  inputLeftProps: undefined,
  inputRightProps: undefined,
  isDateDisabled: undefined,
  isHalfYearDisabled: undefined,
  isMonthDisabled: undefined,
  isQuarterDisabled: undefined,
  isWeekDisabled: undefined,
  isYearDisabled: undefined,
  minuteStep: undefined,
  mode: undefined,
  placeholderLeft: undefined,
  placeholderRight: undefined,
  popperProps: undefined,
  popperPropsTime: undefined,
  readOnly: undefined,
  referenceDate: undefined,
  required: undefined,
  secondStep: undefined,
  validateLeft: undefined,
  validateRight: undefined,
  value: undefined,
});

const emit = defineEmits<{
  cancel: [];
  change: [value: DateTimeRangePickerValue];
  clear: [event: MouseEvent];
  confirm: [];
  hover: [date: DateType];
  leave: [];
  panelToggle: [open: boolean, focusedInput: DateTimePickerFocusedInput];
}>();

const attrs = useAttrs();

const fromValue = computed((): DateType | undefined => props.value?.[0]);
const toValue = computed((): DateType | undefined => props.value?.[1]);

// Handler for "from" DateTimePicker change
function handleFromChange(newFrom?: DateType): void {
  emit('change', [newFrom, toValue.value]);
}

// Handler for "to" DateTimePicker change
function handleToChange(newTo?: DateType): void {
  emit('change', [fromValue.value, newTo]);
}

/** Everything both pickers share, exactly as React spreads it. */
const sharedProps = computed(() => ({
  calendarProps: props.calendarProps,
  clearable: props.clearable,
  disabled: props.disabled,
  disabledMonthSwitch: props.disabledMonthSwitch,
  disabledYearSwitch: props.disabledYearSwitch,
  disableOnDoubleNext: props.disableOnDoubleNext,
  disableOnDoublePrev: props.disableOnDoublePrev,
  disableOnNext: props.disableOnNext,
  disableOnPrev: props.disableOnPrev,
  displayMonthLocale: props.displayMonthLocale,
  error: props.error,
  fadeProps: props.fadeProps,
  formatDate: props.formatDate,
  formatTime: props.formatTime,
  fullWidth: props.fullWidth,
  hideHour: props.hideHour,
  hideMinute: props.hideMinute,
  hideSecond: props.hideSecond,
  hourStep: props.hourStep,
  isDateDisabled: props.isDateDisabled,
  isHalfYearDisabled: props.isHalfYearDisabled,
  isMonthDisabled: props.isMonthDisabled,
  isQuarterDisabled: props.isQuarterDisabled,
  isWeekDisabled: props.isWeekDisabled,
  isYearDisabled: props.isYearDisabled,
  minuteStep: props.minuteStep,
  mode: props.mode,
  onCancel: () => emit('cancel'),
  onClear: (event: MouseEvent) => emit('clear', event),
  onConfirm: () => emit('confirm'),
  onHover: (date: DateType) => emit('hover', date),
  onLeave: () => emit('leave'),
  onPanelToggle: (open: boolean, focusedInput: DateTimePickerFocusedInput) =>
    emit('panelToggle', open, focusedInput),
  placeholderLeft: props.placeholderLeft,
  placeholderRight: props.placeholderRight,
  popperProps: props.popperProps,
  popperPropsTime: props.popperPropsTime,
  readOnly: props.readOnly,
  referenceDate: props.referenceDate,
  required: props.required,
  secondStep: props.secondStep,
  size: props.size,
}));

const arrowIcon = computed(() =>
  props.direction === 'column' ? LongTailArrowDownIcon : LongTailArrowRightIcon,
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    props.direction === 'column' ? classes.column : classes.row,
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const arrowClass = classes.arrow;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <MznDateTimePicker
      v-bind="sharedProps"
      :value="fromValue"
      @change="handleFromChange"
    />
    <MznIcon :class="arrowClass" :icon="arrowIcon" />
    <MznDateTimePicker
      v-bind="sharedProps"
      :value="toValue"
      @change="handleToChange"
    />
  </div>
</template>
