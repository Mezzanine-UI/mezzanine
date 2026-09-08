<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import { ClockIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../calendar/calendar-context';
import MznIcon from '../icon/icon.vue';
import { resolveElement } from '../_internal/resolve-element';
import MznPickerTrigger from '../picker/picker-trigger.vue';
import { usePickerDocumentEventClose } from '../picker/use-picker-document-event-close';
import { usePickerValue } from '../picker/use-picker-value';
import MznTimePickerPanel from './time-picker-panel.vue';
import type { TimePickerProps } from './time-picker.types';

/**
 * 時間選擇器：遮罩輸入框加上時間面板浮層。
 *
 * 聚焦或點擊時鐘圖示會開啟面板，面板上的調整要按下 Ok 才會送出；
 * 按 Enter 等同確認，Escape、點擊外部或取消都會捨棄未確認的調整。
 * 有設步進時，不符合步進的輸入會在失焦時被清掉。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTimePicker } from '@mezzanine-ui/vue/time-picker';
 * <\/script>
 *
 * <template>
 *   <MznTimePicker :minute-step="5" :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznTimePanel 面板本身
 * @see MznCalendarConfigProvider 提供日期函式庫與語系
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimePickerProps>(), {
  clearable: true,
  defaultValue: undefined,
  disabled: false,
  error: false,
  errorMessages: undefined,
  fadeProps: undefined,
  format: undefined,
  fullWidth: false,
  hideHour: undefined,
  hideMinute: undefined,
  hideSecond: undefined,
  hourStep: undefined,
  hoverValue: undefined,
  inputProps: undefined,
  minuteStep: undefined,
  placeholder: undefined,
  popperProps: undefined,
  readOnly: undefined,
  required: false,
  secondStep: undefined,
  validate: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [target?: DateType];
  panelToggle: [open: boolean];
}>();

defineSlots<{
  /** The trigger's prefix. */
  prefix?: () => unknown;
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

/**
 * Validate if a time value matches the step constraint.
 */
function isValidStep(value: number, step: number): boolean {
  if (step <= 1) return true;

  return value % step === 0;
}

// Determine default format based on hideSecond
const resolvedFormat = computed(
  (): string =>
    props.format ??
    (props.hideSecond ? 'HH:mm' : calendar.value.defaultTimeFormat),
);

/**
 * Compute rounded current time respecting step and hide settings.
 * Mirrors the original onThisMoment logic from TimePanel.
 */
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

/**
 * Validate time value against step constraints.
 * Returns true if valid, false if the time doesn't match the step.
 */
function validateTimeStep(isoDate: string): boolean {
  const { getHour, getMinute, getSecond } = calendar.value;
  const hour = getHour(isoDate);
  const minute = getMinute(isoDate);
  const second = getSecond(isoDate);

  if (!props.hideHour && props.hourStep && !isValidStep(hour, props.hourStep)) {
    return false;
  }

  if (
    !props.hideMinute &&
    props.minuteStep &&
    !isValidStep(minute, props.minuteStep)
  ) {
    return false;
  }

  if (
    !props.hideSecond &&
    props.secondStep &&
    !isValidStep(second, props.secondStep)
  ) {
    return false;
  }

  return true;
}

/** Panel open control */
const open = ref(false);

function onPanelToggle(nextOpen: boolean): void {
  if (props.readOnly) return;

  open.value = nextOpen;
  emit('panelToggle', nextOpen);
}

/** Controlling input value and bind change handler */
const trigger = ref<InstanceType<typeof MznPickerTrigger> | null>(null);
const panel = ref<InstanceType<typeof MznTimePickerPanel> | null>(null);
const inputRef = computed(
  (): HTMLInputElement | null => trigger.value?.input ?? null,
);
const anchorRef = computed((): HTMLElement | null =>
  resolveElement(trigger.value as ComponentPublicInstance | null),
);
const panelRef = computed(
  (): HTMLElement | null => panel.value?.element ?? null,
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
  format: resolvedFormat,
  inputRef,
  value: () => props.value,
});

/**
 * Pending value: the time being adjusted in the panel before confirmation.
 * Not committed to internalValue until the user clicks Ok.
 */
const pendingValue = ref<DateType | undefined>(undefined);

/** Open panel and initialize pendingValue */
function openPanelWithInit(): void {
  pendingValue.value = internalValue.value ?? computeCurrentTime();
  onPanelToggle(true);
}

/** Panel column selection → update pending only, do not commit */
function onPanelChange(val?: DateType): void {
  if (val) pendingValue.value = val;
}

/** Ok: commit pendingValue → update input + notify parent → close */
function onConfirm(): void {
  if (pendingValue.value) {
    onChange(pendingValue.value);
    emit('change', pendingValue.value);
  }

  pendingValue.value = undefined;
  onPanelToggle(false);
}

/** Cancel / close: discard pendingValue → close without committing */
function onCancel(): void {
  pendingValue.value = undefined;
  onPanelToggle(false);
}

function onFocus(): void {
  if (props.readOnly) return;

  openPanelWithInit();
}

function onKeyDownWithCloseControl(event: KeyboardEvent): void {
  onKeydown(event);

  if (event.key === 'Enter' && !isImeComposing(event)) {
    onConfirm();
  }
}

/**
 * Vue derives an event name by hyphenating the handler key, so a React-style
 * `onKeyDown` would register for a `key-down` event that never fires. Vue's
 * own `InputHTMLAttributes` spells it `onKeydown`, and so does this.
 */
const resolvedInputProps = computed(() => ({
  ...props.inputProps,
  onBlur,
  onFocus,
  onKeydown: onKeyDownWithCloseControl,
}));

/** Clear handler */
function onClear(): void {
  onChange(undefined);
  emit('change', undefined);
}

/** Click away → cancel (do not commit) */
usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: inputRef,
  onChangeClose: onCancel,
  onClose: onCancel,
  open,
  popperRef: panelRef,
});

/** Icon */
function onIconClick(event: MouseEvent): void {
  event.stopPropagation();

  if (open.value) {
    onCancel();
  } else {
    openPanelWithInit();
  }
}

function handleTriggerChange(val: string): void {
  onInputChange({ target: { value: val } } as unknown as Event); // Update inputValue display
  onChange(val); // Commit to internalValue
  emit('change', val); // Notify parent immediately
  onPanelChange(val); // Keep panel pendingValue in sync
}

const hoverValue = computed((): string | undefined =>
  open.value && !inputValue.value && pendingValue.value
    ? (calendar.value.formatToString(
        calendar.value.locale,
        pendingValue.value,
        resolvedFormat.value,
      ) ?? undefined)
    : undefined,
);

const anchorGetter = (): HTMLElement | null => anchorRef.value;
</script>

<template>
  <MznPickerTrigger
    ref="trigger"
    v-bind="attrs"
    :clearable="clearable"
    :disabled="disabled"
    :error="error"
    :error-messages="errorMessages"
    :force-show-clearable="!!internalValue"
    :format="resolvedFormat"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="clearable"
    :hover-value="hoverValue"
    :input-props="resolvedInputProps"
    :placeholder="placeholder"
    :read-only="readOnly"
    :required="required"
    :size="size"
    :validate="validateTimeStep"
    :value="inputValue"
    :warning="warning"
    @change="handleTriggerChange"
    @clear="onClear"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template #suffix>
      <MznIcon
        aria-label="Open time picker"
        :icon="ClockIcon"
        v-on="readOnly ? {} : { click: onIconClick }"
      />
    </template>
  </MznPickerTrigger>
  <MznTimePickerPanel
    ref="panel"
    :anchor="anchorGetter"
    :fade-props="fadeProps"
    :hide-hour="hideHour"
    :hide-minute="hideMinute"
    :hide-second="hideSecond"
    :hour-step="hourStep"
    :minute-step="minuteStep"
    :open="open"
    :popper-props="popperProps"
    :second-step="secondStep"
    :value="pendingValue"
    @cancel="onCancel"
    @change="onPanelChange"
    @confirm="onConfirm"
  />
</template>
