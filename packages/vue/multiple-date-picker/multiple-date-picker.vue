<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import {
  calendarClasses,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { multipleDatePickerClasses as classes } from '@mezzanine-ui/core/multiple-date-picker';
import type { MultipleDatePickerValue } from '@mezzanine-ui/core/multiple-date-picker';
import { CalendarIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { resolveElement } from '../_internal/resolve-element';
import MznInputTriggerPopper from '../_internal/input-trigger-popper.vue';
import MznCalendarFooterActions from '../calendar/calendar-footer-actions.vue';
import type { CalendarFooterActionsProps } from '../calendar/calendar-footer-actions.types';
import MznCalendar from '../calendar/calendar.vue';
import { useCalendarContext } from '../calendar/calendar-context';
import { useCalendarControls } from '../calendar/use-calendar-controls';
import MznIcon from '../icon/icon.vue';
import { usePickerDocumentEventClose } from '../picker/use-picker-document-event-close';
import MznMultipleDatePickerTrigger from './multiple-date-picker-trigger.vue';
import type { DateValue } from './multiple-date-picker-trigger.types';
import { useMultipleDatePickerValue } from './use-multiple-date-picker-value';
import type { MultipleDatePickerProps } from './multiple-date-picker.types';

/**
 * 多日期選擇器：從日曆挑選多個日期，以標籤呈現，按下確認才送出。
 *
 * 選取先寫進內部狀態，按確認才發出 `change`；取消、點擊外部或按 Escape 都會
 * 還原。`maxSelections` 達到上限後，未選取的日期會被停用。
 * 與其他日曆相關元件一樣，必須包在 MznCalendarConfigProvider 裡。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznMultipleDatePicker } from '@mezzanine-ui/vue/multiple-date-picker';
 * <\/script>
 *
 * <template>
 *   <MznMultipleDatePicker :value="dates" @change="dates = $event" />
 *   <MznMultipleDatePicker :max-selections="3" :value="dates" @change="dates = $event" />
 * </template>
 * ```
 *
 * @see MznDatePicker 單一日期的版本
 * @see useMultipleDatePickerValue 只要待確認選取邏輯時的 composable
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MultipleDatePickerProps>(), {
  actions: undefined,
  calendarProps: undefined,
  clearable: true,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabled: false,
  disabledMonthSwitch: false,
  disabledYearSwitch: false,
  displayMonthLocale: undefined,
  error: false,
  format: undefined,
  fullWidth: false,
  isDateDisabled: undefined,
  maxSelections: undefined,
  overflowStrategy: 'counter',
  placeholder: undefined,
  popperProps: undefined,
  readOnly: false,
  referenceDate: undefined,
  required: undefined,
  size: 'main',
  value: () => [],
});

const emit = defineEmits<{
  calendarToggle: [open: boolean];
  change: [value: MultipleDatePickerValue];
}>();

defineSlots<{
  /** The trigger's prefix. */
  prefix?: () => unknown;
}>();

const calendar = useCalendarContext();

const format = computed(
  (): string => props.format || getDefaultModeFormat('day'),
);

const displayMonthLocale = computed(
  (): string | undefined => props.displayMonthLocale ?? calendar.value.locale,
);

/** Calendar open state */
const open = ref(false);
const preventOpen = computed((): boolean => props.readOnly || props.disabled);

function onCalendarToggle(currentOpen: boolean): void {
  if (preventOpen.value) return;

  open.value = currentOpen;
  emit('calendarToggle', currentOpen);
}

/** Value management */
const {
  clearAll,
  formatDate,
  getConfirmValue,
  internalValue,
  isDateSelected,
  isMaxReached,
  removeDate,
  revertToValue,
  toggleDate,
} = useMultipleDatePickerValue({
  format: () => format.value,
  maxSelections: () => props.maxSelections,
  value: () => props.value,
});

/** Manage referenceDate internally for a stable value */
const internalReferenceDate = ref<DateType>(
  props.referenceDate || calendar.value.getNow(),
);

watch(
  () => props.referenceDate,
  (value) => {
    if (value) internalReferenceDate.value = value;
  },
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
} = useCalendarControls(internalReferenceDate, 'day');

/** Convert the internal value to the shape the trigger displays */
const triggerValues = computed((): DateValue[] =>
  internalValue.value.map((date) => ({
    date,
    id: formatDate(date),
    name: formatDate(date),
  })),
);

/** Handle calendar date click — toggle selection (only in day mode) */
function onCalendarDateChange(date: DateType): void {
  if (currentMode.value === 'day') {
    toggleDate(date);

    return;
  }

  // Handle month/year mode switching
  updateReferenceDate(date);
  popModeStack();
}

function onConfirm(): void {
  emit('change', getConfirmValue());
  onCalendarToggle(false);
}

function onCancel(): void {
  revertToValue();
  onCalendarToggle(false);
}

function onClear(event: MouseEvent): void {
  event.stopPropagation();

  clearAll();
  emit('change', []);
}

/** Auto-generate actions */
const actions = computed((): CalendarFooterActionsProps['actions'] => {
  const hasValue = internalValue.value.length > 0;

  return {
    primaryButtonProps: {
      children: 'Confirm',
      disabled: !hasValue,
      onClick: onConfirm,
      ...props.actions?.primaryButtonProps,
    },
    secondaryButtonProps: {
      children: 'Cancel',
      onClick: onCancel,
      ...props.actions?.secondaryButtonProps,
    },
  };
});

/** Disable unselected dates once the maximum is reached */
function isDateDisabled(date: DateType): boolean {
  if (props.isDateDisabled?.(date)) return true;

  return isMaxReached.value && !isDateSelected(date);
}

/** Refs for popper positioning */
const trigger = ref<ComponentPublicInstance | null>(null);
const popper = ref<ComponentPublicInstance | null>(null);
const anchorRef = computed((): HTMLElement | null =>
  resolveElement(trigger.value),
);
const calendarRef = computed((): HTMLElement | null =>
  resolveElement(popper.value),
);

function onClose(): void {
  revertToValue();
  onCalendarToggle(false);
}

/** In manual mode, always revert on click-away (don't auto-submit) */
const dummyRef = ref<HTMLElement | null>(null);

usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: dummyRef,
  onChangeClose: onClose,
  onClose,
  open,
  popperRef: calendarRef,
});

function onIconClick(event: MouseEvent): void {
  event.stopPropagation();

  if (open.value) revertToValue();

  onCalendarToggle(!open.value);
}

function onTriggerClick(): void {
  if (!preventOpen.value && !open.value) onCalendarToggle(true);
}

/**
 * Bound as an object rather than with `@click`, because React leaves the
 * handler off entirely while disabled or read-only — and an icon with a click
 * listener draws a pointer cursor.
 */
const suffixIconBindings = computed(() => ({
  'aria-label': 'Open calendar',
  icon: CalendarIcon,
  onClick: props.readOnly || props.disabled ? undefined : onIconClick,
}));

const restCalendarProps = computed(() => {
  const { class: _class, ...rest } = (props.calendarProps ?? {}) as Record<
    string,
    unknown
  >;

  return rest;
});

const calendarClassName = computed((): string =>
  clsx(
    calendarClasses.noShadowHost,
    (props.calendarProps as { class?: string } | undefined)?.class,
  ),
);

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.hostFullWidth]: props.fullWidth,
  }),
);

const calendarHostClass = calendarClasses.host;
const mainWithFooterClass = calendarClasses.mainWithFooter;
</script>

<template>
  <MznMultipleDatePickerTrigger
    ref="trigger"
    :active="open"
    :class="hostClasses"
    :clearable="clearable"
    :disabled="disabled"
    :error="error"
    :full-width="fullWidth"
    :overflow-strategy="overflowStrategy"
    :placeholder="placeholder"
    :read-only="readOnly"
    :required="required"
    :size="size"
    :value="triggerValues"
    @click="onTriggerClick"
    @clear="onClear"
    @tag-close="removeDate"
  >
    <!--
      Only forwarded when the consumer actually gave one: an always-present
      slot makes the text field believe it has a prefix, which changes its gap
      and renders an empty prefix element.
    -->
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template #suffix>
      <MznIcon v-bind="suffixIconBindings" />
    </template>
  </MznMultipleDatePickerTrigger>
  <MznInputTriggerPopper
    ref="popper"
    v-bind="popperProps"
    :anchor="anchorRef"
    :open="open"
  >
    <div :class="calendarHostClass">
      <div :class="mainWithFooterClass">
        <MznCalendar
          v-bind="restCalendarProps"
          :class="calendarClassName"
          disabled-footer-control
          :disabled-month-switch="disabledMonthSwitch"
          :disable-on-double-next="disableOnDoubleNext"
          :disable-on-double-prev="disableOnDoublePrev"
          :disable-on-next="disableOnNext"
          :disable-on-prev="disableOnPrev"
          :disabled-year-switch="disabledYearSwitch"
          :display-month-locale="displayMonthLocale"
          :is-date-disabled="isDateDisabled"
          :mode="currentMode"
          :reference-date="referenceDate"
          :value="internalValue"
          @change="onCalendarDateChange"
          @double-next="onDoubleNext"
          @double-prev="onDoublePrev"
          @month-control-click="onMonthControlClick"
          @next="onNext"
          @prev="onPrev"
          @year-control-click="onYearControlClick"
        />
        <MznCalendarFooterActions :actions="actions" />
      </div>
    </div>
  </MznInputTriggerPopper>
</template>
