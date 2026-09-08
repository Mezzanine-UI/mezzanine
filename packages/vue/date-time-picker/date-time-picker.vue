<script setup lang="ts">
import { computed, h, ref, useAttrs, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { CalendarTimeIcon } from '@mezzanine-ui/icons';
import { resolveElement } from '../_internal/resolve-element';
import { useCalendarContext } from '../calendar/calendar-context';
import MznDatePickerCalendar from '../date-picker/date-picker-calendar.vue';
import MznIcon from '../icon/icon.vue';
import MznPickerTriggerWithSeparator from '../picker/picker-trigger-with-separator.vue';
import { usePickerDocumentEventClose } from '../picker/use-picker-document-event-close';
import MznTimePickerPanel from '../time-picker/time-picker-panel.vue';
import type {
  DateTimePickerFocusedInput,
  DateTimePickerProps,
} from './date-time-picker.types';

/**
 * 日期時間選擇器：左右兩個輸入框，各自帶自己的浮層。
 *
 * 聚焦左邊開日曆、右邊開時間面板；日期選完會自動跳到時間欄位，
 * 時間面板上的調整要按 Ok 才會生效，取消或點擊外部則捨棄。
 * 兩邊都有值時才送出 `change`，貼上完整的 ISO 值可以一次補上另一欄。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDateTimePicker } from '@mezzanine-ui/vue/date-time-picker';
 * <\/script>
 *
 * <template>
 *   <MznDateTimePicker :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznDatePicker 只有日期
 * @see MznTimePicker 只有時間
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DateTimePickerProps>(), {
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
  errorMessagesLeft: undefined,
  errorMessagesRight: undefined,
  fadeProps: undefined,
  formatDate: undefined,
  formatTime: undefined,
  fullWidth: false,
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
  mode: 'day',
  placeholderLeft: undefined,
  placeholderRight: undefined,
  popperProps: undefined,
  popperPropsTime: undefined,
  readOnly: undefined,
  referenceDate: undefined,
  required: false,
  secondStep: undefined,
  validateLeft: undefined,
  validateRight: undefined,
  value: undefined,
});

const emit = defineEmits<{
  cancel: [];
  change: [target?: DateType];
  clear: [event: MouseEvent];
  confirm: [];
  hover: [date: DateType];
  leave: [];
  panelToggle: [open: boolean, focusedInput: DateTimePickerFocusedInput];
}>();

defineSlots<{
  /** The trigger's prefix. */
  prefix?: () => unknown;
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const formatDate = computed(
  (): string => props.formatDate ?? calendar.value.defaultDateFormat,
);

const formatTime = computed(
  (): string =>
    props.formatTime ??
    (props.hideSecond ? 'HH:mm' : calendar.value.defaultTimeFormat),
);

// Internal state
const focusedInput = ref<DateTimePickerFocusedInput>(null);
const dateValue = ref<DateType | undefined>(props.defaultValue ?? props.value);
const timeValue = ref<DateType | undefined>(props.defaultValue ?? props.value);
const hoverDate = ref<DateType | undefined>(undefined);

// Pending time value: adjusted in the panel before user confirms
const pendingTimeValue = ref<DateType | undefined>(undefined);

// Compute rounded current time respecting step and hide settings
function computeCurrentTime(): DateType {
  const {
    getNow,
    getHour,
    getMinute,
    getSecond,
    setHour,
    setMinute,
    setSecond,
  } = calendar.value;
  const now = getNow();
  const h = getHour(now);
  const m = getMinute(now);
  const s = getSecond(now);

  let result = now;

  if (!props.hideHour) {
    result = setHour(
      result,
      Math.min(
        Math.round(h / (props.hourStep ?? 1)) * (props.hourStep ?? 1),
        23,
      ),
    );
  }

  if (!props.hideMinute) {
    result = setMinute(
      result,
      Math.min(
        Math.round(m / (props.minuteStep ?? 1)) * (props.minuteStep ?? 1),
        59,
      ),
    );
  }

  if (!props.hideSecond) {
    result = setSecond(
      result,
      Math.min(
        Math.round(s / (props.secondStep ?? 1)) * (props.secondStep ?? 1),
        59,
      ),
    );
  }

  return result;
}

// Elements
const trigger = ref<InstanceType<typeof MznPickerTriggerWithSeparator> | null>(
  null,
);
const calendarPanel = ref<InstanceType<typeof MznDatePickerCalendar> | null>(
  null,
);
const timePanel = ref<InstanceType<typeof MznTimePickerPanel> | null>(null);
const inputLeftRef = computed(
  (): HTMLInputElement | null => trigger.value?.inputLeft ?? null,
);
const inputRightRef = computed(
  (): HTMLInputElement | null => trigger.value?.inputRight ?? null,
);
const anchorRef = computed((): HTMLElement | null =>
  resolveElement(trigger.value as ComponentPublicInstance | null),
);
const calendarPanelRef = computed(
  (): HTMLElement | null => calendarPanel.value?.element ?? null,
);
const timePanelRef = computed(
  (): HTMLElement | null => timePanel.value?.element ?? null,
);

// Reference date for calendar
const referenceDate = ref<DateType>(
  calendar.value.startOf(
    props.referenceDate || props.defaultValue || calendar.value.getNow(),
    'day',
  ),
);

// Sync external value
watch(
  () => props.value,
  (value) => {
    if (value === undefined) return;

    dateValue.value = value;
    timeValue.value = value;

    if (value) {
      referenceDate.value = calendar.value.startOf(value, 'day');
    }
  },
);

// Open state based on focused input
const openCalendar = computed(
  (): boolean => focusedInput.value === 'left' && !props.readOnly,
);
const openTimePanel = computed(
  (): boolean => focusedInput.value === 'right' && !props.readOnly,
);

// Format values for display
const displayDateValue = computed((): string => {
  if (!dateValue.value) return '';

  return (
    calendar.value.formatToString(
      calendar.value.locale,
      dateValue.value,
      formatDate.value,
    ) || ''
  );
});

const displayTimeValue = computed((): string => {
  if (!timeValue.value) return '';

  return (
    calendar.value.formatToString(
      calendar.value.locale,
      timeValue.value,
      formatTime.value,
    ) || ''
  );
});

// Focus handlers
function onFocusLeft(): void {
  if (props.readOnly) return;

  focusedInput.value = 'left';
  emit('panelToggle', true, 'left');
}

function onFocusRight(): void {
  if (props.readOnly) return;

  focusedInput.value = 'right';
  pendingTimeValue.value = timeValue.value ?? computeCurrentTime();
  emit('panelToggle', true, 'right');
}

// Combine date and time into a single value
function combineDateTime(
  date: DateType | undefined,
  time: DateType | undefined,
): DateType | undefined {
  if (!date) return undefined;

  const {
    getNow,
    getHour,
    getMinute,
    getSecond,
    setHour,
    setMinute,
    setSecond,
  } = calendar.value;
  const timeSource = time || getNow();

  return setHour(
    setMinute(setSecond(date, getSecond(timeSource)), getMinute(timeSource)),
    getHour(timeSource),
  );
}

// Close handler
function onClose(): void {
  focusedInput.value = null;
  emit('panelToggle', false, null);
}

// Trigger change when both date and time are set
function notifyChange(
  date: DateType | undefined,
  time: DateType | undefined,
): void {
  if (date && time) {
    emit('change', combineDateTime(date, time));
  }
}

// Handle left complete
function onLeftComplete(): void {
  if (timeValue.value) {
    onClose();

    return;
  }

  setTimeout(() => {
    inputRightRef.value?.focus();
  }, 0);
}

// Handle right complete
function onRightComplete(): void {
  if (dateValue.value) {
    /** Don't close the time panel */
    setTimeout(() => {
      inputRightRef.value?.focus();
    }, 0);

    return;
  }

  setTimeout(() => {
    inputLeftRef.value?.focus();
  }, 0);
}

// Handle date change from input
function onChangeLeft(isoValue: string): void {
  if (!isoValue) {
    dateValue.value = undefined;

    return;
  }

  if (calendar.value.isValid(isoValue)) {
    dateValue.value = isoValue;
    referenceDate.value = calendar.value.startOf(isoValue, 'day');
    notifyChange(isoValue, timeValue.value);
  }
}

function onChangeRight(isoValue: string): void {
  if (!isoValue) {
    timeValue.value = undefined;

    return;
  }

  if (calendar.value.isValid(isoValue)) {
    timeValue.value = isoValue;
    notifyChange(dateValue.value, isoValue);
  }
}

function onPasteIsoValueLeft(isoValue: string): void {
  if (!timeValue.value && calendar.value.isValid(isoValue)) {
    // Time is empty, update it from pasted value
    timeValue.value = isoValue;
  }
}

function onPasteIsoValueRight(isoValue: string): void {
  if (!dateValue.value && calendar.value.isValid(isoValue)) {
    // Date is empty, update it from pasted value
    dateValue.value = isoValue;
    referenceDate.value = calendar.value.startOf(isoValue, 'day');
  }
}

function onCalendarChange(target: DateType): void {
  dateValue.value = target;
  referenceDate.value = calendar.value.startOf(target, 'day');
  notifyChange(target, timeValue.value);
  onLeftComplete();
}

// Handle time change from panel (pending only — not committed until confirm)
function onTimePanelChange(target?: DateType): void {
  if (target) pendingTimeValue.value = target;
}

// Confirm: commit pendingTimeValue and close time panel
function onTimeConfirm(): void {
  if (pendingTimeValue.value) {
    timeValue.value = pendingTimeValue.value;
    notifyChange(dateValue.value, pendingTimeValue.value);
  }

  pendingTimeValue.value = undefined;
  onClose();
}

// Cancel: discard pendingTimeValue and close time panel
function onTimeCancel(): void {
  pendingTimeValue.value = undefined;
  onClose();
}

// Document event close for calendar
usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: inputLeftRef,
  onChangeClose: onClose,
  onClose,
  open: openCalendar,
  popperRef: calendarPanelRef,
});

// Document event close for time panel — clicking away = cancel
usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: inputRightRef,
  onChangeClose: onTimeCancel,
  onClose: onTimeCancel,
  open: openTimePanel,
  popperRef: timePanelRef,
});

function onClear(event: MouseEvent): void {
  dateValue.value = undefined;
  timeValue.value = undefined;
  emit('change', undefined);
  emit('clear', event);
}

function onCalendarIconClick(): void {
  if (props.readOnly || props.disabled) return;

  if (focusedInput.value) {
    focusedInput.value = null;
    emit('panelToggle', false, null);

    return;
  }

  inputLeftRef.value?.focus();
}

const suffix = computed(() =>
  h(MznIcon, {
    'aria-label': 'Open calendar',
    icon: CalendarTimeIcon,
    onClick: onCalendarIconClick,
  }),
);

const hoverValueLeft = computed((): string | undefined =>
  openCalendar.value && !displayDateValue.value && hoverDate.value
    ? (calendar.value.formatToString(
        calendar.value.locale,
        hoverDate.value,
        formatDate.value,
      ) ?? undefined)
    : undefined,
);

const anchorGetter = (): HTMLElement | null => anchorRef.value;
const hostDatetimeClass = pickerClasses.hostDatetime;
const noop = (): void => {};
</script>

<template>
  <MznPickerTriggerWithSeparator
    ref="trigger"
    v-bind="attrs"
    :class="hostDatetimeClass"
    :clearable="clearable"
    :disabled="disabled"
    :error="error"
    :error-messages-left="errorMessagesLeft"
    :error-messages-right="errorMessagesRight"
    :force-show-clearable="!!(dateValue || timeValue)"
    :format-left="formatDate"
    :format-right="formatTime"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="clearable"
    :hover-value-left="hoverValueLeft"
    :input-left-props="inputLeftProps"
    :input-right-props="inputRightProps"
    :placeholder-left="placeholderLeft ?? formatDate"
    :placeholder-right="placeholderRight ?? formatTime"
    :read-only="readOnly"
    :required="required"
    :size="size"
    :validate-left="validateLeft"
    :validate-right="validateRight"
    :value-left="displayDateValue"
    :value-right="displayTimeValue"
    @blur-left="noop"
    @blur-right="noop"
    @change-left="onChangeLeft"
    @change-right="onChangeRight"
    @clear="onClear"
    @focus-left="onFocusLeft"
    @focus-right="onFocusRight"
    @left-complete="onLeftComplete"
    @paste-iso-value-left="onPasteIsoValueLeft"
    @paste-iso-value-right="onPasteIsoValueRight"
    @right-complete="onRightComplete"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template #suffix><component :is="suffix" /></template>
  </MznPickerTriggerWithSeparator>
  <MznDatePickerCalendar
    ref="calendarPanel"
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
    :open="openCalendar"
    :popper-props="popperProps"
    :reference-date="referenceDate"
    :value="dateValue"
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
  <MznTimePickerPanel
    ref="timePanel"
    :anchor="anchorGetter"
    :fade-props="fadeProps"
    :hide-hour="hideHour"
    :hide-minute="hideMinute"
    :hide-second="hideSecond"
    :hour-step="hourStep"
    :minute-step="minuteStep"
    :open="openTimePanel"
    :popper-props="popperPropsTime"
    :second-step="secondStep"
    :value="pendingTimeValue"
    @cancel="onTimeCancel"
    @change="onTimePanelChange"
    @confirm="onTimeConfirm"
  />
</template>
