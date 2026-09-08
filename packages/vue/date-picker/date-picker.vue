<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import {
  getDefaultModeFormat,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { resolveElement } from '../_internal/resolve-element';
import { useCalendarContext } from '../calendar/calendar-context';
import MznIcon from '../icon/icon.vue';
import MznPickerTrigger from '../picker/picker-trigger.vue';
import { usePickerDocumentEventClose } from '../picker/use-picker-document-event-close';
import { usePickerValue } from '../picker/use-picker-value';
import MznDatePickerCalendar from './date-picker-calendar.vue';
import type { DatePickerProps } from './date-picker.types';

/**
 * 日期選擇器，點擊輸入框或日曆圖示開啟日曆浮層。
 *
 * 支援 `day`、`week`、`month`、`quarter`、`half-year`、`year` 六種模式，
 * 可用 `isDateDisabled` 等 predicate 限制可選範圍；輸入框本身是遮罩輸入，
 * 不符合限制的輸入會在失焦時清掉。受控（`value`）與非受控（`defaultValue`）皆可。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDatePicker } from '@mezzanine-ui/vue/date-picker';
 * <\/script>
 *
 * <template>
 *   <MznDatePicker :value="value" @change="onChange" />
 *   <MznDatePicker mode="month" :is-month-disabled="isPast" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 日曆本體
 * @see MznTimePicker 時間選擇器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DatePickerProps>(), {
  calendarProps: undefined,
  clearable: true,
  defaultValue: undefined,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabled: false,
  disabledMonthSwitch: false,
  disabledYearSwitch: false,
  displayMonthLocale: undefined,
  error: false,
  errorMessages: undefined,
  fadeProps: undefined,
  format: undefined,
  fullWidth: false,
  hoverValue: undefined,
  inputProps: undefined,
  isDateDisabled: undefined,
  isHalfYearDisabled: undefined,
  isMonthDisabled: undefined,
  isQuarterDisabled: undefined,
  isWeekDisabled: undefined,
  isYearDisabled: undefined,
  mode: 'day',
  placeholder: undefined,
  popperProps: undefined,
  readOnly: undefined,
  referenceDate: undefined,
  required: false,
  validate: undefined,
  value: undefined,
});

const emit = defineEmits<{
  calendarToggle: [open: boolean];
  change: [target?: DateType];
  hover: [date: DateType];
  leave: [];
}>();

defineSlots<{
  /** The trigger's prefix. */
  prefix?: () => unknown;
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const format = computed(
  (): string => props.format || getDefaultModeFormat(props.mode),
);

/**
 * Validate date value against disabled constraints based on mode.
 * Returns true if valid, false if the date is disabled.
 */
function validateDate(isoDate: string): boolean {
  switch (props.mode) {
    case 'day':
      return !props.isDateDisabled?.(isoDate);
    case 'week':
      return !props.isWeekDisabled?.(isoDate);
    case 'month':
      return !props.isMonthDisabled?.(isoDate);
    case 'quarter':
      return !props.isQuarterDisabled?.(isoDate);
    case 'year':
      return !props.isYearDisabled?.(isoDate);
    case 'half-year':
      return !props.isHalfYearDisabled?.(isoDate);
    default:
      return true;
  }
}

/** Calender display control */
const open = ref(false);

function onCalendarToggle(currentOpen: boolean): void {
  if (props.readOnly) return;

  emit('calendarToggle', currentOpen);
  open.value = currentOpen;
}

function onFocus(): void {
  if (props.readOnly) return;

  onCalendarToggle(true);
}

/** Value and change handlers */
const trigger = ref<InstanceType<typeof MznPickerTrigger> | null>(null);
const pickerCalendar = ref<InstanceType<typeof MznDatePickerCalendar> | null>(
  null,
);
const inputRef = computed(
  (): HTMLInputElement | null => trigger.value?.input ?? null,
);
const anchorRef = computed((): HTMLElement | null =>
  resolveElement(trigger.value as ComponentPublicInstance | null),
);
const calendarRef = computed(
  (): HTMLElement | null => pickerCalendar.value?.element ?? null,
);

const {
  inputValue,
  onBlur,
  onChange,
  onInputChange,
  onKeydown,
  value: internalValue,
} = usePickerValue({
  defaultValue: props.defaultValue,
  format,
  inputRef,
  value: () => props.value,
});

/** Bind close control to handlers */
function onCalendarChange(val: DateType): void {
  onChange(val);
  emit('change', val);
  onCalendarToggle(false);
}

function onKeyDownWithCloseControl(event: KeyboardEvent): void {
  onKeydown(event);

  if (event.key === 'Enter' && !isImeComposing(event)) {
    emit('change', internalValue.value);
    onCalendarToggle(false);
  }
}

/** Hover preview value for calendar */
const hoverDate = ref<DateType | undefined>(undefined);

/** using internal reference date */
const referenceDate = ref<DateType>(
  props.referenceDate || props.defaultValue || calendar.value.getNow(),
);

watch(internalValue, (value) => {
  if (value) {
    referenceDate.value = value;
  }
});

/** Resolve input props */
const inputSize = computed(
  (): number | string => props.inputProps?.size ?? format.value.length + 2,
);

const resolvedInputProps = computed(() => ({
  ...props.inputProps,
  size: inputSize.value,
  onBlur,
  onFocus,
  onKeydown: onKeyDownWithCloseControl,
}));

/** Clear handler */
function onClear(): void {
  onChange(undefined);
  emit('change', undefined);
}

/** Blur, click away and key down close */
function onClose(): void {
  onChange(props.value);
  onCalendarToggle(false);
}

function onChangeClose(): void {
  emit('change', internalValue.value);
  onCalendarToggle(false);
}

usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: inputRef,
  onChangeClose,
  onClose,
  open,
  popperRef: calendarRef,
});

/** Icon */
function onIconClick(event: MouseEvent): void {
  event.stopPropagation();

  if (open.value) {
    onChange(props.value);
  }

  onCalendarToggle(!open.value);
}

function handleTriggerChange(value: string): void {
  onInputChange({ target: { value } } as unknown as Event);
  onCalendarChange(value);
  onCalendarToggle(true);
}

const hoverDisplayValue = computed((): string | undefined =>
  open.value && !inputValue.value && hoverDate.value
    ? (calendar.value.formatToString(
        calendar.value.locale,
        hoverDate.value,
        format.value,
      ) ?? undefined)
    : undefined,
);

const anchorGetter = (): HTMLElement | null => anchorRef.value;
const hostDateClass = pickerClasses.hostDate;
</script>

<template>
  <MznPickerTrigger
    ref="trigger"
    v-bind="attrs"
    :class="hostDateClass"
    :clearable="clearable"
    :disabled="disabled"
    :error="error"
    :error-messages="errorMessages"
    :force-show-clearable="!!internalValue"
    :format="format"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="clearable"
    :hover-value="hoverDisplayValue"
    :input-props="resolvedInputProps"
    :placeholder="placeholder"
    :read-only="readOnly"
    :required="required"
    :size="size"
    :validate="validateDate"
    :value="inputValue"
    :warning="warning"
    @change="handleTriggerChange"
    @clear="onClear"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template #suffix>
      <MznIcon
        aria-label="Open calendar"
        :icon="CalendarIcon"
        v-on="readOnly ? {} : { click: onIconClick }"
      />
    </template>
  </MznPickerTrigger>
  <MznDatePickerCalendar
    ref="pickerCalendar"
    :anchor="anchorGetter"
    :calendar-props="calendarProps"
    :disable-on-double-next="disableOnDoubleNext"
    :disable-on-double-prev="disableOnDoublePrev"
    :disable-on-next="disableOnNext"
    :disable-on-prev="disableOnPrev"
    :disabled-month-switch="disabledMonthSwitch"
    :disabled-year-switch="disabledYearSwitch"
    :display-month-locale="displayMonthLocale"
    :fade-props="fadeProps"
    :is-date-disabled="isDateDisabled"
    :is-half-year-disabled="isHalfYearDisabled"
    :is-month-disabled="isMonthDisabled"
    :is-quarter-disabled="isQuarterDisabled"
    :is-week-disabled="isWeekDisabled"
    :is-year-disabled="isYearDisabled"
    :mode="mode"
    :open="open"
    :popper-props="popperProps"
    :reference-date="referenceDate"
    :value="internalValue"
    @change="onCalendarChange"
    @hover="
      (date) => {
        hoverDate = date;
        emit('hover', date);
      }
    "
    @leave="
      () => {
        hoverDate = undefined;
        emit('leave');
      }
    "
  />
</template>
