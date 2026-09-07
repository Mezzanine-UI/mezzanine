<script setup lang="ts">
import { computed, useId, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';
import { flattenChildren } from '../_internal/flatten-children';
import MznNavigationOption from './navigation-option.vue';
import type { NavigationOptionCategoryProps } from './navigation-option-category.types';

/**
 * 側邊欄選項的分組標題。
 *
 * 只收 MznNavigationOption，其餘子項會被丟掉並印出警告。標題與底下的清單用
 * `aria-labelledby` 綁在一起。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationOption, MznNavigationOptionCategory } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigationOptionCategory title="主要功能">
 *     <MznNavigationOption title="儀表板" />
 *   </MznNavigationOptionCategory>
 * </template>
 * ```
 *
 * @see MznNavigation 承載這些分組的側邊欄
 */
defineProps<NavigationOptionCategoryProps>();

defineSlots<{
  /** The options this category groups. */
  default?: () => unknown;
}>();

const slots = useSlots();
const titleId = useId();

const items = computed((): VNode[] =>
  flattenChildren(slots.default?.()).filter((child) => {
    if (child.type === MznNavigationOption) return true;

    console.warn(
      '[Mezzanine][NavigationOptionCategory]: NavigationOptionCategory only accepts NavigationOption as children.',
    );

    return false;
  }),
);

const CategoryItems: FunctionalComponent = () => items.value;
</script>

<template>
  <li :class="classes.host">
    <span :id="titleId" :class="classes.title">{{ title }}</span>
    <ul :aria-labelledby="titleId"
      ><CategoryItems
    /></ul>
  </li>
</template>
