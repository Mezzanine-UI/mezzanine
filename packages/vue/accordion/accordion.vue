<script setup lang="ts">
import { computed, h, provide, ref, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import { useHasListener } from '../_internal/use-has-listener';
import MznFade from '../transition/fade.vue';
import MznAccordionContent from './accordion-content.vue';
import MznAccordionTitle from './accordion-title.vue';
import { ACCORDION_CONTROL_CONTEXT } from './accordion-control-context';
import type { AccordionProps } from './accordion.types';

/**
 * 手風琴元件，提供可展開／收合的內容區塊。
 *
 * 標題可以用 `title` 直接給文字，或放一個 MznAccordionTitle 自己排版；內容放在
 * MznAccordionContent 裡，沒有包的子項會自動被收進去。給了 `expanded` 就是受控
 * 模式，內部狀態不再變動，開合都由 `change` 通知。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAccordion } from '@mezzanine-ui/vue/accordion';
 * <\/script>
 *
 * <template>
 *   <MznAccordion title="常見問題">這裡是問題的詳細說明內容。</MznAccordion>
 * </template>
 * ```
 *
 * @see MznAccordionGroup 管理多個手風琴的群組元件
 */
const props = withDefaults(defineProps<AccordionProps>(), {
  actions: undefined,
  defaultExpanded: false,
  disabled: false,
  expanded: undefined,
  size: 'main',
  title: undefined,
});

const emit = defineEmits<{
  /** Fired when the expand/collapse state is changed. */
  change: [expanded: boolean];
}>();

defineSlots<{
  /**
   * The title and the content. A MznAccordionTitle becomes the title and a
   * MznAccordionContent the content; anything else becomes content too.
   */
  default?: () => unknown;
}>();

const slots = useSlots();
const hasListener = useHasListener();

const internalExpanded = ref(props.defaultExpanded);

/**
 * A consumer that listens takes over the state entirely: React swaps its own
 * setter out for the callback rather than calling both.
 */
function onToggleExpanded(newStatus: boolean): void {
  if (hasListener('change')) emit('change', newStatus);
  else internalExpanded.value = newStatus;
}

const expanded = computed(
  (): boolean => props.expanded ?? internalExpanded.value,
);

/**
 * The title and the content are picked out of the slot by which component they
 * are; whatever is left over is content that was written without a wrapper, so
 * it gets one.
 */
const resolved = computed(
  (): { content: VNode | null; title: VNode | null } => {
    let title: VNode | null = null;
    let content: VNode | null = null;
    const restContentChildren: VNode[] = [];

    flattenChildren(slots.default?.(), { keepText: true }).forEach((child) => {
      if (child.type === MznAccordionTitle) {
        if (title) {
          console.warn(
            '[Mezzanine][Accordion] Only one AccordionTitle is allowed as children of Accordion.',
          );
        }

        title = child;
      } else if (child.type === MznAccordionContent) {
        if (content) {
          console.warn(
            '[Mezzanine][Accordion] Only one AccordionContent is allowed as children of Accordion.',
          );
        }

        content = child;
      } else {
        restContentChildren.push(child);
      }
    });

    if (restContentChildren.length > 0) {
      if (content || title) {
        console.warn(
          '[Mezzanine][Accordion] When AccordionTitle or AccordionContent is used as children. Please wrap other children with AccordionContent.',
        );
      }

      const existing = (content as VNode | null)?.children as
        | { default?: () => unknown }
        | undefined;

      content = h(
        MznAccordionContent,
        (content as VNode | null)?.props ?? null,
        { default: () => [existing?.default?.(), ...restContentChildren] },
      );
    }

    return { content, title };
  },
);

const titleId = computed(
  (): string | undefined =>
    (resolved.value.title?.props?.id as string | undefined) ?? undefined,
);

provide(
  ACCORDION_CONTROL_CONTEXT,
  computed(() => ({
    contentId: titleId.value ? `${titleId.value}-content` : undefined,
    disabled: props.disabled,
    expanded: expanded.value,
    titleId: titleId.value,
    toggleExpanded: onToggleExpanded,
  })),
);

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size), {
    [classes.hostDisabled]: props.disabled,
  }),
);

const fadeDuration = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};
const fadeEasing = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};

const ResolvedTitle: FunctionalComponent = () => resolved.value.title;
const ResolvedContent: FunctionalComponent = () => resolved.value.content;
</script>

<template>
  <div :class="hostClasses">
    <MznAccordionTitle v-if="title" :actions="actions">
      {{ title }}
    </MznAccordionTitle>
    <ResolvedTitle v-else />

    <MznFade :duration="fadeDuration" :easing="fadeEasing" :in="expanded">
      <div><ResolvedContent /></div>
    </MznFade>
  </div>
</template>
