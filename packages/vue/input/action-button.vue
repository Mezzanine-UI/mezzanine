<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { inputActionButtonClasses as classes } from '@mezzanine-ui/core/input';
import { CopyIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type { ActionButtonProps } from './action-button.types';

/**
 * 貼在輸入框旁邊的動作按鈕，預設是複製。
 *
 * `label` 同時作為按鈕文字與 `title`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznInputActionButton } from '@mezzanine-ui/vue/input';
 * <\/script>
 *
 * <template>
 *   <MznInputActionButton label="複製" @click="copy" />
 * </template>
 * ```
 *
 * @see MznInput `variant="action"` 會渲染這顆按鈕
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ActionButtonProps>(), {
  disabled: undefined,
  icon: () => CopyIcon,
  label: 'Copy',
  size: 'main',
});

const attrs = useAttrs();

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

const iconClass = classes.icon;
const textClass = classes.text;
</script>

<template>
  <button
    :class="hostClasses"
    :disabled="disabled"
    :title="label"
    type="button"
    v-bind="forwardedAttrs"
  >
    <MznIcon :class="iconClass" :icon="icon" :size="16" />
    <span :class="textClass">{{ label }}</span>
  </button>
</template>
