<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  calendarYearsBase,
  getCalendarYearRange,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import type { CalendarYearsProps } from './calendar-years.types';

/**
 * 年份面板，一次顯示 12 個年份。
 *
 * 年份範圍由 `referenceDate` 所在的區間決定；點擊會送出該年第一天的日期物件。
 * 可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarYears } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarYears reference-date="2026-01-01" @click="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 依 `mode` 切換各面板
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarYearsProps>(), {
  isYearDisabled: undefined,
  isYearInRange: undefined,
  value: undefined,
});

const emit = defineEmits<{
  click: [target: DateType];
  yearHover: [target: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const start = computed(
  (): number =>
    getCalendarYearRange(calendar.value.getYear(props.referenceDate))[0],
);

const years = computed(() =>
  calendarYearsBase.map((base) => {
    const {
      getNow,
      getYear,
      isYearIncluded,
      setYear,
      getCurrentYearFirstDate,
    } = calendar.value;
    const thisYear = base + start.value;
    const yearDateType = setYear(getCurrentYearFirstDate(getNow()), thisYear);
    const disabled = props.isYearDisabled && props.isYearDisabled(yearDateType);
    const active =
      !disabled && props.value && isYearIncluded(yearDateType, props.value);
    const inRange = props.isYearInRange && props.isYearInRange(yearDateType);
    const isRangeStart =
      props.value && props.value.length > 0
        ? isYearIncluded(yearDateType, [props.value[0]])
        : false;
    const isRangeEnd =
      props.value && props.value.length > 0
        ? isYearIncluded(yearDateType, [props.value[props.value.length - 1]])
        : false;

    const ariaLabel = [
      `Year ${thisYear}`,
      active && 'Selected',
      disabled && 'Not available',
    ]
      .filter(Boolean)
      .join(', ');

    return {
      active,
      ariaLabel,
      buttonClasses: clsx(classes.button, {
        [classes.buttonActive]: active,
        [classes.buttonInRange]: inRange,
        [classes.buttonDisabled]: disabled,
      }),
      disabled,
      isRangeEnd,
      isRangeStart,
      thisYear,
      today: getYear(getNow()) === thisYear,
      yearDateType,
    };
  }),
);

const hostClasses = computed((): string =>
  clsx(classes.board, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const gridClass = classes.twelveGrid;
</script>

<template>
  <div :class="hostClasses" v-bind="forwardedAttrs">
    <div :class="gridClass">
      <MznCalendarCell
        v-for="year in years"
        :key="year.thisYear"
        :active="year.active"
        :is-range-end="year.isRangeEnd"
        :is-range-start="year.isRangeStart"
        mode="year"
        :today="year.today"
      >
        <button
          :aria-disabled="year.disabled"
          :aria-label="year.ariaLabel"
          :aria-pressed="year.active"
          :class="year.buttonClasses"
          :disabled="year.disabled"
          type="button"
          @click="emit('click', year.yearDateType)"
          @mouseenter="emit('yearHover', year.yearDateType)"
        >
          {{ year.thisYear }}
        </button>
      </MznCalendarCell>
    </div>
  </div>
</template>
