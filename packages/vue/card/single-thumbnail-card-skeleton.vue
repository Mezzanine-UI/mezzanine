<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import MznSkeleton from '../skeleton/skeleton.vue';
import type { SingleThumbnailCardSkeletonProps } from './single-thumbnail-card-skeleton.types';

/**
 * MznSingleThumbnailCard 的載入佔位版本。
 *
 * @see MznCardGroup loading 時渲染這一個
 */
const props = withDefaults(defineProps<SingleThumbnailCardSkeletonProps>(), {
  thumbnailAspectRatio: '16/9',
  thumbnailWidth: 'var(--mzn-spacing-size-container-slim)',
});

const thumbnailStyle = computed(
  (): CSSProperties => ({ aspectRatio: props.thumbnailAspectRatio }),
);

const CONTENT_STYLE: CSSProperties = { width: '100%' };

const hostClass = classes.thumbnail;
const infoClass = classes.thumbnailInfo;
const infoContentClass = classes.thumbnailInfoContent;
const infoMainClass = classes.thumbnailInfoMain;
const thumbnailClass = classes.singleThumbnail;
</script>

<template>
  <div :class="hostClass">
    <div :class="thumbnailClass">
      <MznSkeleton
        height="100%"
        :style="thumbnailStyle"
        :width="thumbnailWidth"
      />
    </div>
    <div :class="infoClass">
      <div :class="infoMainClass">
        <div :class="infoContentClass" :style="CONTENT_STYLE">
          <MznSkeleton :height="20" width="100%" />
          <MznSkeleton :height="16" width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>
