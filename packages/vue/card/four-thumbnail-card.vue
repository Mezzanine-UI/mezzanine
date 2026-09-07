<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { VNode, VNodeArrayChildren } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznIcon from '../icon/icon.vue';
import MznThumbnail from './thumbnail.vue';
import MznThumbnailCardInfo from './thumbnail-card-info.vue';
import type {
  FourThumbnailCardComponent,
  FourThumbnailCardProps,
} from './four-thumbnail-card.types';

/**
 * 四張縮圖排成 2x2 的卡片，可加標籤與收藏按鈕，下方是資訊列。
 *
 * 子項必須是 MznThumbnail：不足四個會補上空格子，超過四個只取前四個並在開發
 * 模式下提醒。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFourThumbnailCard, MznThumbnail } from '@mezzanine-ui/vue/card';
 * <\/script>
 *
 * <template>
 *   <MznFourThumbnailCard subtitle="4 items" title="相簿">
 *     <MznThumbnail v-for="photo in photos" :key="photo.id" :title="photo.name">
 *       <img :alt="photo.name" :src="photo.src" />
 *     </MznThumbnail>
 *   </MznFourThumbnailCard>
 * </template>
 * ```
 *
 * @see MznThumbnail 每一格縮圖
 * @see MznSingleThumbnailCard 單張縮圖的版本
 */
/**
 * React takes `component` out of the spread; Vue's fallthrough would leave it
 * on the element as an attribute.
 */
defineOptions({ inheritAttrs: false });

const MAX_THUMBNAILS = 4;

const props = withDefaults(defineProps<FourThumbnailCardProps>(), {
  actionName: undefined,
  filetype: undefined,
  options: undefined,
  personalActionActive: false,
  personalActionActiveIcon: undefined,
  personalActionIcon: undefined,
  personalActionOnClick: undefined,
  subtitle: undefined,
  tag: undefined,
  type: 'default',
});

const emit = defineEmits<{
  actionClick: [event: MouseEvent];
  optionSelect: [option: DropdownOption];
}>();

const slots = defineSlots<{
  /** One to four thumbnails. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const component = computed(
  (): FourThumbnailCardComponent =>
    (attrs.component as FourThumbnailCardComponent) ?? 'div',
);

const forwardedAttrs = computed(() => {
  const { class: _class, component: _component, ...rest } = attrs;

  return rest;
});

const thumbnails = computed((): VNode[] => {
  const children = flattenChildren(
    slots.default?.() as VNodeArrayChildren | undefined,
  );

  const valid = children.filter((child) => {
    const isThumbnail = child.type === MznThumbnail;

    if (!isThumbnail && process.env.NODE_ENV !== 'production') {
      const type = child.type as { displayName?: string; name?: string };
      const displayName =
        typeof child.type === 'string'
          ? child.type
          : (type.displayName ?? type.name ?? 'Unknown');

      console.warn(
        `[FourThumbnailCard] Invalid child type: <${displayName}>. ` +
          'FourThumbnailCard only accepts Thumbnail components as children.',
      );
    }

    return isThumbnail;
  });

  if (valid.length > MAX_THUMBNAILS && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[FourThumbnailCard] Received ${valid.length} Thumbnail children, ` +
        `but only the first ${MAX_THUMBNAILS} will be rendered.`,
    );
  }

  return valid.slice(0, MAX_THUMBNAILS);
});

const emptySlots = computed((): number[] =>
  Array.from(
    { length: MAX_THUMBNAILS - thumbnails.value.length },
    (_, index) => index,
  ),
);

const hasPersonalAction = computed((): boolean =>
  Boolean(props.personalActionIcon),
);

const currentPersonalActionIcon = computed((): IconDefinition | undefined =>
  props.personalActionActive
    ? (props.personalActionActiveIcon ?? props.personalActionIcon)
    : props.personalActionIcon,
);

function handlePersonalActionClick(event: MouseEvent): void {
  event.stopPropagation();
  props.personalActionOnClick?.(event, props.personalActionActive);
}

const hostClasses = computed((): string =>
  clsx(classes.thumbnail, attrs.class as string),
);

const emptyClasses = clsx(
  classes.fourThumbnailThumbnail,
  classes.fourThumbnailThumbnailEmpty,
);

const gridClass = classes.fourThumbnail;
const personalActionClass = classes.thumbnailPersonalAction;
const tagClass = classes.thumbnailTag;
</script>

<template>
  <component :is="component" v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="gridClass">
      <div v-if="tag" :class="tagClass">{{ tag }}</div>
      <button
        v-if="hasPersonalAction && currentPersonalActionIcon"
        aria-label="Personal Action"
        :class="personalActionClass"
        type="button"
        @click="handlePersonalActionClick"
      >
        <MznIcon :icon="currentPersonalActionIcon" :size="16" />
      </button>
      <component :is="() => thumbnails" />
      <div
        v-for="index in emptySlots"
        :key="`empty-${index}`"
        :class="emptyClasses"
      />
    </div>
    <MznThumbnailCardInfo
      :action-name="type === 'action' ? actionName : undefined"
      :filetype="filetype"
      :options="type === 'overflow' ? options : undefined"
      :subtitle="subtitle"
      :title="title"
      :type="type"
      @action-click="emit('actionClick', $event)"
      @option-select="emit('optionSelect', $event)"
    />
  </component>
</template>
