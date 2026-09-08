<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import {
  getDefaultModeFormat,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import type { RangePickerValue } from '@mezzanine-ui/core/picker';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { h } from 'vue';
import { resolveElement } from '../_internal/resolve-element';
import { useCalendarContext } from '../calendar/calendar-context';
import type { CalendarFooterActionsProps } from '../calendar/calendar-footer-actions.types';
import MznIcon from '../icon/icon.vue';
import MznRangePickerTrigger from '../picker/range-picker-trigger.vue';
import { usePickerDocumentEventClose } from '../picker/use-picker-document-event-close';
import MznDateRangePickerCalendar from './date-range-picker-calendar.vue';
import type { DateRangePickerProps } from './date-range-picker.types';
import { useDateRangePickerValue } from './use-date-range-picker-value';

/**
 * 日期區間選擇器：兩個輸入框加上並排的雙日曆浮層。
 *
 * `confirmMode` 決定何時送出 `change`：`immediate` 選滿兩端就送出並關閉浮層，
 * `manual` 則自動補上「Confirm／Cancel」兩顆按鈕，按下確認才送出。
 * 自行傳入 `actions` 時同樣不會自動關閉。輸入顛倒的兩端會自動對調。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDateRangePicker } from '@mezzanine-ui/vue/date-range-picker';
 * <\/script>
 *
 * <template>
 *   <MznDateRangePicker :value="value" @change="onChange" />
 *   <MznDateRangePicker confirm-mode="manual" :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznRangeCalendar 雙日曆本體
 * @see MznDatePicker 單一日期選擇器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  actions: undefined,
  calendarProps: undefined,
  clearable: true,
  confirmMode: 'immediate',
  defaultValue: undefined,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabled: false,
  disabledMonthSwitch: false,
  disabledYearSwitch: false,
  displayMonthLocale: undefined,
  displayWeekDayLocale: undefined,
  error: false,
  errorMessagesFrom: undefined,
  errorMessagesTo: undefined,
  fadeProps: undefined,
  format: undefined,
  fullWidth: false,
  inputFromPlaceholder: undefined,
  inputFromProps: undefined,
  inputToPlaceholder: undefined,
  inputToProps: undefined,
  isDateDisabled: undefined,
  isHalfYearDisabled: undefined,
  isMonthDisabled: undefined,
  isQuarterDisabled: undefined,
  isWeekDisabled: undefined,
  isYearDisabled: undefined,
  mode: 'day',
  popperProps: undefined,
  quickSelect: undefined,
  readOnly: undefined,
  referenceDate: undefined,
  renderAnnotations: undefined,
  required: false,
  validateFrom: undefined,
  validateTo: undefined,
  value: undefined,
});

const emit = defineEmits<{
  calendarToggle: [open: boolean];
  change: [target?: RangePickerValue];
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

function isBetweenRange(
  valueToCheck: DateType,
  t1: DateType,
  t2: DateType,
  granularity: string,
): boolean {
  const { isBetween } = calendar.value;

  return (
    isBetween(valueToCheck, t1, t2, granularity) ||
    isBetween(valueToCheck, t2, t1, granularity)
  );
}

/** Using internal reference date */
const referenceDate = ref<DateType>(
  props.referenceDate || props.defaultValue?.[0] || calendar.value.getNow(),
);

/** Calendar panel toggle */
const open = ref(false);

function onCalendarToggle(currentOpen: boolean): void {
  if (props.readOnly) return;

  open.value = currentOpen;
  emit('calendarToggle', currentOpen);
}

/** Values and onChange */
const trigger = ref<InstanceType<typeof MznRangePickerTrigger> | null>(null);
const pickerCalendar = ref<InstanceType<
  typeof MznDateRangePickerCalendar
> | null>(null);
const inputFromRef = computed(
  (): HTMLInputElement | null => trigger.value?.inputFrom ?? null,
);
const inputToRef = computed(
  (): HTMLInputElement | null => trigger.value?.inputTo ?? null,
);
const anchorRef = computed((): HTMLElement | null =>
  resolveElement(trigger.value as ComponentPublicInstance | null),
);
const calendarRef = computed(
  (): HTMLElement | null => pickerCalendar.value?.element ?? null,
);

// In manual mode, don't hand onChange to the composable - the confirm button does it
const shouldTriggerOnChangeImmediately = computed(
  (): boolean => props.confirmMode === 'immediate' && !props.actions,
);

const {
  calendarValue,
  committedCalendarValue,
  hoverValue,
  hoverFromValue,
  hoverToValue,
  inputFromValue,
  inputToValue,
  onCalendarChange,
  onCalendarHover,
  onChange,
  onClear,
  onFromBlur,
  onFromFocus,
  onHoverClear,
  onInputFromChange,
  onInputToChange,
  onToBlur,
  onToFocus,
  value: internalValue,
} = useDateRangePickerValue({
  format,
  inputFromRef,
  inputToRef,
  mode: () => props.mode,
  onChange: (value) => {
    if (!shouldTriggerOnChangeImmediately.value) return;

    emit('change', value);
  },
  value: () => props.value,
});

// Update reference date when internal value changes
watch(internalValue, ([from, to]) => {
  if (from) {
    referenceDate.value = from;
  } else if (to) {
    referenceDate.value = to;
  }
});

/** Bind calendar open control to handlers */
function onCalendarChangeWithCloseControl(
  val: [DateType, DateType | undefined],
): void {
  onCalendarChange(val);

  // Close panel when range is complete (only if auto-close is enabled)
  // Auto-close is disabled when actions are provided or in manual mode
  if (val[0] && val[1] && shouldTriggerOnChangeImmediately.value) {
    onCalendarToggle(false);
  }
}

/** Handle confirm action (for manual mode) */
function onConfirm(): void {
  const [from, to] = internalValue.value;

  if (from && to) {
    emit('change', [from, to]);
    // Sync internal state and reset isSelecting
    onChange([from, to]);
  }

  onCalendarToggle(false);
}

/** Handle cancel action (for manual mode) */
function onCancel(): void {
  onChange(props.value);
  onCalendarToggle(false);
}

/** Auto-generated actions for manual mode */
const actions = computed(
  (): CalendarFooterActionsProps['actions'] | undefined => {
    // In manual mode, auto-generate actions
    if (props.confirmMode === 'manual') {
      const [from, to] = internalValue.value;
      const isRangeComplete = Boolean(from && to);

      return {
        primaryButtonProps: {
          children: 'Confirm',
          disabled: !isRangeComplete,
          onClick: onConfirm,
          ...props.actions?.primaryButtonProps,
        },
        secondaryButtonProps: {
          children: 'Cancel',
          onClick: onCancel,
          ...props.actions?.secondaryButtonProps,
        },
      };
    }

    if (props.actions) {
      return props.actions;
    }

    return undefined;
  },
);

/**
 * Calendar cell in range checker.
 *
 * Pure geometry — whether the range covers a disabled unit is decided by
 * `MznRangeCalendar`, which is the only place that knows which cells are
 * actually on screen. Keeping that scan out of here is what makes this
 * component's render cost independent of how wide the range is.
 */
function getIsInRangeHandler(
  granularity: string,
): ((date: DateType) => boolean) | undefined {
  const [rangeAnchorStart, rangeAnchorEnd] = calendarValue.value || [];

  if (!rangeAnchorStart || !rangeAnchorEnd) {
    return undefined;
  }

  return (date: DateType) =>
    isBetweenRange(date, rangeAnchorStart, rangeAnchorEnd, granularity);
}

/** Input focus handlers */
function onFromFocusHandler(): void {
  onFromFocus();
  onCalendarToggle(true);
}

function onToFocusHandler(): void {
  onToFocus();
  onCalendarToggle(true);
}

/** Blur, click away and key down close */
function onClose(): void {
  onChange(props.value);
  onCalendarToggle(false);
}

function onChangeClose(): void {
  // In manual mode, always restore to value (don't auto-submit on click-away)
  if (props.confirmMode === 'manual') {
    onChange(props.value);
    onCalendarToggle(false);

    return;
  }

  const [from, to] = internalValue.value;

  if (from && to) {
    emit('change', [from, to]);
  } else {
    onChange(props.value);
  }

  onCalendarToggle(false);
}

usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: inputToRef,
  onChangeClose,
  onClose,
  open,
  popperRef: calendarRef,
});

/** Icon click handler */
function onIconClick(event: MouseEvent): void {
  event.stopPropagation();

  if (open.value) {
    onChange(props.value);
  }

  onCalendarToggle(!open.value);
}

const suffixActionIcon = computed(() =>
  h(MznIcon, { icon: CalendarIcon, onClick: onIconClick }),
);

const rangeWidthClass = computed((): string | undefined => {
  if (props.mode === 'year') return pickerClasses.hostRangeYear;

  return props.mode !== 'day' ? pickerClasses.hostRangeSlim : undefined;
});

const anchorGetter = (): HTMLElement | null => anchorRef.value;
</script>

<template>
  <MznRangePickerTrigger
    ref="trigger"
    v-bind="attrs"
    :class="rangeWidthClass"
    :clearable="clearable"
    :disabled="disabled"
    :error="error"
    :error-messages-from="errorMessagesFrom"
    :error-messages-to="errorMessagesTo"
    :force-show-clearable="!!(internalValue[0] || internalValue[1])"
    :format="format"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="clearable"
    :hover-from-value="open ? hoverFromValue : undefined"
    :hover-to-value="open ? hoverToValue : undefined"
    :input-from-placeholder="inputFromPlaceholder"
    :input-from-props="inputFromProps"
    :input-from-value="inputFromValue"
    :input-to-placeholder="inputToPlaceholder"
    :input-to-props="inputToProps"
    :input-to-value="inputToValue"
    :read-only="readOnly"
    :required="required"
    :size="size"
    :suffix-action-icon="suffixActionIcon"
    :validate-from="validateFrom"
    :validate-to="validateTo"
    @clear="onClear"
    @from-blur="onFromBlur"
    @from-focus="onFromFocusHandler"
    @input-from-change="onInputFromChange"
    @input-to-change="onInputToChange"
    @to-blur="onToBlur"
    @to-focus="onToFocusHandler"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
  </MznRangePickerTrigger>
  <MznDateRangePickerCalendar
    ref="pickerCalendar"
    :actions="actions"
    :anchor="anchorGetter"
    :calendar-props="calendarProps"
    :disable-on-double-next="disableOnDoubleNext"
    :disable-on-double-prev="disableOnDoublePrev"
    :disable-on-next="disableOnNext"
    :disable-on-prev="disableOnPrev"
    :disabled-month-switch="disabledMonthSwitch"
    :disabled-year-switch="disabledYearSwitch"
    :display-month-locale="displayMonthLocale"
    :display-week-day-locale="displayWeekDayLocale"
    :fade-props="fadeProps"
    :is-date-disabled="isDateDisabled"
    :is-date-in-range="getIsInRangeHandler('date')"
    :is-half-year-disabled="isHalfYearDisabled"
    :is-half-year-in-range="getIsInRangeHandler('half-year')"
    :is-month-disabled="isMonthDisabled"
    :is-month-in-range="getIsInRangeHandler('month')"
    :is-quarter-disabled="isQuarterDisabled"
    :is-quarter-in-range="getIsInRangeHandler('quarter')"
    :is-week-disabled="isWeekDisabled"
    :is-week-in-range="getIsInRangeHandler('week')"
    :is-year-disabled="isYearDisabled"
    :is-year-in-range="getIsInRangeHandler('year')"
    :mode="mode"
    :open="open"
    :popper-props="popperProps"
    :preview-value="hoverValue"
    :quick-select="quickSelect"
    :reference-date="referenceDate"
    :render-annotations="renderAnnotations"
    :value="committedCalendarValue"
    @change="onCalendarChangeWithCloseControl"
    @date-hover="onCalendarHover"
    @half-year-hover="onCalendarHover"
    @leave="onHoverClear"
    @month-hover="onCalendarHover"
    @quarter-hover="onCalendarHover"
    @week-hover="onCalendarHover"
    @year-hover="onCalendarHover"
  />
</template>
