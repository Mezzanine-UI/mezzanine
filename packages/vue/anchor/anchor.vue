<script setup lang="ts">
import { getCurrentInstance, useSlots, type VNode } from 'vue';
import MznAnchorItem from './anchor-item.vue';
import { parseChildren } from './parse-children';
import type { AnchorItemData } from './anchor-item.types';
import type { AnchorProps } from './anchor.types';

/**
 * 頁面章節導航連結，會依網址 hash 自動標示當前位置。
 *
 * 可用 `anchors` 直接傳入資料，或以巢狀的 `MznAnchor` 子元件描述結構。
 * 巢狀最多支援三層，更深的層級會被忽略。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAnchor, MznAnchorGroup } from '@mezzanine-ui/vue/anchor';
 * <\/script>
 *
 * <template>
 *   <MznAnchorGroup>
 *     <MznAnchor href="#acr1">ACR 1</MznAnchor>
 *     <MznAnchor href="#acr2">
 *       anchor 2
 *       <MznAnchor href="#acr2-1">ACR 2-1</MznAnchor>
 *     </MznAnchor>
 *   </MznAnchorGroup>
 * </template>
 * ```
 *
 * @see MznAnchorGroup 外層容器
 */
const props = defineProps<AnchorProps>();

/**
 * Declared so the click handler is part of the public API and is kept out of
 * `$attrs`, matching React's `onClick` prop. The component does not emit it
 * itself: `parseChildren` lifts the handler off the vnode into the item data
 * and the rendered item invokes it, which is exactly the path React takes.
 */
defineEmits<{
  click: [];
}>();

defineSlots<{
  default?: () => unknown;
}>();

/** Renders a fragment of items, so no attribute is forwarded implicitly. */
defineOptions({ inheritAttrs: false });

const slots = useSlots();
const self = getCurrentInstance()?.type;

/**
 * Called from the template rather than wrapped in a `computed`: invoking a
 * slot is not a tracked dependency, so a computed would keep stale children
 * after the parent re-renders.
 */
function resolveItems(): AnchorItemData[] {
  if (props.anchors) return props.anchors;

  const nodes = (slots.default?.() ?? []) as VNode[];

  return self ? parseChildren(nodes, self) : [];
}
</script>

<template>
  <MznAnchorItem
    v-for="item in resolveItems()"
    :key="item.id"
    :auto-scroll-to="item.autoScrollTo"
    :disabled="item.disabled"
    :href="item.href"
    :id="item.id"
    :name="item.name"
    :on-click="item.onClick"
    :sub-anchors="item.children"
    :title="item.title"
  />
</template>
