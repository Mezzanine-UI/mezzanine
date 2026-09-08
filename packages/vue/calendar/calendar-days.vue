<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import type { TypographyColor } from '@mezzanine-ui/core/typography';
import clsx from 'clsx';
import MznTypography from '../typography/typography.vue';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import MznCalendarDayOfWeek from './calendar-day-of-week.vue';
import type { CalendarDaysProps } from './calendar-days.types';

/**
 * 月曆面板，顯示 `referenceDate` 所在月份。
 *
 * 上下月份補滿的日期會標為 inactive；`renderAnnotations` 可為每一天加上一行註記，
 * 沒有回傳值的日期顯示 `--`。可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarDays } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarDays reference-date="2026-01-01" @click="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 依 `mode` 切換各面板
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarDaysProps>(), {
  displayWeekDayLocale: undefined,
  isDateDisabled: undefined,
  isDateInRange: undefined,
  isMonthDisabled: undefined,
  isYearDisabled: undefined,
  renderAnnotations: undefined,
  value: undefined,
});

const emit = defineEmits<{
  click: [date: DateType];
  dateHover: [date: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const displayWeekDayLocale = computed(
  (): string => props.displayWeekDayLocale ?? calendar.value.locale,
);

const weekends = computed((): boolean[] =>
  calendar.value.getWeekends(displayWeekDayLocale.value),
);

const daysGrid = computed((): number[][] =>
  calendar.value.getCalendarGrid(
    props.referenceDate,
    displayWeekDayLocale.value,
  ),
);

const weeks = computed(() =>
  daysGrid.value.map((week, index) =>
    week.map((dateNum, dayIndex) => {
      const {
        getDate,
        getMonth,
        getNow,
        isDateIncluded,
        isSameDate,
        setDate,
        setMonth,
        setHour,
        setMinute,
        setSecond,
        setMillisecond,
      } = calendar.value;
      const isPrevMonth = index === 0 && dateNum > 7;
      const isNextMonth = index > 3 && dateNum <= 14;
      const thisMonth = getMonth(props.referenceDate);

      const month = isPrevMonth
        ? thisMonth - 1
        : isNextMonth
          ? thisMonth + 1
          : thisMonth;
      const date = setMillisecond(
        setSecond(
          setMinute(
            setHour(setDate(setMonth(props.referenceDate, month), dateNum), 0),
            0,
          ),
          0,
        ),
        0,
      );
      const disabled =
        props.isYearDisabled?.(date) ||
        props.isMonthDisabled?.(date) ||
        props.isDateDisabled?.(date) ||
        false;
      const inactive = !disabled && (isPrevMonth || isNextMonth);
      const inRange =
        !inactive && props.isDateInRange && props.isDateInRange(date);
      const inRangeStart =
        !inactive && props.value && props.value.length > 0
          ? isSameDate(date, props.value[0])
          : false;
      const inRangeEnd =
        !inactive && props.value && props.value.length > 0
          ? isSameDate(date, props.value[props.value.length - 1])
          : false;
      const active =
        !disabled &&
        !inactive &&
        props.value &&
        isDateIncluded(date, props.value);

      // Accessible date label for screen readers
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString(displayWeekDayLocale.value, {
        weekday: 'long',
      });
      const monthName = dateObj.toLocaleDateString(displayWeekDayLocale.value, {
        month: 'long',
      });
      const year = dateObj.getFullYear();
      const day = dateObj.getDate();
      const isToday = isSameDate(date, getNow());

      const ariaLabel = [
        `${dayName}, ${monthName} ${day}, ${year}`,
        isToday && 'Today',
        active && 'Selected',
        disabled && 'Not available',
        inactive && 'Outside current month',
      ]
        .filter(Boolean)
        .join(', ');

      const annotation = props.renderAnnotations?.(date);

      return {
        active,
        annotationColor: (active
          ? 'text-fixed-light'
          : (annotation?.color ?? 'text-neutral')) as TypographyColor,
        annotationValue: annotation?.value ?? '--',
        ariaLabel,
        buttonClasses: clsx(classes.button, {
          [classes.buttonInRange]: inRange,
          [classes.buttonActive]: active,
          [classes.buttonDisabled]: disabled,
        }),
        cellDisabled: isPrevMonth || isNextMonth,
        cellKey: `${getMonth(date)}/${getDate(date)}`,
        date,
        dateNum,
        disabled,
        inRangeEnd,
        inRangeStart,
        isToday,
        isWeekend: weekends.value[dayIndex],
      };
    }),
  ),
);

const withAnnotation = computed((): boolean =>
  Boolean(props.renderAnnotations),
);

const hostClasses = computed((): string =>
  clsx(classes.board, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const daysGridClass = classes.daysGrid;
const rowClass = classes.row;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="daysGridClass">
      <MznCalendarDayOfWeek :display-week-day-locale="displayWeekDayLocale" />
      <div
        v-for="(week, index) in weeks"
        :key="`CALENDAR_DAYS/WEEK_OF/${index}`"
        :class="rowClass"
      >
        <MznCalendarCell
          v-for="cell in week"
          :key="cell.cellKey"
          :active="cell.active"
          :disabled="cell.cellDisabled"
          :is-range-end="cell.inRangeEnd"
          :is-range-start="cell.inRangeStart"
          :is-weekend="cell.isWeekend"
          mode="day"
          :today="cell.isToday"
          :with-annotation="withAnnotation"
        >
          <button
            :aria-current="cell.isToday ? 'date' : undefined"
            :aria-disabled="cell.disabled"
            :aria-label="cell.ariaLabel"
            :aria-pressed="cell.active"
            :class="cell.buttonClasses"
            :disabled="cell.disabled"
            type="button"
            @click="emit('click', cell.date)"
            @mouseenter="emit('dateHover', cell.date)"
            >{{ cell.dateNum
            }}<MznTypography
              v-if="renderAnnotations"
              :color="cell.annotationColor"
              variant="annotation"
              >{{ cell.annotationValue }}</MznTypography
            >
          </button>
        </MznCalendarCell>
      </div>
    </div>
  </div>
</template>
