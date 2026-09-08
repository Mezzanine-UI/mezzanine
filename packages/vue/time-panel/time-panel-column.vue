<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  timePanelClasses as classes,
  type TimePanelUnit,
} from '@mezzanine-ui/core/time-panel';
import clsx from 'clsx';
import { toCssLength } from '../_internal/css-length';
import { getNumericCSSVariablePixelValue } from '../_internal/css-variable';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import type { TimePanelColumnProps } from './time-panel-column.types';

/**
 * 時間面板的單一欄位（時、分或秒）。
 *
 * 上下各補三個佔位格，讓選中的單位可以捲到欄位中央；`cellHeight` 未指定時取
 * `--mzn-spacing-size-element-loose` 的計算值。第一次定位不帶動畫，之後才平滑捲動。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTimePanelColumn } from '@mezzanine-ui/vue/time-panel';
 * <\/script>
 *
 * <template>
 *   <MznTimePanelColumn :active-unit="8" :units="units" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznTimePanel 由三個欄位組成的時間面板
 */
const props = withDefaults(defineProps<TimePanelColumnProps>(), {
  activeUnit: undefined,
  cellHeight: undefined,
});

const emit = defineEmits<{
  change: [unit: TimePanelUnit];
}>();

const cellHeight = computed(
  (): number =>
    props.cellHeight ??
    getNumericCSSVariablePixelValue('--mzn-spacing-size-element-loose'),
);

const viewport = ref<HTMLDivElement | null>(null);
const preferSmoothScroll = ref(true);

function scrollToTarget(element: HTMLDivElement): void {
  const activeIndex = props.units.findIndex(
    ({ value }) => value === props.activeUnit,
  );

  element.scrollTo({
    behavior: preferSmoothScroll.value ? 'auto' : 'smooth',
    top: activeIndex * cellHeight.value,
  });

  preferSmoothScroll.value = false;
}

function handleViewportReady(element: HTMLDivElement): void {
  viewport.value = element;

  scrollToTarget(element);
}

onMounted(() => {
  if (viewport.value) scrollToTarget(viewport.value);
});

watch([() => props.activeUnit, cellHeight, () => props.units], () => {
  if (viewport.value) scrollToTarget(viewport.value);
});

// Number of padding cells needed for centering (3 cells above and below the center position)
const paddingCellCount = 3;
const placeholders = Array.from({ length: paddingCellCount }, (_, i) => i);

const placeholderStyle = computed(() => ({
  height: toCssLength(cellHeight.value),
}));

const maxHeight = computed((): number => cellHeight.value * 7);

const buttonClasses = (unit: TimePanelUnit): string =>
  clsx(classes.button, classes.columnButton, {
    [classes.buttonActive]: unit.value === props.activeUnit,
  });

const columnClass = classes.column;
const placeholderClass = classes.columnPlaceholder;
</script>

<template>
  <div :class="columnClass">
    <MznScrollbar :max-height="maxHeight" @viewport-ready="handleViewportReady">
      <div
        v-for="index in placeholders"
        :key="`placeholder-top-${index}`"
        aria-hidden="true"
        :class="placeholderClass"
        :style="placeholderStyle"
      />
      <button
        v-for="unit in units"
        :key="unit.value"
        :class="buttonClasses(unit)"
        type="button"
        @click="emit('change', unit)"
      >
        {{ unit.label }}
      </button>
      <div
        v-for="index in placeholders"
        :key="`placeholder-bottom-${index}`"
        aria-hidden="true"
        :class="placeholderClass"
        :style="placeholderStyle"
      />
    </MznScrollbar>
  </div>
</template>
