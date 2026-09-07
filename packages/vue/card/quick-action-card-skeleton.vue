<script setup lang="ts">
import { computed } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import MznSkeleton from '../skeleton/skeleton.vue';
import type { QuickActionCardSkeletonProps } from './quick-action-card-skeleton.types';

/**
 * MznQuickActionCard 的載入佔位版本。
 *
 * @see MznCardGroup loading 時渲染這一個
 */
const props = withDefaults(defineProps<QuickActionCardSkeletonProps>(), {
  mode: 'horizontal',
});

const hostClasses = computed((): string =>
  clsx(
    classes.quickAction,
    classes.quickActionReadOnly,
    props.mode === 'vertical' && classes.quickActionVertical,
  ),
);

const contentClass = classes.quickActionContent;
</script>

<template>
  <div :class="hostClasses">
    <MznSkeleton circle :height="24" :width="24" />
    <div :class="contentClass">
      <MznSkeleton :height="20" width="70%" />
      <MznSkeleton :height="16" width="50%" />
    </div>
  </div>
</template>
