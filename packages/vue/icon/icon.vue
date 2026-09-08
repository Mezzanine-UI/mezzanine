<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { iconClasses as classes, toIconCssVars } from '@mezzanine-ui/core/icon';
import clsx from 'clsx';
import type { IconProps } from './icon.types';

/**
 * 渲染來自 `@mezzanine-ui/icons` 的 SVG 圖示元件。
 *
 * 透過 `icon` prop 傳入圖示定義物件，支援調整顏色、尺寸與旋轉動畫。
 * 當元件綁定 `@click` 或 `@mouseover` 事件時，游標樣式會自動切換為 pointer。
 * 可透過 `title` prop 提供無障礙標題文字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznIcon } from '@mezzanine-ui/vue/icon';
 * import { SearchIcon, LoadingIcon, CheckedFilledIcon } from '@mezzanine-ui/icons';
 * <\/script>
 *
 * <template>
 *   <!-- 基本用法 -->
 *   <MznIcon :icon="SearchIcon" />
 *
 *   <!-- 自訂顏色與尺寸 -->
 *   <MznIcon :icon="CheckedFilledIcon" color="success" :size="24" />
 *
 *   <!-- 旋轉動畫（常用於載入狀態） -->
 *   <MznIcon :icon="LoadingIcon" spin />
 *
 *   <!-- 加入無障礙標題 -->
 *   <MznIcon :icon="SearchIcon" title="搜尋" />
 * </template>
 * ```
 */
const props = withDefaults(defineProps<IconProps>(), {
  spin: false,
});

/**
 * React derives the pointer cursor from the presence of `onClick` /
 * `onMouseOver` props rather than exposing a flag. Vue puts the same
 * listeners in `$attrs`, so the behaviour is mirrored exactly — no extra
 * `clickable` input is invented.
 */
const attrs = useAttrs();

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.color]: props.color,
    [classes.spin]: props.spin,
    [classes.size]: props.size,
  }),
);

const hostStyles = computed(
  (): Record<string, string> => ({
    '--mzn-icon-cursor':
      attrs.onClick || attrs.onMouseover || attrs.onMouseOver
        ? 'pointer'
        : 'inherit',
    ...(toIconCssVars({ color: props.color, size: props.size }) as Record<
      string,
      string
    >),
  }),
);

const svgAttrs = computed(() => props.icon.definition.svg ?? {});

/**
 * SVG presentation attributes are hyphenated and case-sensitive. React's JSX
 * transform rewrites `fillRule` → `fill-rule`; Vue's `v-bind` passes keys to
 * `setAttribute` verbatim, so the mapping has to be explicit here or the
 * attributes are silently ignored by the browser.
 */
const pathAttrs = computed(() => {
  const path = props.icon.definition.path ?? {};

  return {
    'clip-rule': path.clipRule,
    d: path.d,
    fill: path.fill,
    'fill-rule': path.fillRule,
    stroke: path.stroke,
    'stroke-linecap': path.strokeLinecap,
    'stroke-linejoin': path.strokeLinejoin,
    'stroke-width': path.strokeWidth,
    transform: path.transform,
  };
});

const titleText = computed(
  (): string | undefined => props.title || props.icon.definition.title,
);
</script>

<template>
  <i :class="hostClasses" :data-icon-name="icon.name" :style="hostStyles">
    <svg :fill="svgAttrs.fill" :viewBox="svgAttrs.viewBox" focusable="false">
      <title v-if="titleText">{{ titleText }}</title>
      <path v-bind="pathAttrs" />
    </svg>
  </i>
</template>
