<script setup lang="ts">
import { cloneVNode, computed } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { sectionClasses as classes } from '@mezzanine-ui/core/section';
import MznContentHeader from '../content-header/content-header.vue';
import MznFilterArea from '../filter-area/filter-area.vue';
import MznTab from '../tab/tab.vue';
import type { SectionProps } from './section.types';

/**
 * 頁面裡的一個區塊：標題列、篩選器、頁籤，加上內容。
 *
 * 三個位置各自只收對應的元件，給錯會印出警告並不渲染。標題列與篩選器一律被改成
 * `sub` 尺寸。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { h } from 'vue';
 * import { MznSection } from '@mezzanine-ui/vue/section';
 * import { MznContentHeader } from '@mezzanine-ui/vue/content-header';
 * <\/script>
 *
 * <template>
 *   <MznSection :content-header="h(MznContentHeader, { title: 'Section Title' })">
 *     內容
 *   </MznSection>
 * </template>
 * ```
 *
 * @see MznSectionGroup 把多個區塊排在一起
 */
const props = withDefaults(defineProps<SectionProps>(), {
  contentHeader: undefined,
  filterArea: undefined,
  tab: undefined,
});

defineSlots<{
  /** The section's own content. */
  default?: () => unknown;
}>();

/** React reads `displayName` or the function's name off the element's type. */
function displayNameOf(node: VNode): string {
  const { type } = node;

  if (typeof type === 'string') return type;

  const component = type as { __name?: string; name?: string };

  return component.name || component.__name || 'Unknown';
}

function resolve(
  node: VNode | undefined,
  expected: unknown,
  slotName: string,
  size?: 'sub',
): VNode | null {
  if (!node) return null;

  if (node.type === expected) {
    return size ? cloneVNode(node, { size }) : node;
  }

  console.warn(
    `[Section] Invalid ${slotName} type: <${displayNameOf(node)}>. Only <${slotName === 'contentHeader' ? 'ContentHeader' : slotName === 'filterArea' ? 'FilterArea' : 'Tab'} /> component from @mezzanine-ui/react is allowed.`,
  );

  return null;
}

const renderedContentHeader = computed((): VNode | null =>
  resolve(props.contentHeader, MznContentHeader, 'contentHeader', 'sub'),
);

const renderedFilterArea = computed((): VNode | null =>
  resolve(props.filterArea, MznFilterArea, 'filterArea', 'sub'),
);

const renderedTab = computed((): VNode | null =>
  resolve(props.tab, MznTab, 'tab'),
);

const ContentHeaderSlot: FunctionalComponent = () =>
  renderedContentHeader.value;
const FilterAreaSlot: FunctionalComponent = () => renderedFilterArea.value;
const TabSlot: FunctionalComponent = () => renderedTab.value;
</script>

<template>
  <div :class="classes.host">
    <ContentHeaderSlot />
    <FilterAreaSlot />
    <TabSlot />
    <div :class="classes.hostContent"><slot /></div>
  </div>
</template>
