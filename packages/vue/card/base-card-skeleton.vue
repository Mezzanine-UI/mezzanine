<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import MznSkeleton from '../skeleton/skeleton.vue';
import type { BaseCardSkeletonProps } from './base-card-skeleton.types';

/**
 * MznBaseCard 的載入佔位版本。
 *
 * @see MznCardGroup loading 時渲染這一個
 */
withDefaults(defineProps<BaseCardSkeletonProps>(), {
  showContent: true,
});

const CONTENT_LINE_STYLE: CSSProperties = { marginTop: '8px' };

const hostClasses = clsx(classes.base, classes.baseReadOnly);
const contentClass = classes.baseContent;
const headerClass = classes.baseHeader;
const headerContentWrapperClass = classes.baseHeaderContentWrapper;
</script>

<template>
  <div :class="hostClasses">
    <div :class="headerClass">
      <div :class="headerContentWrapperClass">
        <MznSkeleton :height="20" width="60%" />
        <MznSkeleton :height="16" width="40%" />
      </div>
    </div>
    <div v-if="showContent" :class="contentClass">
      <MznSkeleton :height="16" width="100%" />
      <MznSkeleton :height="16" :style="CONTENT_LINE_STYLE" width="80%" />
    </div>
  </div>
</template>
