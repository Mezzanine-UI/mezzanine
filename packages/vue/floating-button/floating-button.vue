<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { floatingButtonClasses as classes } from '@mezzanine-ui/core/floating-button';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import type { FloatingButtonProps } from './floating-button.types';

/**
 * 浮動按鈕，固定在畫面角落，捲動時不隨內容移動。
 *
 * 外觀固定為 `base-primary`、`main` 尺寸，圖示模式的提示固定顯示在左側，
 * 因此不接受 `variant`、`size` 與 `tooltipPosition`。搭配 `autoHideWhenOpen`
 * 與 `open`，可在旁邊的面板或對話框開啟時把自己收起來。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFloatingButton } from '@mezzanine-ui/vue/floating-button';
 * import { PlusIcon } from '@mezzanine-ui/icons';
 * <\/script>
 *
 * <template>
 *   <MznFloatingButton :icon="PlusIcon" icon-type="leading">新增</MznFloatingButton>
 *   <MznFloatingButton auto-hide-when-open :open="open" @click="open = !open">
 *     開啟
 *   </MznFloatingButton>
 * </template>
 * ```
 *
 * @see MznButton 內部渲染的按鈕
 */
/**
 * React puts the consumer's `className` on the wrapper and spreads everything
 * else onto the Button. Vue's fallthrough would put all of it on the wrapper.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FloatingButtonProps>(), {
  autoHideWhenOpen: false,
  component: undefined,
  disabled: undefined,
  disabledTooltip: undefined,
  icon: undefined,
  iconType: undefined,
  loading: undefined,
  open: false,
});

defineSlots<{
  /** The button label, or the tooltip content when `iconType="icon-only"`. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);

const buttonClasses = computed((): string =>
  clsx(classes.button, {
    [classes.buttonHidden]: props.autoHideWhenOpen && props.open,
  }),
);
</script>

<template>
  <div :class="hostClasses">
    <MznButton
      v-bind="forwardedAttrs"
      :class="buttonClasses"
      :component="component"
      :disabled="disabled"
      :disabled-tooltip="disabledTooltip"
      :icon="icon"
      :icon-type="iconType"
      :loading="loading"
      size="main"
      tooltip-position="left"
      variant="base-primary"
    >
      <slot />
    </MznButton>
  </div>
</template>
