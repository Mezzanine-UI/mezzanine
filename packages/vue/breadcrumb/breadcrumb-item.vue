<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { Component } from 'vue';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznTypography from '../typography/typography.vue';
import MznBreadcrumbDropdown from './breadcrumb-dropdown.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';

/**
 * 麵包屑的一節。
 *
 * 給了 `options` 就渲染成下拉選單；否則有 `href` 或有人監聽 `click` 時渲染成
 * 連結，都沒有時渲染成純文字。`current` 會把它標成目前頁面，文字也換成強調樣式。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznBreadcrumbItem } from '@mezzanine-ui/vue/breadcrumb';
 * <\/script>
 *
 * <template>
 *   <MznBreadcrumbItem href="/" name="Home" />
 *   <MznBreadcrumbItem :options="tabs" name="Tab" @select="go" />
 * </template>
 * ```
 *
 * @see MznBreadcrumb 排列這些節點的容器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  component: undefined,
  current: undefined,
  href: undefined,
  open: undefined,
  target: undefined,
});

const emit = defineEmits<{
  actionCancel: [];
  actionClear: [];
  actionConfirm: [];
  actionCustom: [];
  click: [];
  close: [];
  itemHover: [index: number];
  leaveBottom: [];
  open: [];
  reachBottom: [];
  select: [option: DropdownOption];
  visibilityChange: [option: boolean];
}>();

const attrs = useAttrs();
const hasListener = useHasListener();

const isDropdown = computed((): boolean => props.options !== undefined);

const triggerComponent = computed((): Component | string => {
  if (props.component) return props.component;

  if (
    (!props.current && typeof props.href === 'string') ||
    hasListener('click')
  ) {
    return 'a';
  }

  return 'span';
});

const isAnchor = computed((): boolean => triggerComponent.value === 'a');

const hostClasses = computed((): string =>
  clsx(classes.host, props.current && classes.current, attrs.class as string),
);

/**
 * React keeps `rel` out of the host's spread and puts it on the trigger. It is
 * not a declared prop here — the extractor counts React's as HTML passthrough —
 * so it is read from the attributes and taken out of what the host forwards.
 *
 * `id` goes the other way: React leaves it in the rest spread, so it lands on
 * the host. Being a declared prop here keeps it out of the attributes, so it
 * is written onto the host by hand.
 */
const forwardedAttrs = computed(() => {
  const { class: _class, rel: _rel, ...rest } = attrs;

  return rest;
});

const triggerBindings = computed(() => ({
  class: classes.trigger,
  href: isAnchor.value ? props.href : undefined,
  onClick: isAnchor.value ? () => emit('click') : undefined,
  rel: isAnchor.value ? (attrs.rel as string | undefined) : undefined,
  target: isAnchor.value ? props.target : undefined,
}));

const dropdownBindings = computed(() => ({
  ...props,
  ...attrs,
  onActionCancel: () => emit('actionCancel'),
  onActionClear: () => emit('actionClear'),
  onActionConfirm: () => emit('actionConfirm'),
  onActionCustom: () => emit('actionCustom'),
  onClick: () => emit('click'),
  onClose: () => emit('close'),
  onItemHover: (index: number) => emit('itemHover', index),
  onLeaveBottom: () => emit('leaveBottom'),
  onOpen: () => emit('open'),
  onReachBottom: () => emit('reachBottom'),
  onSelect: (option: DropdownOption) => emit('select', option),
  onVisibilityChange: (value: boolean) => emit('visibilityChange', value),
}));
</script>

<template>
  <MznBreadcrumbDropdown v-if="isDropdown" v-bind="dropdownBindings" />
  <span v-else v-bind="forwardedAttrs" :class="hostClasses" :id="id">
    <component :is="triggerComponent" v-bind="triggerBindings">
      <MznTypography
        v-if="name"
        :variant="current ? 'caption-highlight' : 'caption'"
      >
        {{ name }}
      </MznTypography>
    </component>
  </span>
</template>
