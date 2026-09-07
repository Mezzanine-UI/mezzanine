<script setup lang="ts">
import { computed, inject, useSlots } from 'vue';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';
import { SiderIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import { useHasListener } from '../_internal/use-has-listener';
import MznFade from '../transition/fade.vue';
import MznNavigationIconButton from './navigation-icon-button.vue';
import { NAVIGATION_ACTIVATED_CONTEXT } from './navigation-context';
import type { NavigationHeaderProps } from './navigation-header.types';

/**
 * 側邊欄的頂部：收合切換鈕，加上品牌區塊。
 *
 * 收合時標題只留第一個字，slot 給的 logo 仍然留著。有人監聽 `brandClick` 時品牌
 * 區塊會變成按鈕，否則是純文字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationHeader } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigationHeader title="Mezzanine"><span aria-label="logo" /></MznNavigationHeader>
 * </template>
 * ```
 *
 * @see MznNavigation 承載這個頂部的側邊欄
 */
const props = withDefaults(defineProps<NavigationHeaderProps>(), {
  collapseToggleLabel: 'Toggle navigation',
});

const emit = defineEmits<{
  /** Fired when the brand area is clicked. */
  brandClick: [];
}>();

defineSlots<{
  /** The logo shown next to the title. */
  default?: () => unknown;
}>();

const slots = useSlots();
const hasListener = useHasListener();

const context = inject(NAVIGATION_ACTIVATED_CONTEXT, undefined);

const collapsed = computed((): boolean => Boolean(context?.value.collapsed));

/**
 * A slot that renders only a `v-if` placeholder is React's `{false}`: written,
 * but not content.
 */
const hasChildren = computed(
  (): boolean => flattenChildren(slots.default?.()).length > 0,
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    collapsed.value && classes.collapsed,
    hasChildren.value && classes.hasChildren,
  ),
);

const brandIsButton = computed((): boolean => hasListener('brandClick'));

const shownTitle = computed((): string | undefined =>
  collapsed.value ? props.title?.[0] : props.title,
);

function onToggle(): void {
  context?.value.handleCollapseChange(!collapsed.value);
}
</script>

<template>
  <header :class="hostClasses">
    <MznNavigationIconButton
      :aria-expanded="!collapsed"
      :aria-label="collapseToggleLabel"
      :icon="SiderIcon"
      @click="onToggle"
    />
    <component
      :is="brandIsButton ? 'button' : 'span'"
      :class="classes.content"
      :type="brandIsButton ? 'button' : undefined"
      @click="brandIsButton ? emit('brandClick') : undefined"
    >
      <span v-if="hasChildren" :class="classes.childrenWrapper">
        <slot />
      </span>

      <MznFade :in="!collapsed || !hasChildren">
        <span :class="classes.title">{{ shownTitle }}</span>
      </MznFade>
    </component>
  </header>
</template>
