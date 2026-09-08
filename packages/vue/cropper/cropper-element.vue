<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { CSSProperties, FunctionalComponent } from 'vue';
import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { toCssLength } from '../_internal/css-length';
import MznSlider from '../slider/slider.vue';
import MznTypography from '../typography/typography.vue';
import {
  DEFAULT_MIN_HEIGHT,
  DEFAULT_MIN_WIDTH,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_STEP,
  useCropperElement,
} from './use-cropper-element';
import type { CropperElementProps } from './cropper-element.types';

/**
 * 圖片裁切的畫布元件：載入圖片、畫出裁切框與遮罩，並提供縮放滑桿。
 *
 * 裁切框固定不動，按住畫布拖曳的是底下的圖片，滑鼠滾輪或下方滑桿則控制 1 到 2
 * 倍的縮放；`aspect-ratio` 決定裁切框的比例，沒給就填滿整個畫布。裁切框右下角
 * 會即時標出換算回原圖的像素尺寸，`crop-change` 回報的座標同樣是原圖的像素空間。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCropperElement } from '@mezzanine-ui/vue/cropper';
 * import type { CropArea } from '@mezzanine-ui/vue/cropper';
 *
 * function handleCropChange(area: CropArea): void {
 *   console.info(area);
 * }
 * <\/script>
 *
 * <template>
 *   <MznCropperElement
 *     :aspect-ratio="1"
 *     image-src="https://example.com/image.png"
 *     @crop-change="handleCropChange"
 *   />
 * </template>
 * ```
 *
 * @see MznCropper 只負責樣式的外框
 * @see MznCropperModal 以對話框包裝的裁切流程
 * @see useCropperElement 這個元件背後的 composable
 */
/**
 * React spreads its rest props onto the canvas, not onto the wrapper the
 * component is rooted at, so the fallthrough has to be placed by hand.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CropperElementProps>(), {
  aspectRatio: undefined,
  component: 'canvas',
  imageSrc: undefined,
  initialCropArea: undefined,
  minHeight: DEFAULT_MIN_HEIGHT,
  minWidth: DEFAULT_MIN_WIDTH,
  onCropChange: undefined,
  onCropDragEnd: undefined,
  onImageDragEnd: undefined,
  onImageError: undefined,
  onImageLoad: undefined,
  onScaleChange: undefined,
  size: 'main',
});

defineSlots<{
  /** The cropper content, rendered inside the canvas. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const {
  canvasRef,
  cropArea,
  cursorStyle,
  handleMouseDown,
  handleSliderChange,
  scale,
  setCanvas,
  setElement,
  tagCropArea,
  tagPosition,
} = useCropperElement({
  aspectRatio: () => props.aspectRatio,
  imageSrc: () => props.imageSrc,
  initialCropArea: () => props.initialCropArea,
  minHeight: () => props.minHeight,
  minWidth: () => props.minWidth,
  onCropChange: () => props.onCropChange,
  onCropDragEnd: () => props.onCropDragEnd,
  onImageDragEnd: () => props.onImageDragEnd,
  onImageError: () => props.onImageError,
  onImageLoad: () => props.onImageLoad,
  onScaleChange: () => props.onScaleChange,
});

/**
 * React forwards its ref to the canvas so a caller can hand the very element
 * that was drawn on to `cropToBlob`. Vue hands back the instance, so the canvas
 * is exposed on it.
 */
defineExpose({ canvas: canvasRef });

/**
 * React renders `{width} ×{' '}{height} px` as separate text nodes; a Vue
 * template merges the text and the interpolations into one, so the parts are
 * handed over as an array.
 */
const TagParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  tagProps,
) => tagProps.parts.map((part) => String(part));

/**
 * React binds its own handler after the rest props, so a consumer-supplied one
 * is replaced rather than merged. Vue's `mergeProps` would call both.
 */
const canvasAttrs = computed((): Record<string, unknown> => {
  const { onMousedown: _onMousedown, ...rest } = attrs as Record<
    string,
    unknown
  >;

  return rest;
});

const canvasClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size)),
);

const canvasStyle = computed(
  (): CSSProperties => ({ cursor: cursorStyle.value, width: '100%' }),
);

const tagStyle = computed((): CSSProperties | undefined =>
  tagPosition.value
    ? {
        left: toCssLength(tagPosition.value.left),
        top: toCssLength(tagPosition.value.top),
      }
    : undefined,
);

const tagParts = computed((): (number | string)[] => {
  const area = tagCropArea.value || cropArea.value;

  if (!area) return [];

  return [Math.round(area.width), ' ×', ' ', Math.round(area.height), ' px'];
});
</script>

<template>
  <div :ref="setElement" :class="classes.element">
    <component
      :is="component"
      :ref="setCanvas"
      :class="canvasClasses"
      :style="canvasStyle"
      v-bind="canvasAttrs"
      @mousedown="handleMouseDown"
    >
      <slot />
    </component>
    <MznTypography
      v-if="cropArea && tagPosition"
      :class="classes.tag"
      color="text-fixed-light"
      :style="tagStyle"
      variant="label-secondary"
    >
      <TagParts :parts="tagParts" />
    </MznTypography>
    <!-- Zoom Controls -->
    <div :class="classes.controls">
      <MznSlider
        :max="MAX_SCALE"
        :min="MIN_SCALE"
        :prefix-icon="MinusIcon"
        :step="SCALE_STEP"
        :suffix-icon="PlusIcon"
        :value="scale"
        @change="handleSliderChange($event as number)"
      />
    </div>
  </div>
</template>
