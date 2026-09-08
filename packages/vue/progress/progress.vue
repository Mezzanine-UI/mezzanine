<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import {
  progressClasses as classes,
  ProgressStatuses,
  ProgressTypes,
} from '@mezzanine-ui/core/progress';
import type { ProgressStatus } from '@mezzanine-ui/core/progress';
import { CheckedFilledIcon, DangerousFilledIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import type { ProgressProps } from './progress.types';

/**
 * 進度條元件，支援百分比文字與狀態圖示兩種顯示類型。
 *
 * `percent` 介於 0～100，未達 100 時狀態自動為 `enabled`，達到 100 時自動切換為 `success`。
 * 可強制指定 `status` 為 `error` 以顯示錯誤圖示；使用 `tick` prop 可在進度條上標記特定位置。
 * 支援 `icons` prop 自訂 success 與 error 狀態的圖示。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznProgress } from '@mezzanine-ui/vue/progress';
 * <\/script>
 *
 * <template>
 *   <MznProgress :percent="60" />
 *   <MznProgress :percent="75" type="percent" />
 *   <MznProgress :percent="40" status="error" type="icon" />
 *   <MznProgress :percent="60" :tick="80" />
 * </template>
 * ```
 *
 * @see MznSpin 載入旋轉元件
 */
const props = withDefaults(defineProps<ProgressProps>(), {
  icons: undefined,
  percent: 0,
  percentProps: undefined,
  status: undefined,
  tick: undefined,
  type: 'progress',
});

const status = computed(
  (): ProgressStatus =>
    props.status ??
    (props.percent < 100 ? ProgressStatuses.enabled : ProgressStatuses.success),
);

const percentLimited = computed((): number =>
  Math.max(0, Math.min(100, props.percent)),
);

const icon = computed((): IconDefinition => {
  if (status.value === ProgressStatuses.success) {
    return props.icons?.success ?? CheckedFilledIcon;
  }

  return props.icons?.error ?? DangerousFilledIcon;
});

const isSuccessStatus = computed(
  (): boolean =>
    status.value === ProgressStatuses.success &&
    props.type === ProgressTypes.icon,
);
const isErrorStatus = computed(
  (): boolean =>
    status.value === ProgressStatuses.error &&
    props.type === ProgressTypes.icon,
);
const isActiveTick = computed(
  (): boolean => props.tick !== undefined && props.tick > 0 && props.tick < 100,
);

const tickPosition = computed((): number | undefined => {
  if (!isActiveTick.value || props.tick === undefined) return undefined;

  return Math.max(0, Math.min(100, props.tick));
});

const line = ref<HTMLDivElement | null>(null);
const tickLeft = ref<string | undefined>(undefined);

let resizeObserver: ResizeObserver | null = null;
let updateTickPosition: (() => void) | null = null;

function teardownTick(): void {
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (updateTickPosition) {
    window.removeEventListener('resize', updateTickPosition);
    updateTickPosition = null;
  }
}

/**
 * The tick sits on the container, not on the line, so its offset has to be
 * translated from a percentage of the line into a percentage of the container.
 */
watch(
  [isActiveTick, tickPosition, () => props.type, percentLimited, line],
  () => {
    teardownTick();

    const lineElement = line.value;

    if (
      !isActiveTick.value ||
      tickPosition.value === undefined ||
      !lineElement
    ) {
      tickLeft.value = undefined;

      return;
    }

    const containerElement = lineElement.parentElement;

    if (!containerElement) {
      tickLeft.value = undefined;

      return;
    }

    updateTickPosition = (): void => {
      const lineRect = lineElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      // 計算 line 相對於容器的位置和寬度
      const lineLeft = lineRect.left - containerRect.left;
      const lineWidth = lineRect.width;

      // 計算 tick 在 line 中的位置（百分比轉換為像素）
      const tickOffsetInLine = ((tickPosition.value ?? 0) / 100) * lineWidth;

      // 計算 tick 相對於容器的絕對位置
      const tickAbsoluteLeft = lineLeft + tickOffsetInLine;

      // 轉換為百分比（相對於容器）
      const containerWidth = containerRect.width;

      tickLeft.value = `${(tickAbsoluteLeft / containerWidth) * 100}%`;
    };

    // 初始計算
    updateTickPosition();
    window.addEventListener('resize', updateTickPosition);

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateTickPosition?.());
      resizeObserver.observe(lineElement);
      resizeObserver.observe(containerElement);
    }
  },
  { flush: 'post', immediate: true },
);

onBeforeUnmount(teardownTick);

const hostClasses = computed((): string =>
  clsx(classes.host, classes.type(props.type), {
    [classes.success]: status.value === ProgressStatuses.success,
    [classes.error]: status.value === ProgressStatuses.error,
  }),
);

const lineStyle = computed(
  (): CSSProperties => ({ width: `${percentLimited.value}%` }),
);

const tickStyle = computed(
  (): CSSProperties => ({ '--tick-position': tickLeft.value }) as CSSProperties,
);

const lineVariantClass = classes.lineVariant;
const lineBgClass = classes.lineBg;
const infoPercentClass = classes.infoPercent;
const infoIconClass = classes.infoIcon;
const tickClass = classes.tick;
</script>

<template>
  <div :class="hostClasses">
    <div ref="line" :class="lineVariantClass">
      <i :class="lineBgClass" :style="lineStyle" />
    </div>
    <MznTypography
      v-if="type === 'percent'"
      variant="input"
      v-bind="percentProps"
      :class="infoPercentClass"
    >
      {{ `${percentLimited}%` }}
    </MznTypography>
    <MznIcon
      v-if="isSuccessStatus || isErrorStatus"
      :class="infoIconClass"
      :icon="icon"
    />
    <div
      v-if="isActiveTick && tickLeft !== undefined"
      :class="tickClass"
      :style="tickStyle"
    />
  </div>
</template>
