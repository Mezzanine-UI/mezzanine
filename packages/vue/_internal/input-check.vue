<script setup lang="ts">
import { computed } from 'vue';
import type { VNode, VNodeArrayChildren } from 'vue';
import { inputCheckClasses as classes } from '@mezzanine-ui/core/_internal/input-check';
import clsx from 'clsx';
import { flattenChildren } from './flatten-children';
import type { InputCheckProps } from './input-check.types';

/**
 * 勾選類輸入元件的外框：一個 `label` 包住控制項與說明文字。
 *
 * 控制項由 `control` 傳入（React 是 ReactNode，這裡是 VNode），標籤文字走預設 slot；
 * 有標籤時才會渲染文字區塊，`hint` 只在有標籤時出現。
 *
 * @example
 * ```vue
 * <template>
 *   <MznInputCheck :control="h('input', { type: 'radio' })">選項</MznInputCheck>
 * </template>
 * ```
 *
 * @see MznRadio 使用這個外框的元件
 */
const props = withDefaults(defineProps<InputCheckProps>(), {
  control: undefined,
  disabled: undefined,
  error: undefined,
  focused: undefined,
  hint: undefined,
  segmentedStyle: false,
  size: 'main',
});

const slots = defineSlots<{
  /** The label of input check. */
  default?: () => VNode[];
}>();

/**
 * What the slot actually renders, not whether one was passed: Radio hands
 * `<slot v-if="type === 'radio'" />` down, and a `v-if` that is false still
 * leaves a comment placeholder behind. React sees `false` there and skips the
 * label — including its `--with-label` class.
 */
const hasLabel = computed((): boolean =>
  Boolean(
    flattenChildren(slots.default?.() as VNodeArrayChildren | undefined).length,
  ),
);

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size), {
    [classes.disabled]: props.disabled,
    [classes.error]: props.error,
    [classes.segmented]: props.segmentedStyle,
    [classes.withLabel]: hasLabel.value,
  }),
);

const controlClasses = computed((): string =>
  clsx(classes.control, {
    [classes.controlFocused]: props.focused,
    [classes.controlSegmented]: props.segmentedStyle,
  }),
);

const labelClass = classes.label;
const hintClass = classes.hint;
</script>

<template>
  <label :class="hostClasses">
    <span :class="controlClasses"><component :is="() => control" /></span>
    <span v-if="hasLabel" :class="labelClass">
      <slot />
      <span v-if="hint" :class="hintClass">{{ hint }}</span>
    </span>
  </label>
</template>
