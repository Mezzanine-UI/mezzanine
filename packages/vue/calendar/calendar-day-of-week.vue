<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import type { CalendarDayOfWeekProps } from './calendar-day-of-week.types';

/**
 * 月曆頂端的星期標題列。
 *
 * 星期名稱與週末判定都取自 calendar context 的 `displayWeekDayLocale`，
 * 因此第一天是週日或週一由語系決定。可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarDayOfWeek } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarDayOfWeek display-week-day-locale="en-GB" />
 * </template>
 * ```
 *
 * @see MznCalendarDays 月曆本體
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarDayOfWeekProps>(), {
  displayWeekDayLocale: undefined,
});

const calendar = useCalendarContext();
const attrs = useAttrs();

const displayWeekDayLocale = computed(
  (): string => props.displayWeekDayLocale ?? calendar.value.locale,
);

const weekDayNames = computed((): string[] =>
  calendar.value.getWeekDayNames(displayWeekDayLocale.value),
);

const weekends = computed((): boolean[] =>
  calendar.value.getWeekends(displayWeekDayLocale.value),
);

const hostClasses = computed((): string =>
  clsx(classes.row, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});
</script>

<template>
  <div
    aria-label="Days of the week"
    :class="hostClasses"
    role="row"
    v-bind="forwardedAttrs"
  >
    <MznCalendarCell
      v-for="(name, index) in weekDayNames"
      :key="`CALENDAR_DAY_OF_WEEK/${name}-${index}`"
      :is-weekend="weekends[index]"
      role="columnheader"
    >
      {{ name }}
    </MznCalendarCell>
  </div>
</template>
