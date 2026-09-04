<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznIcon from '../icon/icon.vue';
import type { CalendarControlsProps } from './calendar-controls.types';

/**
 * 日曆頂端的換頁控制列。
 *
 * 每個箭頭只有在對應事件被監聽時才會出現，兩側都沒有監聽時改渲染一個等寬的佔位區塊，
 * 讓中央的標題保持置中。中央內容由預設 slot 提供。可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarControls } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarControls @next="onNext" @prev="onPrev">
 *     <button type="button">2026</button>
 *   </MznCalendarControls>
 * </template>
 * ```
 *
 * @see MznCalendar 使用這個控制列的日曆
 */
defineOptions({ inheritAttrs: false });

defineProps<CalendarControlsProps>();

const emit = defineEmits<{
  doubleNext: [];
  doublePrev: [];
  next: [];
  prev: [];
}>();

defineSlots<{
  /** The controls' main area — usually the month and year buttons. */
  default?: () => unknown;
}>();

const attrs = useAttrs();
const hasListener = useHasListener();

const hostClasses = computed((): string =>
  clsx(classes.controls, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const actionsClass = classes.controlsActions;
const buttonClass = classes.controlsButton;
const mainClass = classes.controlsMain;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="actionsClass">
      <button
        v-if="hasListener('doublePrev')"
        aria-label="Go to previous year"
        :aria-disabled="disableOnDoublePrev"
        :class="buttonClass"
        :disabled="disableOnDoublePrev"
        title="Previous Year"
        type="button"
        @click="emit('doublePrev')"
      >
        <MznIcon aria-hidden="true" :icon="DoubleChevronLeftIcon" />
      </button>
      <button
        v-if="hasListener('prev')"
        aria-label="Go to previous month"
        :aria-disabled="disableOnPrev"
        :class="buttonClass"
        :disabled="disableOnPrev"
        title="Previous Month"
        type="button"
        @click="emit('prev')"
      >
        <MznIcon aria-hidden="true" :icon="ChevronLeftIcon" />
      </button>
      <div
        v-if="!hasListener('prev') && !hasListener('doublePrev')"
        :class="buttonClass"
        style="pointer-events: none"
      />
    </div>
    <div :class="mainClass"><slot /></div>
    <div :class="actionsClass">
      <button
        v-if="hasListener('next')"
        aria-label="Go to next month"
        :aria-disabled="disableOnNext"
        :class="buttonClass"
        :disabled="disableOnNext"
        title="Next Month"
        type="button"
        @click="emit('next')"
      >
        <MznIcon aria-hidden="true" :icon="ChevronRightIcon" />
      </button>
      <button
        v-if="hasListener('doubleNext')"
        aria-label="Go to next year"
        :aria-disabled="disableOnDoubleNext"
        :class="buttonClass"
        :disabled="disableOnDoubleNext"
        title="Next Year"
        type="button"
        @click="emit('doubleNext')"
      >
        <MznIcon aria-hidden="true" :icon="DoubleChevronRightIcon" />
      </button>
      <div
        v-if="!hasListener('next') && !hasListener('doubleNext')"
        :class="buttonClass"
        style="pointer-events: none"
      />
    </div>
  </div>
</template>
