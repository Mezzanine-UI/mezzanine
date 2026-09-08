<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { inputSpinnerButtonClasses as classes } from '@mezzanine-ui/core/input';
import { CaretDownFlatIcon, CaretUpFlatIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type { SpinnerButtonProps } from './spinner-button.types';

/**
 * 數值輸入框的上下微調按鈕。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznInputSpinnerButton } from '@mezzanine-ui/vue/input';
 * <\/script>
 *
 * <template>
 *   <MznInputSpinnerButton type="up" @click="increase" />
 * </template>
 * ```
 *
 * @see MznInput `variant="measure"` 且 `showSpinner` 時會渲染這兩顆按鈕
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SpinnerButtonProps>(), {
  disabled: undefined,
  size: 'main',
});

const attrs = useAttrs();

const label = computed((): string =>
  props.type === 'up' ? 'Increase value' : 'Decrease value',
);

const icon = computed(() =>
  props.type === 'up' ? CaretUpFlatIcon : CaretDownFlatIcon,
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    props.disabled && classes.disabled,
    props.size === 'main' ? classes.main : classes.sub,
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});
</script>

<template>
  <button
    :aria-label="label"
    :class="hostClasses"
    :disabled="disabled"
    :title="label"
    type="button"
    v-bind="forwardedAttrs"
  >
    <MznIcon aria-hidden="true" :icon="icon" />
  </button>
</template>
