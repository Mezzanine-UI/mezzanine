<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import MznCalendarDayOfWeek from './calendar-day-of-week.vue';
import type { CalendarWeeksProps } from './calendar-weeks.types';

/**
 * 週曆面板，顯示 `referenceDate` 所在月份，並以整列為選取單位。
 *
 * 左側是週次，整列是一顆按鈕；選取區間的第一週第一天與最後一週最後一天會標為起訖。
 * 可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarWeeks } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarWeeks reference-date="2026-01-01" @click="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 依 `mode` 切換各面板
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarWeeksProps>(), {
  displayWeekDayLocale: undefined,
  isMonthDisabled: undefined,
  isWeekDisabled: undefined,
  isWeekInRange: undefined,
  isYearDisabled: undefined,
  value: undefined,
});

const emit = defineEmits<{
  click: [date: DateType];
  weekHover: [firstDateOfWeek: DateType];
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

/** Pre-calculate all weeks data including dates and week first dates */
const weeksData = computed(() => {
  const {
    getMonth,
    setDate,
    setMonth,
    setHour,
    setMinute,
    setSecond,
    setMillisecond,
    getCurrentWeekFirstDate,
  } = calendar.value;
  const thisMonth = getMonth(props.referenceDate);

  return daysGrid.value.map((week, index) => {
    const dates: DateType[] = [];
    const weekStartInPrevMonth = index === 0 && week[0] > 7;
    const weekStartInNextMonth = index > 3 && week[0] <= 14;

    week.forEach((dateNum) => {
      const isPrevMonth = index === 0 && dateNum > 7;
      const isNextMonth = index > 3 && dateNum <= 14;

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

      dates.push(date);
    });

    const weekFirstDate = getCurrentWeekFirstDate(
      dates[0],
      displayWeekDayLocale.value,
    );

    return {
      week,
      dates,
      weekStartInPrevMonth,
      weekStartInNextMonth,
      weekFirstDate,
    };
  });
});

/** Pre-calculate last week dates for range end comparison */
const lastWeekDatesMap = computed(() => {
  if (!props.value || props.value.length === 0) return null;

  const { getDate, getMonth, setDate, setMonth, getCurrentWeekFirstDate } =
    calendar.value;
  const rangeLastDate =
    props.value.length === 1
      ? setDate(props.value[0], getDate(props.value[0]) + 6)
      : props.value[props.value.length - 1];

  const lastWeekFirstDate = getCurrentWeekFirstDate(
    rangeLastDate,
    displayWeekDayLocale.value,
  );
  const lastWeekDates: DateType[] = [];

  for (let i = 0; i < 7; i++) {
    lastWeekDates.push(
      setDate(
        setMonth(lastWeekFirstDate, getMonth(lastWeekFirstDate)),
        getDate(lastWeekFirstDate) + i,
      ),
    );
  }

  return {
    rangeLastDate,
    lastWeekDates,
  };
});

const weekNumbers = computed((): number[] =>
  weeksData.value.map(({ weekFirstDate }) =>
    calendar.value.getWeek(weekFirstDate, displayWeekDayLocale.value),
  ),
);

const rows = computed(() =>
  weeksData.value.map(
    ({ week, dates, weekStartInPrevMonth, weekStartInNextMonth }, index) => {
      const {
        getDate,
        getMonth,
        getNow,
        getWeek,
        isInMonth,
        isSameDate,
        isWeekIncluded,
      } = calendar.value;
      const disabled =
        props.isYearDisabled?.(dates[0]) ||
        props.isMonthDisabled?.(dates[0]) ||
        props.isWeekDisabled?.(dates[0]) ||
        false;
      const inactive =
        !disabled && (weekStartInPrevMonth || weekStartInNextMonth);

      const weekIncluded =
        !disabled &&
        !inactive &&
        props.value &&
        isWeekIncluded(dates[0], props.value, displayWeekDayLocale.value);

      const rangeFirstDate =
        props.value && props.value.length > 0 ? props.value[0] : null;
      const rangeLastDate = lastWeekDatesMap.value?.rangeLastDate ?? null;

      const inRange =
        !disabled && props.isWeekInRange && props.isWeekInRange(dates[0]);

      // Accessible week label for screen readers
      const firstDate = new Date(dates[0]);
      const lastDate = new Date(dates[dates.length - 1]);
      const weekNum = getWeek(dates[0], displayWeekDayLocale.value);
      const startMonth = firstDate.toLocaleDateString(
        displayWeekDayLocale.value,
        { month: 'short' },
      );
      const endMonth = lastDate.toLocaleDateString(displayWeekDayLocale.value, {
        month: 'short',
      });
      const startDay = firstDate.getDate();
      const endDay = lastDate.getDate();

      const ariaLabel = [
        `Week ${weekNum}`,
        `${startMonth} ${startDay} to ${endMonth} ${endDay}`,
        weekIncluded && 'Selected',
        disabled && 'Not available',
        inactive && 'Outside current month',
      ]
        .filter(Boolean)
        .join(', ');

      const cells = week.map((dateNum, dateIndex) => {
        let cellActive = false;
        let isFirstWeekFirstDate = false;
        let isLastWeekLastDate = false;

        if (
          weekIncluded &&
          rangeFirstDate &&
          rangeLastDate &&
          lastWeekDatesMap.value
        ) {
          const currentDate = dates[dateIndex];

          isFirstWeekFirstDate =
            isWeekIncluded(
              currentDate,
              [rangeFirstDate],
              displayWeekDayLocale.value,
            ) && isSameDate(currentDate, rangeFirstDate);

          isLastWeekLastDate =
            isWeekIncluded(
              currentDate,
              [rangeLastDate],
              displayWeekDayLocale.value,
            ) &&
            isSameDate(currentDate, lastWeekDatesMap.value.lastWeekDates[6]);

          cellActive = isFirstWeekFirstDate || isLastWeekLastDate;
        }

        return {
          cellActive,
          cellClasses: clsx(classes.button, {
            [classes.buttonInRange]: weekIncluded,
            [classes.buttonActive]: cellActive,
          }),
          cellKey: `${getMonth(dates[dateIndex])}/${getDate(dates[dateIndex])}`,
          dateNum,
          disabled:
            disabled ||
            !isInMonth(dates[dateIndex], getMonth(props.referenceDate)),
          isFirstWeekFirstDate,
          isLastWeekLastDate,
          isWeekend: weekends.value[dateIndex],
          today: isSameDate(dates[dateIndex], getNow()),
        };
      });

      return {
        ariaLabel,
        cells,
        disabled,
        firstDate: dates[0],
        index,
        rowClasses: clsx(classes.button, classes.row, {
          [classes.buttonInRange]: inRange,
          [classes.buttonDisabled]: disabled,
        }),
        weekIncluded,
      };
    },
  ),
);

const hostClasses = computed((): string =>
  clsx(classes.board, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

function handleClick(firstDate: DateType): void {
  emit(
    'click',
    calendar.value.getCurrentWeekFirstDate(
      firstDate,
      displayWeekDayLocale.value,
    ),
  );
}

function handleMouseEnter(firstDate: DateType): void {
  emit(
    'weekHover',
    calendar.value.getCurrentWeekFirstDate(
      firstDate,
      displayWeekDayLocale.value,
    ),
  );
}

const daysGridClass = classes.daysGrid;
const weekClass = classes.week;
const weekRowClass = classes.weekRow;
const cellInnerStyle = {
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
} as const;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="weekClass">
      <div
        v-for="(weekNumber, index) in weekNumbers"
        :key="index"
        :class="weekRowClass"
      >
        <MznCalendarCell disabled>{{ weekNumber }}</MznCalendarCell>
      </div>
    </div>
    <div :class="daysGridClass">
      <MznCalendarDayOfWeek :display-week-day-locale="displayWeekDayLocale" />
      <button
        v-for="row in rows"
        :key="`CALENDAR_WEEKS/WEEK_OF/${row.index}`"
        :aria-disabled="row.disabled"
        :aria-label="row.ariaLabel"
        :aria-pressed="row.weekIncluded"
        :class="row.rowClasses"
        :disabled="row.disabled"
        type="button"
        @click="handleClick(row.firstDate)"
        @mouseenter="handleMouseEnter(row.firstDate)"
      >
        <MznCalendarCell
          v-for="cell in row.cells"
          :key="cell.cellKey"
          :active="cell.cellActive"
          :disabled="cell.disabled"
          :is-range-end="cell.isLastWeekLastDate"
          :is-range-start="cell.isFirstWeekFirstDate"
          :is-weekend="cell.isWeekend"
          mode="week"
          :today="cell.today"
        >
          <div :class="cell.cellClasses" :style="cellInnerStyle">
            {{ cell.dateNum }}
          </div>
        </MznCalendarCell>
      </button>
    </div>
  </div>
</template>
