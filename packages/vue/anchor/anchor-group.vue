<script setup lang="ts">
import { getCurrentInstance, useSlots, type VNode } from 'vue';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import MznAnchor from './anchor.vue';
import { parseChildren } from './parse-children';
import type { AnchorItemData } from './anchor-item.types';
import type { AnchorGroupProps } from './anchor-group.types';

/**
 * 錨點導航群組容器。
 *
 * 可用 `anchors` 直接傳入資料，或在預設 slot 放入 `MznAnchor` 子元件。
 *
 * @example
 * ```vue
 * <MznAnchorGroup :anchors="[{ id: 's1', name: 'Section 1', href: '#s1' }]" />
 * ```
 *
 * @see MznAnchor 單一錨點
 */
const props = defineProps<AnchorGroupProps>();

defineSlots<{
  default?: () => unknown;
}>();

const slots = useSlots();
const anchorType = getCurrentInstance() ? MznAnchor : undefined;

/** See the note in anchor.vue: slots must be read at render time. */
function resolveItems(): AnchorItemData[] {
  if (props.anchors) return props.anchors;

  const nodes = (slots.default?.() ?? []) as VNode[];

  return anchorType ? parseChildren(nodes, anchorType) : [];
}

const hostClass = classes.host;
</script>

<template>
  <div :class="hostClass">
    <MznAnchor :anchors="resolveItems()" />
  </div>
</template>
