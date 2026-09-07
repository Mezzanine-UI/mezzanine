<script setup lang="ts">
import { computed } from 'vue';
import type { Component, VNode, VNodeArrayChildren } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznBaseCardSkeleton from './base-card-skeleton.vue';
import MznBaseCard from './base-card.vue';
import MznFourThumbnailCardSkeleton from './four-thumbnail-card-skeleton.vue';
import MznFourThumbnailCard from './four-thumbnail-card.vue';
import MznQuickActionCardSkeleton from './quick-action-card-skeleton.vue';
import MznQuickActionCard from './quick-action-card.vue';
import MznSingleThumbnailCardSkeleton from './single-thumbnail-card-skeleton.vue';
import MznSingleThumbnailCard from './single-thumbnail-card.vue';
import type { CardGroupLoadingType, CardGroupProps } from './card-group.types';

/**
 * 把多張卡片排成一列的容器。
 *
 * 以 CSS Grid 排版，最小寬度依第一張卡片的種類決定。`loading` 時改為渲染對應
 * 種類的骨架，數量由 `loadingCount` 決定。只接受四種卡片作為子項，放別的會被
 * 丟掉並在主控台提醒。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCardGroup, MznBaseCard } from '@mezzanine-ui/vue/card';
 * <\/script>
 *
 * <template>
 *   <MznCardGroup>
 *     <MznBaseCard title="A">內容</MznBaseCard>
 *     <MznBaseCard title="B">內容</MznBaseCard>
 *   </MznCardGroup>
 *
 *   <MznCardGroup loading loading-type="base" :loading-count="3" />
 * </template>
 * ```
 *
 * @see MznBaseCard 可以放進來的卡片之一
 */
const props = withDefaults(defineProps<CardGroupProps>(), {
  loading: false,
  loadingCount: 3,
  loadingThumbnailAspectRatio: undefined,
  loadingThumbnailWidth: undefined,
  loadingType: undefined,
});

const slots = defineSlots<{
  /** The cards. Only the four card components belong here. */
  default?: () => unknown;
}>();

const ALLOWED_CARD_TYPES: Component[] = [
  MznBaseCard,
  MznFourThumbnailCard,
  MznQuickActionCard,
  MznSingleThumbnailCard,
];

const children = computed((): VNode[] =>
  flattenChildren(slots.default?.() as VNodeArrayChildren | undefined),
);

const firstCardType = computed((): Component | null => {
  for (const child of children.value) {
    if (child.type === MznQuickActionCard) return MznQuickActionCard;
    if (child.type === MznBaseCard) return MznBaseCard;
    if (child.type === MznSingleThumbnailCard) return MznSingleThumbnailCard;
    if (child.type === MznFourThumbnailCard) return MznFourThumbnailCard;
  }

  return null;
});

const validChildren = computed((): VNode[] =>
  children.value.filter((child) => {
    if (ALLOWED_CARD_TYPES.includes(child.type as Component)) return true;

    const type = child.type as { displayName?: string; name?: string };
    const displayName =
      typeof child.type === 'string'
        ? child.type
        : (type.displayName ?? type.name ?? 'Unknown');

    console.warn(
      `[CardGroup] Invalid child type: <${displayName}>. ` +
        'CardGroup only accepts Card components (BaseCard, FourThumbnailCard, QuickActionCard, SingleThumbnailCard) as children.',
    );

    return false;
  }),
);

const skeletonComponent = computed((): Component => {
  switch (props.loadingType) {
    case 'four-thumbnail':
      return MznFourThumbnailCardSkeleton;

    case 'quick-action':
      return MznQuickActionCardSkeleton;

    case 'single-thumbnail':
      return MznSingleThumbnailCardSkeleton;

    default:
      return MznBaseCardSkeleton;
  }
});

const thumbnailSkeletonProps = computed(() =>
  props.loadingType === 'single-thumbnail' ||
  props.loadingType === 'four-thumbnail'
    ? {
        ...(props.loadingThumbnailAspectRatio && {
          thumbnailAspectRatio: props.loadingThumbnailAspectRatio,
        }),
        ...(props.loadingThumbnailWidth && {
          thumbnailWidth: props.loadingThumbnailWidth,
        }),
      }
    : undefined,
);

const skeletons = computed((): number[] =>
  props.loading && props.loadingType
    ? Array.from({ length: props.loadingCount }, (_, index) => index)
    : [],
);

const groupClassFromLoadingType = (
  loadingType: CardGroupLoadingType,
): string | undefined => {
  switch (loadingType) {
    case 'four-thumbnail':
      return classes.groupFourThumbnail;

    case 'quick-action':
      return classes.groupQuickAction;

    case 'single-thumbnail':
      return classes.groupSingleThumbnail;

    default:
      return undefined;
  }
};

const hostClasses = computed((): string => {
  const modifier =
    props.loadingType && props.loading
      ? groupClassFromLoadingType(props.loadingType)
      : undefined;

  return clsx(classes.group, {
    [classes.groupFourThumbnail]:
      firstCardType.value === MznFourThumbnailCard ||
      modifier === classes.groupFourThumbnail,
    [classes.groupQuickAction]:
      firstCardType.value === MznQuickActionCard ||
      modifier === classes.groupQuickAction,
    [classes.groupSingleThumbnail]:
      firstCardType.value === MznSingleThumbnailCard ||
      modifier === classes.groupSingleThumbnail,
  });
});
</script>

<template>
  <div :class="hostClasses">
    <component :is="() => validChildren" />
    <component
      :is="skeletonComponent"
      v-for="index in skeletons"
      :key="`skeleton-${index}`"
      v-bind="thumbnailSkeletonProps"
    />
  </div>
</template>
