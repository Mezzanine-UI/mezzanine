<script setup lang="ts">
import { cloneVNode, computed, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import { flattenChildren } from '../_internal/flatten-children';
import MznBreadcrumb from '../breadcrumb/breadcrumb.vue';
import MznContentHeader from '../content-header/content-header.vue';
import type { PageHeaderProps } from './page-header.types';

/**
 * 頁面標頭：一組麵包屑加上一個內容標題列。
 *
 * slot 只收 MznBreadcrumb 與 MznContentHeader，各一個；內容標題列的 `size` 一律
 * 被改成 `main`。少了內容標題列會在 console 報錯。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznPageHeader } from '@mezzanine-ui/vue/page-header';
 * <\/script>
 *
 * <template>
 *   <MznPageHeader>
 *     <MznBreadcrumb>...</MznBreadcrumb>
 *     <MznContentHeader title="Page Title" />
 *   </MznPageHeader>
 * </template>
 * ```
 *
 * @see MznContentHeader 頁面標頭裡的內容標題列
 */
defineProps<PageHeaderProps>();

defineSlots<{
  /** One MznBreadcrumb and one MznContentHeader. */
  default?: () => unknown;
}>();

const slots = useSlots();

const resolved = computed(
  (): { breadcrumb: VNode | null; contentHeader: VNode | null } => {
    let breadcrumb: VNode | null = null;
    let contentHeader: VNode | null = null;

    flattenChildren(slots.default?.()).forEach((child) => {
      if (child.type === MznBreadcrumb) {
        if (breadcrumb) {
          console.warn(
            '[Mezzanine][PageHeader] only accepts one Breadcrumb as its child.',
          );
        }

        breadcrumb = child;
      } else if (child.type === MznContentHeader) {
        if (contentHeader) {
          console.warn(
            '[Mezzanine][PageHeader] only accepts one ContentHeader as its child.',
          );
        }

        const sizeProp = (child.props as { size?: string } | null)?.size;

        if (sizeProp !== undefined && sizeProp !== 'main') {
          console.warn(
            '[Mezzanine][PageHeader] ContentHeader size prop will be overridden to "main".',
          );
        }

        contentHeader = cloneVNode(child, { size: 'main' });
      } else {
        console.warn(
          '[Mezzanine][PageHeader] only accepts Breadcrumb or ContentHeader as its children.',
        );
      }
    });

    if (!contentHeader) {
      console.error(
        '[Mezzanine][PageHeader] requires a ContentHeader as its child.',
      );
    }

    return { breadcrumb, contentHeader };
  },
);

const Breadcrumb: FunctionalComponent = () => resolved.value.breadcrumb;
const ContentHeader: FunctionalComponent = () => resolved.value.contentHeader;
</script>

<template>
  <header :class="classes.host">
    <Breadcrumb />
    <ContentHeader />
  </header>
</template>
