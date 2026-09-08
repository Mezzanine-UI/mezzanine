<script setup lang="ts">
import { computed, h, inject, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznIcon from '../icon/icon.vue';
import MznRotate from '../transition/rotate.vue';
import MznAccordionActions from './accordion-actions.vue';
import { ACCORDION_CONTROL_CONTEXT } from './accordion-control-context';
import type { AccordionTitleProps } from './accordion-title.types';

/**
 * 手風琴的標題列，點一下切換展開狀態。
 *
 * 標題文字與右側操作是分開的：預設 slot 裡的 MznAccordionActions 會被挑出來放
 * 到右側，其餘內容留在可點擊的按鈕裡。也可以改用 `actions` 設定物件描述右側。
 * 所在的 MznAccordion 為 disabled 時，按鈕跟著停用。
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
 * @see MznAccordionActions 右側的操作按鈕區
 */
const props = defineProps<AccordionTitleProps>();

defineSlots<{
  /** The title text, and optionally an actions area. */
  default?: () => unknown;
}>();

const slots = useSlots();

const control = inject(ACCORDION_CONTROL_CONTEXT, undefined);

const disabled = computed((): boolean | undefined => control?.value.disabled);
const expanded = computed((): boolean | undefined => control?.value.expanded);

function onToggle(event: MouseEvent | KeyboardEvent): void {
  event.stopPropagation();

  if (control && !disabled.value) {
    control.value.toggleExpanded(!expanded.value);
  }
}

const ariaProps = computed((): Record<string, unknown> => {
  const result: Record<string, unknown> = { 'aria-expanded': expanded.value };
  const contentId = control?.value.contentId;

  if (contentId) {
    result['aria-controls'] = contentId;
  }

  return result;
});

/** The actions written as a child are pulled out of the clickable part. */
const resolved = computed((): { actions: VNode[]; mainPart: VNode[] } => {
  const actions: VNode[] = [];
  const mainPart: VNode[] = [];

  flattenChildren(slots.default?.(), { keepText: true }).forEach((child) => {
    if (child.type === MznAccordionActions) actions.push(child);
    else mainPart.push(child);
  });

  return { actions, mainPart };
});

const hostClasses = computed((): string =>
  clsx(classes.title, {
    [classes.titleExpanded]: expanded.value,
    [classes.titleDisabled]: disabled.value,
  }),
);

const iconClasses = computed((): string =>
  clsx(
    classes.titleIcon,
    { [classes.titleIconDisabled]: disabled.value },
    props.iconClassName,
  ),
);

const MainPart: FunctionalComponent = () => resolved.value.mainPart;
const ChildActions: FunctionalComponent = () => resolved.value.actions;

/**
 * Built with `h` so the config object reaches the actions area as props, the
 * way React spreads it.
 */
const SuffixActions: FunctionalComponent = () =>
  h(MznAccordionActions, props.actions);
</script>

<template>
  <div :class="hostClasses">
    <button
      v-bind="ariaProps"
      :class="classes.titleMainPart"
      :disabled="disabled"
      type="button"
      @click="onToggle"
    >
      <MznRotate :degrees="-90" :in="expanded">
        <MznIcon :class="iconClasses" :icon="ChevronRightIcon" :size="16" />
      </MznRotate>

      <MainPart />
    </button>
    <SuffixActions v-if="actions" />
    <ChildActions v-else />
  </div>
</template>
