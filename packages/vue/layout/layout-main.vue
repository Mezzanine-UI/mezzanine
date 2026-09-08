<script setup lang="ts">
import { inject } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { LAYOUT_CONTEXT } from './layout-context';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import type { LayoutMainProps } from './layout-main.types';

/**
 * 版面的主要內容區，會填滿剩下的空間並自己捲動。
 *
 * 掛載時把自己登記進版面 context，側邊面板拖曳時要靠它的寬度算上限。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznLayoutMain } from '@mezzanine-ui/vue/layout';
 * <\/script>
 *
 * <template>
 *   <MznLayoutMain><h1>Main Content</h1></MznLayoutMain>
 * </template>
 * ```
 *
 * @see MznLayout 承載主要區域的版面
 */
withDefaults(defineProps<LayoutMainProps>(), {
  scrollbarProps: () => ({}),
});

defineSlots<{
  /** The page's own content. */
  default?: () => unknown;
}>();

const context = inject(LAYOUT_CONTEXT, undefined);

/** A template unwraps a ref bound with `:ref`, so it is registered by hand. */
function setMain(element: Element | ComponentPublicInstance | null): void {
  context?.registerMain((element as HTMLDivElement | null) ?? null);
}
</script>

<template>
  <div :ref="setMain" :class="classes.main">
    <MznScrollbar v-bind="scrollbarProps">
      <div :class="classes.mainContent"><slot /></div>
    </MznScrollbar>
  </div>
</template>
