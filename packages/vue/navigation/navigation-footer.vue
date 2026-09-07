<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import type { CSSProperties, FunctionalComponent, VNode } from 'vue';
import { navigationFooterClasses as classes } from '@mezzanine-ui/core/navigation';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import { NAVIGATION_ACTIVATED_CONTEXT } from './navigation-context';
import MznNavigationUserMenu from './navigation-user-menu.vue';
import type { NavigationFooterProps } from './navigation-footer.types';

/**
 * 側邊欄的底部。
 *
 * 只有 MznNavigationUserMenu 會單獨排在前面，其餘子項一律收進圖示列。圖示列的
 * 寬度會量出來寫進 `--icons-width`，樣式靠它保留使用者名稱的空間。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationFooter, MznNavigationUserMenu } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigationFooter>
 *     <MznNavigationUserMenu :options="options">王小明</MznNavigationUserMenu>
 *   </MznNavigationFooter>
 * </template>
 * ```
 *
 * @see MznNavigation 承載這個底部的側邊欄
 */
defineProps<NavigationFooterProps>();

defineSlots<{
  /** The user menu, and whatever icon buttons go beside it. */
  default?: () => unknown;
}>();

const slots = useSlots();

const context = inject(NAVIGATION_ACTIVATED_CONTEXT, undefined);

const collapsed = computed((): boolean => Boolean(context?.value.collapsed));

const resolved = computed((): { others: VNode[]; userMenu: VNode | null } => {
  let userMenu: VNode | null = null;
  const others: VNode[] = [];

  flattenChildren(slots.default?.()).forEach((child) => {
    if (child.type === MznNavigationUserMenu) userMenu = child;
    else others.push(child);
  });

  return { others, userMenu };
});

const icons = ref<HTMLSpanElement | null>(null);
const iconsWidth = ref(0);

let resizeObserver: ResizeObserver | null = null;

watch(
  icons,
  (element) => {
    resizeObserver?.disconnect();
    resizeObserver = null;

    if (!element) return;

    resizeObserver = new ResizeObserver(() => {
      if (icons.value) iconsWidth.value = icons.value.offsetWidth;
    });

    resizeObserver.observe(element);
  },
  { flush: 'post', immediate: true },
);

onBeforeUnmount(() => resizeObserver?.disconnect());

const hostClasses = computed((): string =>
  clsx(classes.host, collapsed.value && classes.collapsed),
);

const hostStyle = computed(
  (): CSSProperties =>
    ({ '--icons-width': `${iconsWidth.value}px` }) as CSSProperties,
);

const UserMenu: FunctionalComponent = () => resolved.value.userMenu;
const OtherChildren: FunctionalComponent = () => resolved.value.others;
</script>

<template>
  <footer :class="hostClasses" :style="hostStyle">
    <UserMenu />
    <span ref="icons" :class="classes.icons"><OtherChildren /></span>
  </footer>
</template>
