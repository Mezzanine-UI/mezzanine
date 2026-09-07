<script setup lang="ts">
import { computed } from 'vue';
import { inputCheckGroupClasses as classes } from '@mezzanine-ui/core/_internal/input-check';
import clsx from 'clsx';
import type { InputCheckGroupProps } from './input-check-group.types';

/**
 * 一組勾選類輸入元件的容器，負責排列方向與尺寸。
 *
 * @example
 * ```vue
 * <template>
 *   <MznInputCheckGroup orientation="vertical"><MznRadio /></MznInputCheckGroup>
 * </template>
 * ```
 *
 * @see MznRadioGroup 使用這個容器的元件
 */
const props = withDefaults(defineProps<InputCheckGroupProps>(), {
  orientation: 'horizontal',
  segmentedStyle: false,
  size: 'main',
});

defineSlots<{
  /** The input check elements in group. */
  default?: () => unknown;
}>();

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.orientation(props.orientation),
    classes.size(props.size),
    { [classes.segmented]: props.segmentedStyle },
  ),
);
</script>

<template>
  <div :aria-orientation="orientation" :class="hostClasses"><slot /></div>
</template>
