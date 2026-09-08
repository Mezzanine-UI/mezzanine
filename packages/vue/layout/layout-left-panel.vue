<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import clsx from 'clsx';
import { toCssLength } from '../_internal/css-length';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import { MIN_PANEL_WIDTH, useSidePanelResize } from './use-side-panel-resize';
import type { LayoutLeftPanelProps } from './layout-left-panel.types';

/**
 * 版面左側的面板，可以拖曳分隔線改變寬度。
 *
 * `open` 為 false 時整個不渲染。寬度下限 240px，上限則留給主要區域至少 480px；
 * 分隔線可以聚焦，用左右方向鍵一次調 10px。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznLayoutLeftPanel } from '@mezzanine-ui/vue/layout';
 * <\/script>
 *
 * <template>
 *   <MznLayoutLeftPanel :default-width="240" open>...</MznLayoutLeftPanel>
 * </template>
 * ```
 *
 * @see MznLayoutRightPanel 右側的同款面板
 */
const props = withDefaults(defineProps<LayoutLeftPanelProps>(), {
  defaultWidth: 320,
  open: false,
  scrollbarProps: () => ({}),
});

const emit = defineEmits<{
  /** Fired with the new width while the panel is being resized. */
  widthChange: [width: number];
}>();

defineSlots<{
  /** The panel's own content. */
  default?: () => unknown;
}>();

const { isDragging, onDividerKeydown, onDividerMousedown, width } =
  useSidePanelResize({
    defaultWidth: () => props.defaultWidth,
    onWidthChange: (next) => emit('widthChange', next),
    side: 'left',
  });

const hostClasses = computed((): string =>
  clsx(classes.sidePanel, classes.sidePanelLeft),
);

/** React appends `px` to a numeric style value; Vue leaves it invalid. */
const hostStyle = computed(
  (): CSSProperties => ({ inlineSize: toCssLength(width.value) }),
);

const dividerClasses = computed((): string =>
  clsx(classes.divider, { [classes.dividerDragging]: isDragging.value }),
);

const MIN_WIDTH = MIN_PANEL_WIDTH;
</script>

<template>
  <aside
    v-if="open"
    aria-label="Left panel"
    :class="hostClasses"
    :style="hostStyle"
  >
    <div :class="classes.sidePanelContent">
      <MznScrollbar v-bind="scrollbarProps"><slot /></MznScrollbar>
    </div>
    <!--
      WAI-ARIA 1.2: a focusable separator carrying aria-valuenow is an
      interactive widget, so the tabindex and the handlers belong on it.
    -->
    <div
      aria-label="Resize left panel"
      aria-orientation="vertical"
      :aria-valuemin="MIN_WIDTH"
      :aria-valuenow="width"
      :class="dividerClasses"
      role="separator"
      :tabindex="0"
      @keydown="onDividerKeydown"
      @mousedown="onDividerMousedown"
    />
  </aside>
</template>
