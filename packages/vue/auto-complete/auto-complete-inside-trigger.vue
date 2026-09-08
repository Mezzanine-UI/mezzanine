<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import MznInput from '../input/input.vue';
import { resolveElement } from '../_internal/resolve-element';
import type { AutoCompleteInsideTriggerProps } from './auto-complete-inside-trigger.types';

/**
 * `inputPosition="inside"` 時 AutoComplete 的觸發器：一個純輸入框。
 *
 * 把 `resolvedInputProps` 裡的 `id`、`name`、`readOnly` 與 change 處理器提到
 * MznInput 自己的 prop 上，其餘原封不動交給底下的 input 元素。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAutoCompleteInsideTrigger } from '@mezzanine-ui/vue/auto-complete';
 * <\/script>
 *
 * <template>
 *   <MznAutoCompleteInsideTrigger :active="open" :resolved-input-props="inputProps" :value="text" />
 * </template>
 * ```
 *
 * @see MznAutoComplete 使用這個觸發器的元件
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AutoCompleteInsideTriggerProps>(), {
  placeholder: undefined,
  size: undefined,
});

const emit = defineEmits<{
  /** Input clear handler. */
  clear: [event: MouseEvent];
}>();

const attrs = useAttrs();

const input = ref<InstanceType<typeof MznInput> | null>(null);

/**
 * React composes the input ref it was handed with its own; the element is
 * exposed here so the AutoComplete can reach it the same way.
 */
defineExpose({
  input: computed((): HTMLElement | null =>
    resolveElement(input.value?.input ?? null),
  ),
});

const inputParts = computed(() => {
  const { id, name, onChange, readonly, ...rest } = props.resolvedInputProps;

  return { id, name, onChange, readonly, rest };
});

const interactiveProps = computed((): { disabled?: true } =>
  props.disabled ? { disabled: true } : {},
);
</script>

<template>
  <MznInput
    ref="input"
    v-bind="{ ...attrs, ...interactiveProps }"
    :active="active"
    :clearable="clearable"
    :error="error"
    full-width
    :force-show-clearable="clearable"
    :id="inputParts.id"
    :input-props="inputParts.rest"
    :name="inputParts.name"
    :placeholder="placeholder"
    :readonly="inputParts.readonly ? true : undefined"
    :size="size"
    :value="value"
    @change="inputParts.onChange?.($event)"
    @clear="emit('clear', $event)"
  />
</template>
