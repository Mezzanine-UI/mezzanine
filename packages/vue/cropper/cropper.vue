<script setup lang="ts">
import { computed } from 'vue';
import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import clsx from 'clsx';
import type { CropperProps } from './cropper.types';

/**
 * 裁切器的外框元件，只負責套上裁切器的樣式與尺寸。
 *
 * 實際的畫布、拖曳與縮放都在 MznCropperElement；這個元件是給需要自行組合版面的
 * 使用端的容器，`component` 可切換成 span 以便放進行內文字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCropper, MznCropperElement } from '@mezzanine-ui/vue/cropper';
 * <\/script>
 *
 * <template>
 *   <MznCropper size="main">
 *     <MznCropperElement image-src="https://example.com/image.png" />
 *   </MznCropper>
 * </template>
 * ```
 *
 * @see MznCropperElement 實際負責裁切的畫布
 * @see MznCropperModal 以對話框包裝的裁切流程
 */
const props = withDefaults(defineProps<CropperProps>(), {
  aspectRatio: undefined,
  component: 'div',
  imageSrc: undefined,
  initialCropArea: undefined,
  minHeight: undefined,
  minWidth: undefined,
  onCropChange: undefined,
  onCropDragEnd: undefined,
  onImageDragEnd: undefined,
  onImageError: undefined,
  onImageLoad: undefined,
  onScaleChange: undefined,
  size: 'main',
});

defineSlots<{
  /** The cropper content. */
  default?: () => unknown;
}>();

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size)),
);
</script>

<template>
  <component :is="component" :class="hostClasses">
    <slot />
  </component>
</template>
