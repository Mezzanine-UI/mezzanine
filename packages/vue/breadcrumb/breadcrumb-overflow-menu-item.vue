<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { Component } from 'vue';
import { breadcrumbOverflowMenuItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import clsx from 'clsx';
import MznTypography from '../typography/typography.vue';
import MznBreadcrumbOverflowMenuDropdown from './breadcrumb-overflow-menu-dropdown.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';

/**
 * 收合選單裡的一列。與 MznBreadcrumbItem 同樣依 `options`、`href` 與是否有
 * click 監聽決定渲染成下拉、連結還是純文字，但文字一律用 label 樣式。
 *
 * @see MznBreadcrumbOverflowMenu 收納它們的選單
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  component: undefined,
  current: undefined,
  href: undefined,
  target: undefined,
});

const attrs = useAttrs();

const isDropdown = computed((): boolean => props.options !== undefined);

const triggerComponent = computed((): Component | string => {
  if (props.component) return props.component;

  if (
    (!props.current && typeof props.href === 'string') ||
    attrs.onClick !== undefined
  ) {
    return 'a';
  }

  return 'span';
});

const isAnchor = computed((): boolean => triggerComponent.value === 'a');

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, onClick: _onClick, rel: _rel, ...rest } = attrs;

  return rest;
});

const triggerBindings = computed(() => ({
  class: classes.trigger,
  href: isAnchor.value ? props.href : undefined,
  onClick: isAnchor.value
    ? (attrs.onClick as (() => void) | undefined)
    : undefined,
  rel: isAnchor.value ? (attrs.rel as string | undefined) : undefined,
  target: isAnchor.value ? props.target : undefined,
}));
</script>

<template>
  <MznBreadcrumbOverflowMenuDropdown
    v-if="isDropdown"
    v-bind="{ ...props, ...attrs }"
  />
  <span v-else v-bind="forwardedAttrs" :class="hostClasses" :id="id">
    <component :is="triggerComponent" v-bind="triggerBindings">
      <MznTypography variant="label-primary">{{ name }}</MznTypography>
    </component>
  </span>
</template>
