<script setup lang="ts">
import { cloneVNode, computed, provide, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznDescriptionTitle from './description-title.vue';
import { DESCRIPTION_CONTEXT } from './description-context';
import type { DescriptionProps } from './description.types';

/**
 * 描述列：一個標題配一段內容。
 *
 * 標題文字用 `title` 給，內容放在預設 slot —— 可以是 MznDescriptionContent，也
 * 可以是徽章、按鈕、進度條或標籤群組。`size` 會補到內容上，內容自己指定的優先。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDescription, MznDescriptionContent } from '@mezzanine-ui/vue/description';
 * <\/script>
 *
 * <template>
 *   <MznDescription title="訂單編號">
 *     <MznDescriptionContent children="A-1234" />
 *   </MznDescription>
 * </template>
 * ```
 *
 * @see MznDescriptionGroup 把多個描述列排在一起
 */
const props = withDefaults(defineProps<DescriptionProps>(), {
  badge: undefined,
  icon: undefined,
  orientation: 'horizontal',
  size: 'main',
  tooltip: undefined,
  tooltipPlacement: undefined,
  widthType: undefined,
});

defineSlots<{
  /** The content shown beside the title. */
  default?: () => unknown;
}>();

const slots = useSlots();

provide(
  DESCRIPTION_CONTEXT,
  computed(() => ({ size: props.size })),
);

/**
 * React clones only when the content is a single element, so a description
 * given several children hands none of them the size.
 */
const content = computed((): VNode[] => {
  const children = flattenChildren(slots.default?.());

  if (children.length !== 1) return children;

  const [child] = children;
  const ownSize = (child.props as { size?: string } | null)?.size;

  return [cloneVNode(child, { size: ownSize ?? props.size })];
});

const hostClasses = computed((): string =>
  clsx(classes.host, classes.orientation(props.orientation)),
);

const titleProps = computed(() => ({
  badge: props.badge,
  icon: props.icon,
  size: props.size,
  tooltip: props.tooltip,
  tooltipPlacement: props.tooltipPlacement,
  widthType: props.widthType,
}));

const Content: FunctionalComponent = () => content.value;
</script>

<template>
  <div :class="hostClasses">
    <MznDescriptionTitle v-bind="titleProps" :children="title" />
    <Content />
  </div>
</template>
