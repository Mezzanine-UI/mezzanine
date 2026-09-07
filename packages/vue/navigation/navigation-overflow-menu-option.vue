<script setup lang="ts">
import { computed, inject, ref, useId, useSlots, watch } from 'vue';
import type { Component, FunctionalComponent, VNode } from 'vue';
import { navigationOverflowMenuOptionClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznBadge from '../badge/badge.vue';
import MznIcon from '../icon/icon.vue';
import MznNavigationOption from './navigation-option.vue';
import {
  NAVIGATION_ACTIVATED_CONTEXT,
  NAVIGATION_OPTION_LEVEL_CONTEXT,
  navigationOptionLevelContextDefaultValues,
} from './navigation-context';
import type { NavigationOverflowMenuOptionProps } from './navigation-overflow-menu-option.types';

/**
 * 收合側邊欄「更多」浮層裡的一列。
 *
 * 有子項時右邊是往右的箭頭，點一下由浮層負責再開一欄；沒有子項時就是一條連結。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationOverflowMenuOption } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigationOverflowMenuOption title="專案 1" />
 * </template>
 * ```
 *
 * @see MznNavigationOverflowMenu 承載這些列的浮層
 */
const props = withDefaults(defineProps<NavigationOverflowMenuOptionProps>(), {
  active: undefined,
  anchorComponent: undefined,
  defaultOpen: false,
  href: undefined,
  icon: undefined,
  id: undefined,
});

const emit = defineEmits<{
  /** Fired when the row is clicked, with its path, key, href and sub-options. */
  triggerClick: [
    path: string[],
    currentKey: string,
    href?: string,
    items?: VNode[],
  ];
}>();

defineSlots<{
  /** The sub-options, and at most one badge. */
  default?: () => unknown;
}>();

const slots = useSlots();

const open = ref(props.defaultOpen);

const levelContext = inject(NAVIGATION_OPTION_LEVEL_CONTEXT, undefined);
const context = inject(NAVIGATION_ACTIVATED_CONTEXT, undefined);

const level = computed(
  (): number =>
    levelContext?.value.level ??
    navigationOptionLevelContextDefaultValues.level,
);
const parentPath = computed(
  (): string[] =>
    levelContext?.value.path ?? navigationOptionLevelContextDefaultValues.path,
);

/** Levels start at 1. */
const currentLevel = computed((): number => level.value + 1);

const uuid = useId();
const currentKey = computed(
  (): string => props.id || props.title || props.href || uuid,
);
const currentPath = computed((): string[] => [
  ...parentPath.value,
  currentKey.value,
]);
const currentPathKey = computed((): string => currentPath.value.join('::'));

watch(
  [() => context?.value.activatedPathKey, currentPathKey],
  ([activatedPathKey, pathKey]) => {
    if (
      activatedPathKey === pathKey ||
      activatedPathKey?.startsWith(`${pathKey}::`)
    ) {
      open.value = true;
    }
  },
  { immediate: true },
);

const OptionComponent = computed((): Component | string =>
  props.href
    ? (props.anchorComponent ?? context?.value.optionsAnchorComponent ?? 'a')
    : 'div',
);

const isDiv = computed((): boolean => OptionComponent.value === 'div');

const resolved = computed((): { badge: VNode | null; items: VNode[] } => {
  let badge: VNode | null = null;
  const items: VNode[] = [];

  flattenChildren(slots.default?.()).forEach((child) => {
    if (child.type === MznBadge) {
      badge = child;
    } else if (child.type === MznNavigationOption) {
      items.push(child);
    } else {
      console.warn(
        '[Mezzanine][NavigationOption]: NavigationOption only accepts NavigationOption or Badge as children.',
      );
    }
  });

  return { badge, items };
});

/**
 * React branches on raw `children`, not on real sub-options, so a row carrying
 * only a badge still reads as a group here.
 */
const hasChildren = computed((): boolean => Boolean(slots.default));

const isActive = computed(
  (): boolean =>
    props.active ??
    context?.value.activatedPath?.[currentLevel.value - 1] === currentKey.value,
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    open.value && classes.open,
    !hasChildren.value && classes.basic,
    isActive.value && classes.active,
  ),
);

function onTrigger(): void {
  open.value = !open.value;
  emit(
    'triggerClick',
    currentPath.value,
    currentKey.value,
    props.href,
    resolved.value.items,
  );

  if (!hasChildren.value) {
    context?.value.setActivatedPath(currentPath.value);
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    open.value = !open.value;

    if (!hasChildren.value) {
      context?.value.setActivatedPath(currentPath.value);
    }
  }
}

const OptionBadge: FunctionalComponent = () => resolved.value.badge;
</script>

<template>
  <li :class="hostClasses" :data-id="currentKey">
    <component
      :is="OptionComponent"
      :aria-expanded="hasChildren ? open : undefined"
      :class="classes.content"
      :href="href"
      :role="isDiv ? 'button' : undefined"
      :tabindex="0"
      @click="onTrigger"
      @keydown="onKeydown"
    >
      <MznIcon v-if="icon" :class="classes.icon" :icon="icon" />
      <span :class="classes.title">{{ title }}</span>
      <OptionBadge />
      <MznIcon
        v-if="hasChildren"
        :class="classes.toggleIcon"
        :icon="ChevronRightIcon"
      />
    </component>
  </li>
</template>
