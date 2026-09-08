<script setup lang="ts">
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import type { DescriptionGroupProps } from './description-group.types';

/**
 * 把多個描述列排在一起。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDescription, MznDescriptionGroup } from '@mezzanine-ui/vue/description';
 * <\/script>
 *
 * <template>
 *   <MznDescriptionGroup>
 *     <MznDescription title="標題">...</MznDescription>
 *   </MznDescriptionGroup>
 * </template>
 * ```
 *
 * @see MznDescription 群組裡的單一描述列
 */
defineProps<DescriptionGroupProps>();

defineSlots<{
  /** The descriptions this group arranges. */
  default?: () => unknown;
}>();
</script>

<template>
  <div :class="classes.groupHost"><slot /></div>
</template>
