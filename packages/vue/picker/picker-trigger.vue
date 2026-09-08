<script setup lang="ts">
import { computed, ref } from 'vue';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import MznTextField from '../text-field/text-field.vue';
import MznFormattedInput from './formatted-input.vue';
import type { PickerTriggerProps } from './picker-trigger.types';

/**
 * Picker 的觸發元件：TextField 外框加上一個遮罩輸入框。
 *
 * `disabled` 與 `readOnly` 互斥，兩者都會關掉清除按鈕；後綴由 `suffix` slot 提供。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznPickerTrigger } from '@mezzanine-ui/vue/picker';
 * <\/script>
 *
 * <template>
 *   <MznPickerTrigger format="YYYY-MM-DD" :value="value" @change="onChange">
 *     <template #suffix><MznIcon :icon="CalendarIcon" /></template>
 *   </MznPickerTrigger>
 * </template>
 * ```
 *
 * @see MznRangePickerTrigger 兩個輸入框的區間版本
 * @see MznPickerTriggerWithSeparator 以分隔線並排兩個格式的版本
 */
const props = withDefaults(defineProps<PickerTriggerProps>(), {
  clearable: true,
  disabled: undefined,
  errorMessages: undefined,
  hoverValue: undefined,
  inputProps: undefined,
  placeholder: undefined,
  readOnly: undefined,
  required: undefined,
  validate: undefined,
  value: undefined,
});

const emit = defineEmits<{
  /**
   * React hands its consumers a synthetic `{ target: { value } }` only to
   * satisfy `ChangeEventHandler`; every one of them reads `target.value`, so
   * the formatted string is what is emitted here.
   */
  change: [value: string];
  clear: [event: MouseEvent];
}>();

defineSlots<{
  /** The trigger's suffix — usually the calendar icon. */
  suffix?: () => unknown;
}>();

const formattedInput = ref<InstanceType<typeof MznFormattedInput> | null>(null);

/**
 * React hands the input out through an `inputRef` prop; Vue's equivalent is
 * the parent placing a `ref` on this component, so the element is exposed.
 */
defineExpose({
  input: computed(
    (): HTMLInputElement | null => formattedInput.value?.input ?? null,
  ),
});

// TextField requires disabled and readonly to be mutually exclusive
const textFieldState = computed(() => {
  if (props.disabled) return { disabled: true as const };
  if (props.readOnly) return { readonly: true as const };

  return {};
});

const hostClass = classes.host;
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
    <MznFormattedInput
      ref="formattedInput"
      v-bind="inputProps"
      :aria-disabled="disabled"
      :aria-multiline="false"
      :aria-readonly="readOnly"
      :aria-required="required"
      :disabled="disabled"
      :error-messages="errorMessages"
      :format="format"
      :hover-value="hoverValue"
      :placeholder="placeholder"
      :read-only="readOnly"
      :required="required"
      :validate="validate"
      :value="value"
      @change="emit('change', $event)"
    />
  </MznTextField>
</template>
