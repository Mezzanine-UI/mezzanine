<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  calendarMonths,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import type { CalendarMonthsProps } from './calendar-months.types';

/**
 * 月份面板，一次顯示 12 個月。
 *
 * 月份名稱依 `displayMonthLocale`（未指定時取 context 的 locale）顯示；
 * 年份被停用時該年所有月份一併停用。可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarMonths } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarMonths reference-date="2026-01-01" @click="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 依 `mode` 切換各面板
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarMonthsProps>(), {
  displayMonthLocale: undefined,
  isMonthDisabled: undefined,
  isMonthInRange: undefined,
  isYearDisabled: undefined,
  value: undefined,
});

const emit = defineEmits<{
  click: [target: DateType];
  monthHover: [target: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const displayMonthLocale = computed(
  (): string => props.displayMonthLocale ?? calendar.value.locale,
);

const monthNames = computed(
  (): Readonly<string[]> =>
    calendar.value.getMonthShortNames(displayMonthLocale.value),
);

const months = computed(() =>
  calendarMonths.map((month) => {
    const {
      getNow,
      getMonth,
      isInMonth,
      isMonthIncluded,
      getCurrentMonthFirstDate,
      setMonth,
    } = calendar.value;
    const monthDateType = setMonth(
      getCurrentMonthFirstDate(props.referenceDate),
      month,
    );
    const active = props.value && isMonthIncluded(monthDateType, props.value);
    /** @NOTE Current month should be disabled when current year is disabled */
    const disabled =
      props.isYearDisabled?.(monthDateType) ||
      props.isMonthDisabled?.(monthDateType) ||
      false;
    const inRange = props.isMonthInRange && props.isMonthInRange(monthDateType);
    const isRangeStart =
      props.value && props.value.length > 0
        ? isMonthIncluded(monthDateType, [props.value[0]])
        : false;
    const isRangeEnd =
      props.value && props.value.length > 0
        ? isMonthIncluded(monthDateType, [props.value[props.value.length - 1]])
        : false;

    // Accessible month label for screen readers
    const monthDate = new Date(monthDateType);
    const fullMonthName = monthDate.toLocaleDateString(
      displayMonthLocale.value,
      { month: 'long' },
    );
    const year = monthDate.getFullYear();

    const ariaLabel = [
      `${fullMonthName} ${year}`,
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
      month,
      monthDateType,
      name: monthNames.value[month],
      today: isInMonth(monthDateType, getMonth(getNow())),
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
        v-for="month in months"
        :key="month.month"
        :active="month.active"
        :is-range-end="month.isRangeEnd"
        :is-range-start="month.isRangeStart"
        mode="month"
        :today="month.today"
      >
        <button
          :aria-disabled="month.disabled"
          :aria-label="month.ariaLabel"
          :aria-pressed="month.active"
          :class="month.buttonClasses"
          :disabled="month.disabled"
          type="button"
          @click="emit('click', month.monthDateType)"
          @mouseenter="emit('monthHover', month.monthDateType)"
        >
          {{ month.name }}
        </button>
      </MznCalendarCell>
    </div>
  </div>
</template>
