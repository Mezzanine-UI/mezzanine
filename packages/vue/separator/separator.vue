<script setup lang="ts">
import { computed } from 'vue';
import { separatorClasses as classes } from '@mezzanine-ui/core/separator';
import clsx from 'clsx';
import type { SeparatorProps } from './separator.types';

/**
 * 水平或垂直分隔線元件。
 *
 * 以 `<hr>` 元素為基礎，透過 `orientation` prop 切換水平與垂直方向。
 * 垂直方向時會自動設置 `aria-orientation="vertical"` 以符合無障礙規範。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSeparator } from '@mezzanine-ui/vue/separator';
 * <\/script>
 *
 * <template>
 *   <!-- 水平分隔線（預設） -->
 *   <MznSeparator />
 *
 *   <!-- 垂直分隔線 -->
 *   <div style="display: flex; align-items: center">
 *     <span>左側內容</span>
 *     <MznSeparator orientation="vertical" />
 *     <span>右側內容</span>
 *   </div>
 * </template>
 * ```
 */
const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
});

const ariaOrientation = computed((): 'vertical' | undefined =>
  props.orientation === 'vertical' ? 'vertical' : undefined,
);

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.horizontal]: props.orientation === 'horizontal',
    [classes.vertical]: props.orientation === 'vertical',
  }),
);
</script>

<template>
  <hr :aria-orientation="ariaOrientation" :class="hostClasses" />
</template>
