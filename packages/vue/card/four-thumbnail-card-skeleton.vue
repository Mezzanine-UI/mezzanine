<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import MznSkeleton from '../skeleton/skeleton.vue';
import type { FourThumbnailCardSkeletonProps } from './four-thumbnail-card-skeleton.types';

/**
 * MznFourThumbnailCard 的載入佔位版本。
 *
 * @see MznCardGroup loading 時渲染這一個
 */
withDefaults(defineProps<FourThumbnailCardSkeletonProps>(), {
  thumbnailWidth: 200,
});

// For four-thumbnail layout, force to '4/3' to maintain the grid layout.
const THUMBNAIL_STYLE: CSSProperties = { aspectRatio: '4/3' };
const CONTENT_STYLE: CSSProperties = { width: '100%' };

const SLOTS = [0, 1, 2, 3];

const gridClass = classes.fourThumbnail;
const hostClass = classes.thumbnail;
const infoClass = classes.thumbnailInfo;
const infoContentClass = classes.thumbnailInfoContent;
const infoMainClass = classes.thumbnailInfoMain;
const thumbnailClass = classes.fourThumbnailThumbnail;
</script>

<template>
  <div :class="hostClass">
    <div :class="gridClass">
      <MznSkeleton
        v-for="index in SLOTS"
        :key="index"
        :class="thumbnailClass"
        :style="THUMBNAIL_STYLE"
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
