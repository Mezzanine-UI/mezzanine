<script setup lang="ts">
import { computed, useId } from 'vue';
import type { VNodeArrayChildren } from 'vue';
import { flattenChildren } from '../_internal/flatten-children';
import { assignCheckboxGroupValuesToEvent } from './assign-checkbox-group-values';
import MznCheckbox from './checkbox.vue';
import type {
  CheckboxGroupChangeEvent,
  CheckboxGroupOptionInput,
} from './checkbox-group.types';
import type { CheckAllProps } from './check-all.types';

/**
 * 包住一組 MznCheckboxGroup 的全選核取方塊。
 *
 * 勾選狀態依群組已選的「可用」選項數量決定：全不選是未勾、全選是已勾、其餘是中間態；
 * 全選或全不選時會保留已選的停用選項。群組本身由預設 slot 提供。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCheckAll, MznCheckboxGroup } from '@mezzanine-ui/vue/checkbox';
 * <\/script>
 *
 * <template>
 *   <MznCheckAll label="全選">
 *     <MznCheckboxGroup name="fruits" :options="options" :value="value" @change="onChange" />
 *   </MznCheckAll>
 * </template>
 * ```
 *
 * @see MznCheckboxGroup 被它控制的群組
 */
withDefaults(defineProps<CheckAllProps>(), {
  disabled: false,
  label: 'Check All',
});

const slots = defineSlots<{
  /** The checkbox group to control. */
  default?: () => unknown;
}>();

// Generate unique id for the check all checkbox
// This is important for accessibility
const checkAllId = useId();

/** React reads the group's props off the element it was handed; so does this. */
const groupProps = computed(
  (): {
    name?: string;
    onChange?: (event: CheckboxGroupChangeEvent) => void;
    options?: CheckboxGroupOptionInput[];
    value?: string[];
  } => {
    const child = flattenChildren(
      (slots.default?.() ?? []) as VNodeArrayChildren,
    )[0];

    return (child?.props ?? {}) as {
      name?: string;
      onChange?: (event: CheckboxGroupChangeEvent) => void;
      options?: CheckboxGroupOptionInput[];
      value?: string[];
    };
  },
);

const state = computed((): { checked: boolean; indeterminate: boolean } => {
  const options = groupProps.value.options ?? [];
  const value = groupProps.value.value ?? [];
  const enabledValues = options
    .filter((option) => !option.disabled)
    .map((option) => option.value);
  const selectedEnabledValues = value.filter((v) => enabledValues.includes(v));

  if (selectedEnabledValues.length === 0) {
    return { checked: false, indeterminate: false };
  }

  if (selectedEnabledValues.length === enabledValues.length) {
    return { checked: true, indeterminate: false };
  }

  return { checked: false, indeterminate: true };
});

function handleCheckAllChange(event: Event): void {
  const { name, onChange, options = [], value = [] } = groupProps.value;

  if (!onChange) return;

  const isChecked = (event.target as HTMLInputElement).checked;
  const enabledValues = options
    .filter((option) => !option.disabled)
    .map((option) => option.value);
  const disabledValues = options
    .filter((option) => option.disabled)
    .map((option) => option.value);
  const selectedDisabledValues = value.filter((v) =>
    disabledValues.includes(v),
  );
  const newValue = isChecked
    ? [...enabledValues, ...selectedDisabledValues]
    : selectedDisabledValues;

  onChange(assignCheckboxGroupValuesToEvent(event, newValue, name ?? ''));
}

const inputProps = computed(() => ({ id: checkAllId }));
</script>

<template>
  <div>
    <MznCheckbox
      :checked="state.checked"
      :disabled="disabled"
      :indeterminate="state.indeterminate"
      :input-props="inputProps"
      :label="label"
      :name="groupProps.name || checkAllId"
      @change="handleCheckAllChange"
    />
    <slot />
  </div>
</template>
