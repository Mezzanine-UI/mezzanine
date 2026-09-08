<script setup lang="ts">
import { computed, h, ref, useAttrs } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { ClockIcon } from '@mezzanine-ui/icons';
import { resolveElement } from '../_internal/resolve-element';
import { useCalendarContext } from '../calendar/calendar-context';
import MznIcon from '../icon/icon.vue';
import MznRangePickerTrigger from '../picker/range-picker-trigger.vue';
import { usePickerDocumentEventClose } from '../picker/use-picker-document-event-close';
import MznTimePickerPanel from '../time-picker/time-picker-panel.vue';
import type { TimeRangePickerProps } from './time-range-picker.types';
import {
  useTimeRangePickerValue,
  type TimeRangePickerValue,
} from './use-time-range-picker-value';

/**
 * 時間區間選擇器：兩個時間輸入框共用一個時間面板。
 *
 * 面板錨定在目前聚焦的輸入框下方，聚焦時若該端還沒有值就先填入依步進取整的現在時間；
 * 面板上的調整要按 Ok 才會生效，取消、點擊外部或按時鐘圖示關閉都會還原。
 * 直接在輸入框打字則立即送出。必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTimeRangePicker } from '@mezzanine-ui/vue/time-range-picker';
 * <\/script>
 *
 * <template>
 *   <MznTimeRangePicker :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznTimePicker 單一時間選擇器
 * @see MznDateRangePicker 日期區間選擇器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimeRangePickerProps>(), {
  clearable: true,
  disabled: false,
  error: false,
  errorMessagesFrom: undefined,
  errorMessagesTo: undefined,
  fadeProps: undefined,
  format: undefined,
  fullWidth: false,
  hideHour: undefined,
  hideMinute: undefined,
  hideSecond: undefined,
  hourStep: undefined,
  inputFromPlaceholder: undefined,
  inputFromProps: undefined,
  inputToPlaceholder: undefined,
  inputToProps: undefined,
  minuteStep: undefined,
  popperProps: undefined,
  readOnly: undefined,
  required: false,
  secondStep: undefined,
  validateFrom: undefined,
  validateTo: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [target?: TimeRangePickerValue];
  panelToggle: [open: boolean];
}>();

defineSlots<{
  /** The trigger's prefix. */
  prefix?: () => unknown;
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

// Determine default format based on hideSecond
const resolvedFormat = computed(
  (): string =>
    props.format ??
    (props.hideSecond ? 'HH:mm' : calendar.value.defaultTimeFormat),
);

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

/** Panel open control */
const open = ref(false);

function onPanelToggle(nextOpen: boolean): void {
  if (props.readOnly) return;

  open.value = nextOpen;
  emit('panelToggle', nextOpen);
}

/** Values and onChange */
const trigger = ref<InstanceType<typeof MznRangePickerTrigger> | null>(null);
const panel = ref<InstanceType<typeof MznTimePickerPanel> | null>(null);
const inputFromRef = computed(
  (): HTMLInputElement | null => trigger.value?.inputFrom ?? null,
);
const inputToRef = computed(
  (): HTMLInputElement | null => trigger.value?.inputTo ?? null,
);
const anchorRef = computed((): HTMLElement | null =>
  resolveElement(trigger.value as ComponentPublicInstance | null),
);
const panelRef = computed(
  (): HTMLElement | null => panel.value?.element ?? null,
);

const {
  focusedInput,
  inputFromValue,
  inputToValue,
  onChange,
  onClear,
  onFromFocus,
  onInputFromChange,
  onInputToChange,
  onPanelChange,
  onPanelCancel,
  onPanelConfirm,
  onToFocus,
  panelValue,
  value: internalValue,
} = useTimeRangePickerValue({
  format: resolvedFormat,
  onChange: (value) => emit('change', value),
  value: () => props.value,
});

/** Dynamic anchor for panel - follows the focused input */
const panelAnchor = (): HTMLElement | null =>
  focusedInput.value === 'to' ? inputToRef.value : inputFromRef.value;

/** Input focus handlers — initialize panel to current value or current time */
function onFromFocusHandler(): void {
  onFromFocus();

  if (!internalValue.value[0]) {
    onPanelChange(computeCurrentTime());
  }

  onPanelToggle(true);
}

function onToFocusHandler(): void {
  onToFocus();

  if (!internalValue.value[1]) {
    onPanelChange(computeCurrentTime());
  }

  onPanelToggle(true);
}

/** Ok: commit pending value + close */
function onConfirm(): void {
  onPanelConfirm();
  onPanelToggle(false);
}

/** Cancel / click away: revert pending value + close */
function onCancel(): void {
  onPanelCancel();
  onChange(props.value);
  onPanelToggle(false);
}

/** Icon click handler */
function onIconClick(event: MouseEvent): void {
  event.stopPropagation();

  if (open.value) {
    onCancel();

    return;
  }

  onPanelToggle(true);
}

usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow: inputToRef,
  onChangeClose: onCancel,
  onClose: onCancel,
  open,
  popperRef: panelRef,
});

/** Suffix icon */
const suffixIcon = computed(() =>
  h(MznIcon, {
    'aria-label': 'Open time picker',
    icon: ClockIcon,
    onClick: props.readOnly ? undefined : onIconClick,
  }),
);
</script>

<template>
  <MznRangePickerTrigger
    ref="trigger"
    v-bind="attrs"
    :clearable="clearable"
    :disabled="disabled"
    :error="error"
    :error-messages-from="errorMessagesFrom"
    :error-messages-to="errorMessagesTo"
    :force-show-clearable="internalValue.some(Boolean)"
    :format="resolvedFormat"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="clearable"
    :input-from-placeholder="inputFromPlaceholder"
    :input-from-props="inputFromProps"
    :input-from-value="inputFromValue"
    :input-to-placeholder="inputToPlaceholder"
    :input-to-props="inputToProps"
    :input-to-value="inputToValue"
    :read-only="readOnly"
    :required="required"
    :size="size"
    :suffix-action-icon="suffixIcon"
    :validate-from="validateFrom"
    :validate-to="validateTo"
    @clear="onClear"
    @from-focus="onFromFocusHandler"
    @icon-click="onIconClick"
    @input-from-change="onInputFromChange"
    @input-to-change="onInputToChange"
    @to-focus="onToFocusHandler"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
  </MznRangePickerTrigger>
  <MznTimePickerPanel
    v-if="focusedInput"
    ref="panel"
    :anchor="panelAnchor"
    :fade-props="fadeProps"
    :hide-hour="hideHour"
    :hide-minute="hideMinute"
    :hide-second="hideSecond"
    :hour-step="hourStep"
    :minute-step="minuteStep"
    :open="open"
    :popper-props="popperProps"
    :second-step="secondStep"
    :value="panelValue"
    @cancel="onCancel"
    @change="onPanelChange"
    @confirm="onConfirm"
  />
</template>
