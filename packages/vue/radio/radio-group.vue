<script setup lang="ts">
import { computed, provide } from 'vue';
import type { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import MznInputCheckGroup from '../_internal/input-check-group.vue';
import { useInputControlValue } from '../_internal/use-input-control-value';
import MznRadio from './radio.vue';
import { radioGroupKey } from './radio-group-context';
import type { RadioGroupContextValue } from './radio-group-context';
import type { RadioGroupProps } from './radio-group.types';

/**
 * 一組共用 name 與選取值的單選按鈕。
 *
 * 以 `options` 或預設 slot 提供內容，slot 優先；群組的 `disabled`、`name`、`size`
 * 與 `type` 會在子項目沒有自己設定時生效。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznRadioGroup } from '@mezzanine-ui/vue/radio';
 * <\/script>
 *
 * <template>
 *   <MznRadioGroup name="gender" :options="options" :value="value" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznRadio 群組內的單選按鈕
 */
const props = withDefaults(defineProps<RadioGroupProps>(), {
  defaultValue: undefined,
  disabled: undefined,
  name: undefined,
  options: () => [],
  orientation: undefined,
  segmentedStyle: undefined,
  size: undefined,
  type: undefined,
  value: undefined,
});

const emit = defineEmits<{
  /**
   * The onChange of radio group.
   * Will be passed to each radios but composing both instead of overriding.
   */
  change: [event: Event];
}>();

const slots = defineSlots<{
  /** The radios in radio group. */
  default?: () => unknown;
}>();

const { onChange, value } = useInputControlValue({
  defaultValue: () => props.defaultValue,
  onChange: (event) => emit('change', event),
  value: () => props.value,
});

provide(
  radioGroupKey,
  computed(
    (): RadioGroupContextValue => ({
      disabled: props.disabled,
      name: props.name,
      onChange,
      size: props.size as InputCheckSize | undefined,
      type: props.type,
      value: value.value,
    }),
  ),
);

const hasChildren = computed((): boolean => Boolean(slots.default));
</script>

<template>
  <MznInputCheckGroup
    :orientation="orientation"
    role="radiogroup"
    :segmented-style="type === 'segment'"
    :size="size"
  >
    <slot v-if="hasChildren" />
    <MznRadio
      v-for="option in options"
      v-else
      :key="option.id"
      :disabled="option.disabled"
      :error="option.error"
      :hint="option.hint"
      :value="option.id"
      :with-input-config="option.withInputConfig"
    >
      {{ option.name }}
    </MznRadio>
  </MznInputCheckGroup>
</template>
