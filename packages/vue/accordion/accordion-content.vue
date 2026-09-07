<script setup lang="ts">
import { computed, inject } from 'vue';
import type { CSSProperties } from 'vue';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import MznCollapse from '../transition/collapse.vue';
import { ACCORDION_CONTROL_CONTEXT } from './accordion-control-context';
import type { AccordionContentProps } from './accordion-content.types';

/**
 * 手風琴展開後顯示的內容區。
 *
 * 展開狀態預設跟著所在的 MznAccordion 走，也可以用 `expanded` 自己指定。收合
 * 時整段內容不掛載，展開時以高度轉場帶出。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAccordion, MznAccordionContent, MznAccordionTitle } from '@mezzanine-ui/vue/accordion';
 * <\/script>
 *
 * <template>
 *   <MznAccordion>
 *     <MznAccordionTitle id="faq-1">運送政策</MznAccordionTitle>
 *     <MznAccordionContent>訂單成立後 1-3 個工作天內出貨。</MznAccordionContent>
 *   </MznAccordion>
 * </template>
 * ```
 *
 * @see MznAccordionTitle 點一下切換這一區的展開狀態
 */
const props = defineProps<AccordionContentProps>();

defineSlots<{
  /** The content the accordion reveals. */
  default?: () => unknown;
}>();

defineOptions({ inheritAttrs: false });

const control = inject(ACCORDION_CONTROL_CONTEXT, undefined);

const expanded = computed(
  (): boolean => props.expanded || Boolean(control?.value.expanded),
);

/**
 * The pair only means anything together: without a title id there is nothing
 * to label the region with, and nothing to point `aria-controls` at either.
 */
const ariaProps = computed((): Record<string, string> => {
  const summaryId = control?.value.titleId;
  const detailsId = control?.value.contentId;

  if (summaryId && detailsId) {
    return { 'aria-labelledby': summaryId, id: detailsId };
  }

  return {};
});

const collapseStyle: CSSProperties = { width: '100%' };
</script>

<template>
  <MznCollapse :in="expanded" :style="collapseStyle">
    <div
      v-bind="{ ...$attrs, ...ariaProps }"
      :class="classes.content"
      role="region"
    >
      <slot />
    </div>
  </MznCollapse>
</template>
