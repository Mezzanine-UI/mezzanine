<script setup lang="ts">
import { provide, ref } from 'vue';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { LAYOUT_CONTEXT } from './layout-context';
import type { LayoutHostProps } from './layout-host.types';

/**
 * 版面的最外層容器。
 *
 * 提供版面 context：主要區域會把自己的元素登記進來，側邊面板拖曳時靠它量出還
 * 能放大多少。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznLayoutHost } from '@mezzanine-ui/vue/layout';
 * <\/script>
 *
 * <template>
 *   <MznLayoutHost>...</MznLayoutHost>
 * </template>
 * ```
 *
 * @see MznLayout 依子元件種類排好順序的版面
 */
defineProps<LayoutHostProps>();

defineSlots<{
  /** Everything the layout arranges. */
  default?: () => unknown;
}>();

const host = ref<HTMLDivElement | null>(null);
const main = ref<HTMLDivElement | null>(null);

provide(LAYOUT_CONTEXT, {
  hostRef: host,
  mainRef: main,
  registerMain: (element: HTMLDivElement | null) => {
    main.value = element;
  },
});
</script>

<template>
  <div ref="host" :class="classes.host"><slot /></div>
</template>
