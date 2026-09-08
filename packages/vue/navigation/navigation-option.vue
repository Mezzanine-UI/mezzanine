<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  useId,
  useSlots,
  watch,
} from 'vue';
import type { Component, FunctionalComponent, VNode } from 'vue';
import { navigationOptionClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, ChevronUpIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznBadge from '../badge/badge.vue';
import MznIcon from '../icon/icon.vue';
import MznCollapse from '../transition/collapse.vue';
import MznFade from '../transition/fade.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import type { PopperPlacement } from '../popper/popper.types';
import {
  NAVIGATION_ACTIVATED_CONTEXT,
  NAVIGATION_OPTION_LEVEL_CONTEXT,
  navigationOptionLevelContextDefaultValues,
} from './navigation-context';
import type { NavigationOptionProps } from './navigation-option.types';

/**
 * 側邊欄的一個選項，可以是連結，也可以是收合一組子選項的開關。
 *
 * 有子選項時渲染成 div 並帶開合箭頭，沒有子選項而有 `href` 時渲染成連結；
 * `anchorComponent` 或側邊欄的 `optionsAnchorComponent` 可以換掉連結元件。
 * 收合狀態下標題以 tooltip 呈現，沒有圖示時只留標題的前兩個字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationOption } from '@mezzanine-ui/vue/navigation';
 * import { HomeIcon } from '@mezzanine-ui/icons';
 * <\/script>
 *
 * <template>
 *   <MznNavigationOption :icon="HomeIcon" title="首頁" href="/" />
 * </template>
 * ```
 *
 * @see MznNavigation 承載這些選項的側邊欄
 */
const props = withDefaults(defineProps<NavigationOptionProps>(), {
  active: undefined,
  anchorComponent: undefined,
  defaultOpen: false,
  href: undefined,
  icon: undefined,
  id: undefined,
});

const emit = defineEmits<{
  /** Fired when the option is clicked, with its path, key and href. */
  triggerClick: [path: string[], currentKey: string, href?: string];
}>();

defineSlots<{
  /** The sub-options, and at most one badge. */
  default?: () => unknown;
}>();

const slots = useSlots();

/** An option nests options: the only way to name itself is through Vue. */
const self = getCurrentInstance()?.type;

const context = inject(NAVIGATION_ACTIVATED_CONTEXT, undefined);
const levelContext = inject(NAVIGATION_OPTION_LEVEL_CONTEXT, undefined);

const collapsed = computed((): boolean => Boolean(context?.value.collapsed));

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

const open = ref(props.defaultOpen);

const resolved = computed((): { badge: VNode | null; items: VNode[] } => {
  let badge: VNode | null = null;
  const items: VNode[] = [];

  flattenChildren(slots.default?.()).forEach((child) => {
    if (child.type === MznBadge) {
      badge = child;
    } else if (child.type === self) {
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
 * Group or leaf is decided by real sub-options, not by raw children: a lone
 * badge is rendered inline on a leaf.
 */
const hasSubOptions = computed((): boolean => resolved.value.items.length > 0);

const OptionComponent = computed((): Component | string =>
  props.href && !hasSubOptions.value
    ? (props.anchorComponent ?? context?.value.optionsAnchorComponent ?? 'a')
    : 'div',
);

const isDiv = computed((): boolean => OptionComponent.value === 'div');

/** An option on the activated path opens itself. */
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

const filterText = computed((): string => context?.value.filterText ?? '');

const matchesFilter = computed((): boolean => {
  if (!filterText.value) return true;

  return (
    props.title.includes(filterText.value) ||
    Boolean(props.href?.includes(filterText.value))
  );
});

const titleElement = ref<HTMLSpanElement | null>(null);
const titleOverflow = ref(false);

let resizeObserver: ResizeObserver | null = null;

watch(
  [titleElement, () => props.title],
  () => {
    resizeObserver?.disconnect();
    resizeObserver = null;

    const element = titleElement.value;

    if (!element) return;

    const checkOverflow = (): void => {
      const { clientWidth, scrollWidth } = element;

      titleOverflow.value = scrollWidth > clientWidth;
    };

    checkOverflow();

    resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);
  },
  { flush: 'post', immediate: true },
);

onBeforeUnmount(() => resizeObserver?.disconnect());

const isActive = computed(
  (): boolean =>
    props.active ??
    context?.value.activatedPath?.[currentLevel.value - 1] === currentKey.value,
);

const isHidden = computed((): boolean =>
  collapsed.value
    ? Boolean(context?.value.collapsedHiddenKeys.has(currentKey.value))
    : !matchesFilter.value,
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    open.value && classes.open,
    !hasSubOptions.value && classes.basic,
    isActive.value && classes.active,
    collapsed.value && classes.collapsed,
    isHidden.value ? classes.hidden : undefined,
  ),
);

const shownTitle = computed((): string =>
  collapsed.value && !props.icon
    ? Array.from(props.title).slice(0, 2).join('')
    : props.title,
);

const tooltipTitle = computed((): string | undefined =>
  collapsed.value || titleOverflow.value ? props.title : undefined,
);

const tooltipOptions = computed(() => ({
  placement: (collapsed.value ? 'right' : 'top') as PopperPlacement,
}));

/** 6 is the padding of the item. */
const OFFSET_MAIN_AXIS = 8 + 6;

function onTrigger(): void {
  open.value = !open.value;
  emit('triggerClick', currentPath.value, currentKey.value, props.href);

  if (collapsed.value) context?.value.handleCollapseChange(false);

  if (!hasSubOptions.value) {
    context?.value.setActivatedPath(currentPath.value);
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    open.value = !open.value;

    if (!hasSubOptions.value) {
      context?.value.setActivatedPath(currentPath.value);
    }
  }
}

provide(
  NAVIGATION_OPTION_LEVEL_CONTEXT,
  computed(() => ({ level: currentLevel.value, path: currentPath.value })),
);

const OptionBadge: FunctionalComponent = () => resolved.value.badge;
const SubOptions: FunctionalComponent = () => resolved.value.items;
</script>

<template>
  <li :class="hostClasses" :data-id="currentKey">
    <MznTooltip
      :disable-portal="false"
      :offset-main-axis="OFFSET_MAIN_AXIS"
      :options="tooltipOptions"
      :title="tooltipTitle"
    >
      <template #default="tooltip">
        <component
          :is="OptionComponent"
          :ref="tooltip.ref"
          :aria-expanded="hasSubOptions ? open : undefined"
          :class="[classes.content, classes.level(currentLevel)]"
          :href="isDiv ? undefined : href"
          :role="isDiv ? 'button' : undefined"
          :tabindex="0"
          @click="onTrigger"
          @keydown="onKeydown"
          @mouseenter="tooltip.onMouseenter"
          @mouseleave="tooltip.onMouseleave"
        >
          <MznIcon v-if="icon" :class="classes.icon" :icon="icon" />

          <span :class="classes.titleWrapper">
            <MznFade :in="collapsed === false || !icon">
              <span ref="titleElement" :class="classes.title">
                {{ shownTitle }}
              </span>
            </MznFade>
          </span>

          <OptionBadge />
          <MznIcon
            v-if="hasSubOptions"
            :class="classes.toggleIcon"
            :icon="open ? ChevronUpIcon : ChevronDownIcon"
          />
        </component>
      </template>
    </MznTooltip>
    <MznCollapse
      v-if="hasSubOptions && !collapsed"
      :class="classes.childrenWrapper"
      :in="open"
      lazy-mount
    >
      <ul :class="classes.group"
        ><SubOptions
      /></ul>
    </MznCollapse>
  </li>
</template>
