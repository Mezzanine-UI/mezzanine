<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';
import { flip, offset, shift } from '@floating-ui/dom';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import { getNumericCSSVariablePixelValue } from '../_internal/css-variable';
import MznPopper from '../popper/popper.vue';
import type { PopperArrow, PopperOptions } from '../popper/popper.types';
import MznTag from '../tag/tag.vue';
import MznFade from '../transition/fade.vue';
import type { OverflowTooltipProps } from './overflow-tooltip.types';

/**
 * 收合標籤的浮層：把放不下的標籤攤開成一列可關閉的標籤。
 *
 * 依 `anchor` 定位並帶箭頭，內容淡入淡出；淡出結束後才真正收起 Popper。
 * 開啟後會量測每一列標籤的寬度，把浮層寬度收到最寬的那一列，避免最後一列留下大片空白。
 * `readOnly` 時改渲染靜態標籤，沒有關閉按鈕。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznOverflowTooltip } from '@mezzanine-ui/vue/overflow-tooltip';
 * <\/script>
 *
 * <template>
 *   <MznOverflowTooltip
 *     :anchor="anchor"
 *     :open="open"
 *     :tags="['Tag 1', 'Tag 2']"
 *     @tag-dismiss="remove"
 *   />
 * </template>
 * ```
 *
 * @see MznOverflowCounterTag 觸發這個浮層的計數標籤
 */
const props = withDefaults(defineProps<OverflowTooltipProps>(), {
  placement: 'top-start',
  readOnly: undefined,
  tagSize: undefined,
});

const emit = defineEmits<{
  /** Fired when a tag's dismiss icon is clicked, returning the removed tag's index for syncing state. */
  tagDismiss: [tagIndex: number];
}>();

const offsetValue = getNumericCSSVariablePixelValue(
  `--${spacingPrefix}-gap-base`,
);
const arrowHeight = getNumericCSSVariablePixelValue(
  `--${spacingPrefix}-size-element-tight`,
);
const arrowPadding = getNumericCSSVariablePixelValue(
  `--${spacingPrefix}-padding-horizontal-comfort`,
);

/**
 * React orders the middleware by whether the placement carries an alignment:
 * an aligned placement flips first, a bare side shifts first.
 */
const popperOptions = computed((): PopperOptions => {
  const middleware = [offset({ mainAxis: offsetValue + arrowHeight })];
  const flipMiddleware = flip({
    crossAxis: 'alignment',
    fallbackAxisSideDirection: 'end',
  });
  const shiftMiddleware = shift();

  if (props.placement.includes('-')) {
    middleware.push(flipMiddleware, shiftMiddleware);
  } else {
    middleware.push(shiftMiddleware, flipMiddleware);
  }

  return { middleware, placement: props.placement };
});

const arrow = computed(
  (): PopperArrow => ({
    className: classes.arrow,
    enabled: true,
    padding: arrowPadding,
  }),
);

const popperOpen = ref(false);
const content = ref<HTMLElement | null>(null);

/**
 * Measure the rendered rows and shrink the tooltip to the widest one, so a
 * short last row does not leave the popper stretched to its wrapping width.
 */
watch(
  [() => props.tags, popperOpen, () => props.tagSize, () => props.readOnly],
  (_value, _old, onCleanup) => {
    if (!popperOpen.value) return;

    const rafId = requestAnimationFrame(() => {
      const element = content.value;

      if (!element) return;

      element.style.width = '';

      const children = Array.from(element.children) as HTMLElement[];

      if (!children.length) return;

      const rows = new Map<number, HTMLElement[]>();

      children.forEach((child) => {
        const top = Math.round(child.getBoundingClientRect().top);

        if (!rows.has(top)) rows.set(top, []);

        const row = rows.get(top);

        if (row) row.push(child);
      });

      const style = getComputedStyle(element);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const contentLeft = element.getBoundingClientRect().left;
      let maxRowWidth = 0;

      rows.forEach((rowItems) => {
        const lastItem = rowItems[rowItems.length - 1];
        const rowWidth =
          lastItem.getBoundingClientRect().right - contentLeft - paddingLeft;

        maxRowWidth = Math.max(maxRowWidth, rowWidth);
      });

      element.style.width = `${maxRowWidth + paddingLeft + paddingRight}px`;
    });

    onCleanup(() => cancelAnimationFrame(rafId));
  },
  { flush: 'post' },
);

watch(
  () => props.open,
  (open) => {
    if (open) popperOpen.value = true;
  },
  { immediate: true },
);

const popper = ref<InstanceType<typeof MznPopper> | null>(null);

/**
 * React forwards a ref to the popper host element; the same element is exposed
 * here, read through the floating controller because a template ref cannot see
 * through the Teleport.
 */
defineExpose({
  element: computed(
    (): HTMLElement | null =>
      (popper.value?.controllerRef.elements.floating.value as HTMLElement) ??
      null,
  ),
});

const fadeDuration = {
  enter: MOTION_DURATION.fast,
  exit: MOTION_DURATION.fast,
};
const fadeEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

const hostClass = classes.host;
const contentClass = classes.content;
</script>

<template>
  <MznPopper
    ref="popper"
    :anchor="anchor"
    :arrow="arrow"
    :class="hostClass"
    :open="popperOpen"
    :options="popperOptions"
  >
    <MznFade
      :duration="fadeDuration"
      :easing="fadeEasing"
      :in="open"
      @exited="popperOpen = false"
    >
      <div ref="content" :class="contentClass">
        <MznTag
          v-for="(tag, index) in tags"
          :key="readOnly ? `static-${index}` : `dismissable-${index}`"
          :label="tag"
          :read-only="readOnly ? true : undefined"
          :size="tagSize"
          :type="readOnly ? 'static' : 'dismissable'"
          @close="emit('tagDismiss', index)"
        />
      </div>
    </MznFade>
  </MznPopper>
</template>
