<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@mezzanine-ui/icons';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznClearActions from '../clear-actions/clear-actions.vue';
import MznIcon from '../icon/icon.vue';
import MznFade from '../transition/fade.vue';
import { useModalContainer } from './use-modal-container';
import type { MediaPreviewModalProps } from './media-preview-modal.types';

/**
 * 媒體預覽對話框，把一組圖片或節點鋪滿畫面並提供前後切換。
 *
 * 給 `currentIndex` 並監聽 `next` / `prev` 就是受控模式，索引完全由外部決定；
 * 否則元件自己記住索引，`enableCircularNavigation` 可讓頭尾相接，索引變動時
 * 發出 `index-change`。切換時新舊圖片交叉淡入淡出，並會預先載入相鄰的圖片。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznMediaPreviewModal } from '@mezzanine-ui/vue/modal';
 * <\/script>
 *
 * <template>
 *   <MznMediaPreviewModal
 *     :media-items="urls"
 *     :open="open"
 *     @close="open = false"
 *   />
 * </template>
 * ```
 *
 * @see MznModal 一般用途的對話框
 */
/**
 * React spreads its rest props onto the dialog element inside the container,
 * and `backdropClassName` onto the container itself.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MediaPreviewModalProps>(), {
  backdropClassName: undefined,
  container: undefined,
  currentIndex: undefined,
  defaultIndex: 0,
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  disableNext: false,
  disablePortal: false,
  disablePrev: false,
  enableCircularNavigation: false,
  open: undefined,
  showPaginationIndicator: true,
});

const emit = defineEmits<{
  backdropClick: [event: MouseEvent];
  close: [];
  indexChange: [index: number];
  next: [];
  prev: [];
}>();

const hasListener = useHasListener();

const { Container: MznModalContainer } = useModalContainer();

// Determine if component is in controlled mode
const isControlled = computed((): boolean => props.currentIndex !== undefined);

// Internal state for uncontrolled mode
const internalIndex = ref(props.defaultIndex);

// Use controlled index if provided, otherwise use internal state
const currentIndex = computed((): number =>
  isControlled.value ? (props.currentIndex as number) : internalIndex.value,
);

// Reset internal index when modal opens in uncontrolled mode
watch(
  [() => props.open, isControlled, () => props.defaultIndex],
  () => {
    if (props.open && !isControlled.value) {
      internalIndex.value = props.defaultIndex;
    }
  },
  { immediate: true },
);

// Built-in navigation handlers for uncontrolled mode
function handleNext(): void {
  if (hasListener('next')) {
    // Controlled mode: hand it to the consumer
    emit('next');

    return;
  }

  // Uncontrolled mode: update internal state
  const nextIndex = props.enableCircularNavigation
    ? (currentIndex.value + 1) % props.mediaItems.length
    : Math.min(currentIndex.value + 1, props.mediaItems.length - 1);

  internalIndex.value = nextIndex;
  emit('indexChange', nextIndex);
}

function handlePrev(): void {
  if (hasListener('prev')) {
    // Controlled mode: hand it to the consumer
    emit('prev');

    return;
  }

  // Uncontrolled mode: update internal state
  const prevIndex = props.enableCircularNavigation
    ? (currentIndex.value - 1 + props.mediaItems.length) %
      props.mediaItems.length
    : Math.max(currentIndex.value - 1, 0);

  internalIndex.value = prevIndex;
  emit('indexChange', prevIndex);
}

// Auto-calculate disable states for uncontrolled mode
const isNextDisabled = computed((): boolean =>
  props.enableCircularNavigation
    ? false
    : props.disableNext || currentIndex.value >= props.mediaItems.length - 1,
);

const isPrevDisabled = computed((): boolean =>
  props.enableCircularNavigation
    ? false
    : props.disablePrev || currentIndex.value <= 0,
);

const displayedIndices = ref<number[]>([currentIndex.value]);
const activeIndex = ref<number>(currentIndex.value);
const preloadedUrls = new Set<string>();

// Helper function to preload a single image
function preloadImage(url: string): void {
  if (preloadedUrls.has(url)) return;

  const img = new Image();

  img.src = url;
  preloadedUrls.add(url);
}

// Preload images: prioritize current and adjacent, then load others
watchEffect((onCleanup) => {
  if (!props.open) return;

  const items = props.mediaItems;
  const index = currentIndex.value;

  // Priority 1: Current and adjacent images
  const priorityIndices = [index - 1, index, index + 1].filter(
    (idx) => idx >= 0 && idx < items.length,
  );

  priorityIndices.forEach((idx) => {
    const media = items[idx];

    if (typeof media === 'string') {
      preloadImage(media);
    }
  });

  // Priority 2: All other images (load after a short delay)
  const loadRemainingTimer = setTimeout(() => {
    items.forEach((media, idx) => {
      if (typeof media === 'string' && !priorityIndices.includes(idx)) {
        preloadImage(media);
      }
    });
  }, 500);

  onCleanup(() => clearTimeout(loadRemainingTimer));
});

/**
 * The outgoing image has to stay mounted while the incoming one fades in, and
 * the incoming one has to render once with `in="false"` before it can animate
 * — hence the two frames before `activeIndex` moves.
 */
watch(
  [currentIndex, activeIndex],
  (_value, _previous, onCleanup) => {
    if (currentIndex.value === activeIndex.value) return;

    // First, add new index to displayedIndices (will render with in=false)
    if (!displayedIndices.value.includes(currentIndex.value)) {
      displayedIndices.value = [...displayedIndices.value, currentIndex.value];
    }

    // Use requestAnimationFrame to ensure DOM is updated before triggering animation
    let rafId1: number | null = null;
    let rafId2: number | null = null;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        activeIndex.value = currentIndex.value;
      });
    });

    // Clean up old images after transition completes
    const cleanupTimer = setTimeout(() => {
      displayedIndices.value = [currentIndex.value];
    }, MOTION_DURATION.fast + 100);

    onCleanup(() => {
      clearTimeout(cleanupTimer);

      if (rafId1 !== null) {
        cancelAnimationFrame(rafId1);
      }

      if (rafId2 !== null) {
        cancelAnimationFrame(rafId2);
      }
    });
  },
  { immediate: true },
);

const FADE_DURATION = {
  enter: MOTION_DURATION.fast,
  exit: MOTION_DURATION.fast,
};

const FADE_EASING = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

const hostClasses = computed((): string =>
  clsx(classes.host, classes.mediaPreview),
);

const prevButtonClasses = clsx(
  classes.mediaPreviewNavButton,
  classes.mediaPreviewNavButtonPrev,
);

const nextButtonClasses = clsx(
  classes.mediaPreviewNavButton,
  classes.mediaPreviewNavButtonNext,
);

const closeButtonClass = classes.mediaPreviewCloseButton;
const contentClass = classes.mediaPreviewContent;
const imageClass = classes.mediaPreviewImage;
const mediaContainerClass = classes.mediaPreviewMediaContainer;
const paginationIndicatorClass = classes.mediaPreviewPaginationIndicator;
</script>

<template>
  <MznModalContainer
    :class="backdropClassName"
    :container="container"
    :disable-close-on-backdrop-click="disableCloseOnBackdropClick"
    :disable-close-on-escape-key-down="disableCloseOnEscapeKeyDown"
    :disable-portal="disablePortal"
    :open="open"
    @backdrop-click="emit('backdropClick', $event)"
    @close="emit('close')"
  >
    <div v-bind="$attrs" :class="hostClasses" role="dialog">
      <div :class="contentClass">
        <div :class="mediaContainerClass">
          <template v-for="index in displayedIndices" :key="index">
            <MznFade
              v-if="index >= 0 && index < mediaItems.length"
              :duration="FADE_DURATION"
              :easing="FADE_EASING"
              :in="index === activeIndex"
            >
              <img
                v-if="typeof mediaItems[index] === 'string'"
                :alt="`Media ${index + 1}`"
                :class="imageClass"
                :src="mediaItems[index] as string"
              />
              <div v-else :class="imageClass">
                <component :is="() => mediaItems[index]" />
              </div>
            </MznFade>
          </template>
        </div>
      </div>
    </div>
    <MznClearActions
      :class="closeButtonClass"
      type="embedded"
      variant="contrast"
      @click="emit('close')"
    />
    <button
      v-if="mediaItems.length > 1"
      :aria-disabled="isPrevDisabled"
      aria-label="Previous media"
      :class="prevButtonClasses"
      :disabled="isPrevDisabled"
      title="Previous"
      type="button"
      @click="handlePrev"
    >
      <MznIcon color="fixed-light" :icon="ChevronLeftIcon" :size="16" />
    </button>
    <button
      v-if="mediaItems.length > 1"
      :aria-disabled="isNextDisabled"
      aria-label="Next media"
      :class="nextButtonClasses"
      :disabled="isNextDisabled"
      title="Next"
      type="button"
      @click="handleNext"
    >
      <MznIcon color="fixed-light" :icon="ChevronRightIcon" :size="16" />
    </button>
    <div
      v-if="showPaginationIndicator && mediaItems.length > 1"
      :aria-label="`Page ${currentIndex + 1} of ${mediaItems.length}`"
      :class="paginationIndicatorClass"
    >
      <component
        :is="() => [String(currentIndex + 1), '/', String(mediaItems.length)]"
      />
    </div>
  </MznModalContainer>
</template>
