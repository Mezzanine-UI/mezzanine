<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import type { CalendarCellProps } from './calendar-cell.types';

/**
 * 日曆格子，日／週／月／季／半年／年各面板共用的最小單位。
 *
 * 只負責格子本身的狀態樣式（今天、選取、停用、區間起訖、週末、含註記），
 * 內容一律包在 `.mzn-calendar-cell__inner` 裡。可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarCell } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarCell active today>15</MznCalendarCell>
 * </template>
 * ```
 *
 * @see MznCalendarDays 使用格子排出月曆
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarCellProps>(), {
  mode: 'day',
  role: undefined,
});

defineSlots<{
  /** The cell's content. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const hostClasses = computed((): string =>
  clsx(
    classes.cell,
    classes.cellMode(props.mode),
    {
      [classes.cellToday]: props.today,
      [classes.cellActive]: props.active,
      [classes.cellDisabled]: props.disabled,
      [classes.cellWithAnnotation]: props.withAnnotation,
      [classes.cellWeekend]: props.isWeekend,
      [classes.cellRangeStart]: props.isRangeStart,
      [classes.cellRangeEnd]: props.isRangeEnd,
    },
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const innerClass = classes.cellInner;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses" :role="role">
    <span :class="innerClass"><slot /></span>
  </div>
</template>
