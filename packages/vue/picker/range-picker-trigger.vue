<script setup lang="ts">
import { computed, h, ref } from 'vue';
import type { FunctionalComponent, VNodeChild } from 'vue';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { CalendarIcon, LongTailArrowRightIcon } from '@mezzanine-ui/icons';
import MznIcon from '../icon/icon.vue';
import MznTextField from '../text-field/text-field.vue';
import MznFormattedInput from './formatted-input.vue';
import type { RangePickerTriggerProps } from './range-picker-trigger.types';

/**
 * 區間 picker 的觸發元件：兩個共用同一格式的遮罩輸入框，中間是箭頭圖示。
 *
 * 沒有提供 `suffix` slot 或 `suffixActionIcon` 時，後綴預設是日曆圖示，
 * 點擊會送出 `iconClick`。必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznRangePickerTrigger } from '@mezzanine-ui/vue/picker';
 * <\/script>
 *
 * <template>
 *   <MznRangePickerTrigger
 *     format="YYYY-MM-DD"
 *     :input-from-value="from"
 *     :input-to-value="to"
 *     @input-from-change="onFromChange"
 *     @input-to-change="onToChange"
 *   />
 * </template>
 * ```
 *
 * @see MznPickerTrigger 單一輸入框的版本
 */
const props = withDefaults(defineProps<RangePickerTriggerProps>(), {
  clearable: true,
  disabled: undefined,
  errorMessagesFrom: undefined,
  errorMessagesTo: undefined,
  hoverFromValue: undefined,
  hoverToValue: undefined,
  inputFromPlaceholder: undefined,
  inputFromProps: undefined,
  inputFromValue: undefined,
  inputToPlaceholder: undefined,
  inputToProps: undefined,
  inputToValue: undefined,
  readOnly: undefined,
  required: undefined,
  suffixActionIcon: undefined,
  validateFrom: undefined,
  validateTo: undefined,
});

const emit = defineEmits<{
  clear: [event: MouseEvent];
  fromBlur: [event: FocusEvent];
  fromFocus: [event: FocusEvent];
  iconClick: [event: MouseEvent];
  inputFromChange: [formatted: string, rawDigits: string];
  inputToChange: [formatted: string, rawDigits: string];
  toBlur: [event: FocusEvent];
  toFocus: [event: FocusEvent];
}>();

const slots = defineSlots<{
  /** The trigger's suffix. Defaults to a calendar icon. */
  suffix?: () => unknown;
}>();

const fromInput = ref<InstanceType<typeof MznFormattedInput> | null>(null);
const toInput = ref<InstanceType<typeof MznFormattedInput> | null>(null);

/**
 * React hands the inputs out through `inputFromRef` / `inputToRef` props;
 * Vue's equivalent is the parent placing a `ref` on this component, so the
 * elements are exposed.
 */
defineExpose({
  inputFrom: computed(
    (): HTMLInputElement | null => fromInput.value?.input ?? null,
  ),
  inputTo: computed(
    (): HTMLInputElement | null => toInput.value?.input ?? null,
  ),
});

const defaultSuffix = computed(
  (): VNodeChild =>
    props.suffixActionIcon ??
    h(MznIcon, {
      'aria-label': 'Open calendar',
      icon: CalendarIcon,
      onClick: (event: MouseEvent) => emit('iconClick', event),
    }),
);

const Suffix: FunctionalComponent = () =>
  slots.suffix ? slots.suffix() : defaultSuffix.value;

// TextField requires disabled and readonly to be mutually exclusive
const textFieldState = computed(() => {
  if (props.disabled) return { disabled: true as const };
  if (props.readOnly) return { readonly: true as const };

  return {};
});

const arrowIconClass = classes.arrowIcon;
const hostClasses = `${classes.host} ${classes.hostRange}`;
</script>

<template>
  <MznTextField
    v-bind="textFieldState"
    :class="hostClasses"
    :clearable="!readOnly && clearable"
    :error="error"
    :force-show-clearable="forceShowClearable"
    :full-width="fullWidth"
    :hide-suffix-when-clearable="hideSuffixWhenClearable"
    role="presentation"
    :size="size"
    :warning="warning"
    @clear="emit('clear', $event)"
  >
    <template #suffix><Suffix /></template>
    <MznFormattedInput
      ref="fromInput"
      v-bind="inputFromProps"
      aria-label="Start date"
      :aria-disabled="disabled"
      :aria-multiline="false"
      :aria-readonly="readOnly"
      :aria-required="required"
      :disabled="disabled"
      :error-messages="errorMessagesFrom"
      :format="format"
      :hover-value="hoverFromValue"
      :placeholder="inputFromPlaceholder"
      :read-only="readOnly"
      :required="required"
      :validate="validateFrom"
      :value="inputFromValue"
      @blur="emit('fromBlur', $event)"
      @change="
        (formatted, rawDigits) => emit('inputFromChange', formatted, rawDigits)
      "
      @focus="emit('fromFocus', $event)"
    />
    <MznIcon
      aria-hidden="true"
      :class="arrowIconClass"
      :icon="LongTailArrowRightIcon"
    />
    <MznFormattedInput
      ref="toInput"
      v-bind="inputToProps"
      aria-label="End date"
      :aria-disabled="disabled"
      :aria-multiline="false"
      :aria-readonly="readOnly"
      :aria-required="required"
      :disabled="disabled"
      :error-messages="errorMessagesTo"
      :format="format"
      :hover-value="hoverToValue"
      :placeholder="inputToPlaceholder"
      :read-only="readOnly"
      :required="required"
      :validate="validateTo"
      :value="inputToValue"
      @blur="emit('toBlur', $event)"
      @change="
        (formatted, rawDigits) => emit('inputToChange', formatted, rawDigits)
      "
      @focus="emit('toFocus', $event)"
    />
  </MznTextField>
</template>
