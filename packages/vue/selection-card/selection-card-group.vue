<script setup lang="ts">
import { computed } from 'vue';
import type { VNodeArrayChildren } from 'vue';
import { selectionCardClasses as classes } from '@mezzanine-ui/core/selection-card';
import { flattenChildren } from '../_internal/flatten-children';
import MznSelectionCard from './selection-card.vue';
import type { SelectionCardGroupProps } from './selection-card-group.types';

/**
 * 把多張選擇卡片排成一組。
 *
 * 內容可以用預設 slot 直接放卡片，也可以用 `selections` 以資料形式給定；
 * 兩者同時存在時以 slot 為準，與 React 讓 children 覆蓋 selections 一致。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import {
 *   MznSelectionCard,
 *   MznSelectionCardGroup,
 * } from '@mezzanine-ui/vue/selection-card';
 * <\/script>
 *
 * <template>
 *   <MznSelectionCardGroup>
 *     <MznSelectionCard selector="radio" text="方案 A" />
 *     <MznSelectionCard selector="radio" text="方案 B" />
 *   </MznSelectionCardGroup>
 * </template>
 * ```
 *
 * @see MznSelectionCard 組成這一組的卡片
 */
withDefaults(defineProps<SelectionCardGroupProps>(), {
  selections: undefined,
});

const slots = defineSlots<{
  /** The cards in the group. Only selection cards belong here. */
  default?: () => unknown;
}>();

/**
 * What the slot actually renders, not whether one was passed: React branches
 * on `children` being present, and a slot whose only content is a false `v-if`
 * still leaves a comment placeholder behind.
 */
const hasChildren = computed((): boolean =>
  Boolean(
    flattenChildren(slots.default?.() as VNodeArrayChildren | undefined).length,
  ),
);

const groupClass = classes.group;
</script>

<template>
  <div :class="groupClass">
    <slot v-if="hasChildren" />
    <MznSelectionCard
      v-for="(selection, index) in selections ?? []"
      v-else
      :key="selection.value || index"
      v-bind="selection"
    />
  </div>
</template>
