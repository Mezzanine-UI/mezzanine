<script setup lang="ts">
import { computed, ref } from 'vue';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import MznTextField from '../text-field/text-field.vue';
import MznFormattedInput from './formatted-input.vue';
import type { PickerTriggerWithSeparatorProps } from './picker-trigger-with-separator.types';

/**
 * 以分隔線並排兩個遮罩輸入框的觸發元件，通常左邊是日期、右邊是時間。
 *
 * 兩邊各有自己的格式、驗證與錯誤訊息；任一邊填完會送出 `leftComplete` 或
 * `rightComplete`，供呼叫端自動把焦點移到下一個欄位。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznPickerTriggerWithSeparator } from '@mezzanine-ui/vue/picker';
 * <\/script>
 *
 * <template>
 *   <MznPickerTriggerWithSeparator
 *     format-left="YYYY-MM-DD"
 *     format-right="HH:mm:ss"
 *     :value-left="date"
 *     :value-right="time"
 *     @change-left="onChangeDate"
 *     @change-right="onChangeTime"
 *   />
 * </template>
 * ```
 *
 * @see MznPickerTrigger 單一輸入框的版本
 */
const props = withDefaults(defineProps<PickerTriggerWithSeparatorProps>(), {
  clearable: true,
  disabled: undefined,
  errorMessagesLeft: undefined,
  errorMessagesRight: undefined,
  hoverValueLeft: undefined,
  inputLeftProps: undefined,
  inputRightProps: undefined,
  placeholderLeft: undefined,
  placeholderRight: undefined,
  readOnly: undefined,
  required: undefined,
  validateLeft: undefined,
  validateRight: undefined,
  valueLeft: undefined,
  valueRight: undefined,
});

const emit = defineEmits<{
  blurLeft: [event: FocusEvent];
  blurRight: [event: FocusEvent];
  changeLeft: [value: string, rawDigits: string];
  changeRight: [value: string, rawDigits: string];
  clear: [event: MouseEvent];
  focusLeft: [event: FocusEvent];
  focusRight: [event: FocusEvent];
  leftComplete: [];
  pasteIsoValueLeft: [isoValue: string];
  pasteIsoValueRight: [isoValue: string];
  rightComplete: [];
}>();

defineSlots<{
  /** The trigger's suffix. */
  suffix?: () => unknown;
}>();

const leftInput = ref<InstanceType<typeof MznFormattedInput> | null>(null);
const rightInput = ref<InstanceType<typeof MznFormattedInput> | null>(null);

/**
 * React hands the inputs out through `inputLeftRef` / `inputRightRef` props;
 * Vue's equivalent is the parent placing a `ref` on this component, so the
 * elements are exposed.
 */
defineExpose({
  inputLeft: computed(
    (): HTMLInputElement | null => leftInput.value?.input ?? null,
  ),
  inputRight: computed(
    (): HTMLInputElement | null => rightInput.value?.input ?? null,
  ),
});

// TextField requires disabled and readonly to be mutually exclusive
const textFieldState = computed(() => {
  if (props.disabled) return { disabled: true as const };
  if (props.readOnly) return { readonly: true as const };

  return {};
});

/**
 * Handle left input change with auto-focus to right
 */
function handleLeftChange(formattedValue: string, rawDigits: string): void {
  emit('changeLeft', formattedValue, rawDigits);

  // If left value is complete, trigger callback and optionally focus right
  if (formattedValue) {
    emit('leftComplete');
  }
}

/**
 * Handle right input change
 */
function handleRightChange(formattedValue: string, rawDigits: string): void {
  emit('changeRight', formattedValue, rawDigits);

  if (formattedValue) {
    emit('rightComplete');
  }
}

const hostClass = classes.host;
const separatorClass = classes.separator;
const separatorInputClass = classes.separatorInput;
const separatorInputsClass = classes.separatorInputs;
</script>

<template>
  <MznTextField
    v-bind="textFieldState"
    :class="hostClass"
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
    <template v-if="$slots.suffix" #suffix><slot name="suffix" /></template>
    <div :class="separatorInputsClass">
      <div :class="separatorInputClass">
        <MznFormattedInput
          ref="leftInput"
          v-bind="inputLeftProps"
          aria-label="Date input"
          :aria-disabled="disabled"
          :aria-multiline="false"
          :aria-readonly="readOnly"
          :aria-required="required"
          :disabled="disabled"
          :error-messages="errorMessagesLeft"
          :format="formatLeft"
          :hover-value="hoverValueLeft"
          :placeholder="placeholderLeft"
          :read-only="readOnly"
          :required="required"
          :validate="validateLeft"
          :value="valueLeft"
          @blur="emit('blurLeft', $event)"
          @change="handleLeftChange"
          @focus="emit('focusLeft', $event)"
          @paste-iso-value="emit('pasteIsoValueLeft', $event)"
        />
      </div>
      <div :class="separatorClass" />
      <div :class="separatorInputClass">
        <MznFormattedInput
          ref="rightInput"
          v-bind="inputRightProps"
          aria-label="Time input"
          :aria-disabled="disabled"
          :aria-multiline="false"
          :aria-readonly="readOnly"
          :aria-required="required"
          :disabled="disabled"
          :error-messages="errorMessagesRight"
          :format="formatRight"
          :placeholder="placeholderRight"
          :read-only="readOnly"
          :required="required"
          :validate="validateRight"
          :value="valueRight"
          @blur="emit('blurRight', $event)"
          @change="handleRightChange"
          @focus="emit('focusRight', $event)"
          @paste-iso-value="emit('pasteIsoValueRight', $event)"
        />
      </div>
    </div>
  </MznTextField>
</template>
