<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznNavigation from '../navigation/navigation.vue';
import MznLayoutHost from './layout-host.vue';
import MznLayoutLeftPanel from './layout-left-panel.vue';
import MznLayoutMain from './layout-main.vue';
import MznLayoutRightPanel from './layout-right-panel.vue';
import type { LayoutProps } from './layout.types';

/**
 * 頁面版面：導航、左面板、主要區域、右面板。
 *
 * slot 裡的順序無所謂，會依元件種類重新排成正確的 DOM 順序；導航另外被包進自己
 * 的容器裡。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznLayout, MznLayoutMain } from '@mezzanine-ui/vue/layout';
 * <\/script>
 *
 * <template>
 *   <MznLayout>
 *     <MznNavigation>...</MznNavigation>
 *     <MznLayoutMain>...</MznLayoutMain>
 *   </MznLayout>
 * </template>
 * ```
 *
 * @see MznLayoutMain 版面的主要內容區
 */
const props = withDefaults(defineProps<LayoutProps>(), {
  contentWrapperClassName: undefined,
  navigationClassName: undefined,
});

defineSlots<{
  /** A navigation, a left panel, a main area and a right panel, in any order. */
  default?: () => unknown;
}>();

const slots = useSlots();

interface ResolvedLayout {
  leftPanel: VNode | null;
  main: VNode | null;
  navigation: VNode | null;
  rightPanel: VNode | null;
}

const resolved = computed((): ResolvedLayout => {
  let navigation: VNode | null = null;
  let leftPanel: VNode | null = null;
  let main: VNode | null = null;
  let rightPanel: VNode | null = null;

  flattenChildren(slots.default?.()).forEach((child) => {
    if (child.type === MznNavigation) navigation = child;
    else if (child.type === MznLayoutLeftPanel) leftPanel = child;
    else if (child.type === MznLayoutMain) main = child;
    else if (child.type === MznLayoutRightPanel) rightPanel = child;
  });

  return { leftPanel, main, navigation, rightPanel };
});

const navigationClasses = computed((): string =>
  clsx(classes.navigation, props.navigationClassName),
);

const contentWrapperClasses = computed((): string =>
  clsx(classes.contentWrapper, props.contentWrapperClassName),
);

const Navigation: FunctionalComponent = () => resolved.value.navigation;
const LeftPanel: FunctionalComponent = () => resolved.value.leftPanel;
const Main: FunctionalComponent = () => resolved.value.main;
const RightPanel: FunctionalComponent = () => resolved.value.rightPanel;
</script>

<template>
  <MznLayoutHost>
    <div v-if="resolved.navigation" :class="navigationClasses">
      <Navigation />
    </div>
    <div :class="contentWrapperClasses">
      <LeftPanel />
      <Main />
      <RightPanel />
    </div>
  </MznLayoutHost>
</template>
