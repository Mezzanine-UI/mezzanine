<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import type { ThumbnailComponent, ThumbnailProps } from './thumbnail.types';

/**
 * MznFourThumbnailCard 的子項：包住一張圖片，滑鼠移上去時蓋一層寫著 `title`
 * 的遮罩。可渲染成 div、連結或按鈕。
 *
 * @example
 * ```vue
 * <MznThumbnail title="照片一">
 *   <img alt="照片一" src="/1.jpg" />
 * </MznThumbnail>
 * ```
 *
 * @see MznFourThumbnailCard 收納這些縮圖的卡片
 */
/**
 * React takes `component` out of the spread; Vue's fallthrough would leave it
 * on the element as an attribute.
 */
defineOptions({ inheritAttrs: false });

defineProps<ThumbnailProps>();

defineSlots<{
  /** The image element. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const component = computed(
  (): ThumbnailComponent => (attrs.component as ThumbnailComponent) ?? 'div',
);

const forwardedAttrs = computed(() => {
  const { class: _class, component: _component, ...rest } = attrs;

  return rest;
});

const hostClasses = computed((): string =>
  clsx(classes.fourThumbnailThumbnail, attrs.class as string),
);

const overlayClass = classes.fourThumbnailOverlay;
</script>

<template>
  <component :is="component" v-bind="forwardedAttrs" :class="hostClasses">
    <slot />
    <div :class="overlayClass">
      <span v-if="title">{{ title }}</span>
    </div>
  </component>
</template>
