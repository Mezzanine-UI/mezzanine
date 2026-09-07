<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznThumbnailCardInfo from './thumbnail-card-info.vue';
import type {
  SingleThumbnailCardComponent,
  SingleThumbnailCardProps,
} from './single-thumbnail-card.types';

/**
 * 單張縮圖的卡片：一張圖片、可選的標籤與收藏按鈕，下方是資訊列。
 *
 * 卡片寬度由放進去的圖片決定。`type` 決定資訊列右側放什麼。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSingleThumbnailCard } from '@mezzanine-ui/vue/card';
 * <\/script>
 *
 * <template>
 *   <MznSingleThumbnailCard filetype="pdf" subtitle="2024/01/15" title="文件">
 *     <img alt="文件" src="/doc.jpg" />
 *   </MznSingleThumbnailCard>
 * </template>
 * ```
 *
 * @see MznFourThumbnailCard 四張縮圖的版本
 */
/**
 * React takes `component` out of the spread; Vue's fallthrough would leave it
 * on the element as an attribute.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SingleThumbnailCardProps>(), {
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

defineSlots<{
  /** The single image element. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const component = computed(
  (): SingleThumbnailCardComponent =>
    (attrs.component as SingleThumbnailCardComponent) ?? 'div',
);

const forwardedAttrs = computed(() => {
  const { class: _class, component: _component, ...rest } = attrs;

  return rest;
});

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

const overlayClass = classes.singleThumbnailOverlay;
const personalActionClass = classes.thumbnailPersonalAction;
const tagClass = classes.thumbnailTag;
const thumbnailClass = classes.singleThumbnail;
</script>

<template>
  <component :is="component" v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="thumbnailClass">
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
      <slot />
      <div :class="overlayClass" />
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
