<script setup lang="ts">
import { computed } from 'vue';
import { sectionGroupClasses as classes } from '@mezzanine-ui/core/section';
import clsx from 'clsx';
import type { SectionGroupProps } from './section-group.types';

/**
 * 把多個區塊排在一起，維持一致的間距。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSection, MznSectionGroup } from '@mezzanine-ui/vue/section';
 * <\/script>
 *
 * <template>
 *   <MznSectionGroup direction="horizontal">
 *     <MznSection>...</MznSection>
 *   </MznSectionGroup>
 * </template>
 * ```
 *
 * @see MznSection 群組裡的單一區塊
 */
const props = withDefaults(defineProps<SectionGroupProps>(), {
  direction: 'vertical',
});

defineSlots<{
  /** The sections this group arranges. */
  default?: () => unknown;
}>();

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    props.direction === 'horizontal' && classes.hostHorizontal,
  ),
);
</script>

<template>
  <div :class="hostClasses"><slot /></div>
</template>
