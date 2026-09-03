<script setup lang="ts">
import { computed } from 'vue';
import { skeletonClasses as classes } from '@mezzanine-ui/core/skeleton';
import clsx from 'clsx';
import { toCssLength } from '../_internal/css-length';
import type { SkeletonProps } from './skeleton.types';

/**
 * 載入中的骨架佔位元件。
 *
 * 有三種形態：帶 `variant` 時為文字條（高度依語意排版類型計算），
 * 帶 `circle` 時為圓形，其餘為方塊。`width` 與 `height` 可傳數字（視為 px）或 CSS 字串。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSkeleton } from '@mezzanine-ui/vue/skeleton';
 * <\/script>
 *
 * <template>
 *   <MznSkeleton variant="body" />
 *   <MznSkeleton circle :width="48" />
 *   <MznSkeleton :width="120" :height="120" />
 * </template>
 * ```
 */
const props = defineProps<SkeletonProps>();

/**
 * The strip form only applies when neither an explicit height nor `circle`
 * is given, matching React's branch condition.
 */
const stripVariant = computed(() =>
  !props.height && !props.circle && props.variant ? props.variant : undefined,
);

const hostClasses = computed((): string => {
  const variant = stripVariant.value;

  return variant
    ? clsx(classes.host, classes.type(variant))
    : clsx(classes.host, classes.bg, props.circle && classes.circle);
});

const hostStyle = computed(() =>
  stripVariant.value
    ? { width: toCssLength(props.width) }
    : {
        height: toCssLength(props.height),
        width: toCssLength(props.width),
      },
);

const backgroundClass = classes.bg;
</script>

<template>
  <div :class="hostClasses" :style="hostStyle">
    <span v-if="stripVariant" :class="backgroundClass" />
  </div>
</template>
