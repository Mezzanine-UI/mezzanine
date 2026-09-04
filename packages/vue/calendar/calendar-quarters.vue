<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  calendarQuarters,
  calendarQuarterYearsCount,
  getYearRange,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import type { CalendarQuartersProps } from './calendar-quarters.types';

/**
 * 季度面板，每一列是一個年份、四個季度。
 *
 * 一次顯示五年，範圍由 `referenceDate` 所在的區間決定；
 * 點擊會送出該季第一天的日期物件。可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarQuarters } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarQuarters reference-date="2026-01-01" @click="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 依 `mode` 切換各面板
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarQuartersProps>(), {
  isQuarterDisabled: undefined,
  isQuarterInRange: undefined,
  value: undefined,
});

const emit = defineEmits<{
  click: [target: DateType];
  quarterHover: [target: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

/** Month names spelled out for the screen-reader label of each quarter. */
const quarterMonths = [
  ['January', 'February', 'March'],
  ['April', 'May', 'June'],
  ['July', 'August', 'September'],
  ['October', 'November', 'December'],
];

const start = computed(
  (): number =>
    getYearRange(
      calendar.value.getYear(props.referenceDate),
      calendarQuarterYearsCount,
    )[0],
);

const rows = computed(() =>
  Array.from({ length: calendarQuarterYearsCount }, (_, i) => {
    const year = start.value + i;
    const {
      getNow,
      getCurrentQuarterFirstDate,
      isQuarterIncluded,
      setYear,
      setMonth,
    } = calendar.value;

    return {
      quarters: calendarQuarters.map((quarter) => {
        const quarterStartMonth = (quarter - 1) * 3;
        const quarterDate = setMonth(
          setYear(
            getCurrentQuarterFirstDate(
              getCurrentQuarterFirstDate(props.referenceDate),
            ),
            year,
          ),
          quarterStartMonth,
        );

        const active =
          props.value && isQuarterIncluded(quarterDate, props.value);
        const disabled =
          props.isQuarterDisabled && props.isQuarterDisabled(quarterDate);
        const inRange =
          props.isQuarterInRange && props.isQuarterInRange(quarterDate);
        const isRangeStart =
          props.value && props.value.length > 0
            ? isQuarterIncluded(quarterDate, [props.value[0]])
            : false;
        const isRangeEnd =
          props.value && props.value.length > 0
            ? isQuarterIncluded(quarterDate, [
                props.value[props.value.length - 1],
              ])
            : false;

        const ariaLabel = [
          `Quarter ${quarter}, ${year}`,
          `${quarterMonths[quarter - 1].join(', ')}`,
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
          quarter,
          quarterDate,
          today: isQuarterIncluded(quarterDate, [getNow()]),
        };
      }),
      year,
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

const rowClasses = (index: number): string =>
  clsx(classes.row, { [classes.rowWithBorder]: index > 0 });
</script>

<template>
  <div :class="hostClasses" v-bind="forwardedAttrs">
    <div
      v-for="(row, rowIndex) in rows"
      :key="row.year"
      :class="rowClasses(rowIndex)"
    >
      <MznCalendarCell disabled mode="quarter">{{ row.year }}</MznCalendarCell>
      <MznCalendarCell
        v-for="quarter in row.quarters"
        :key="quarter.quarter"
        :active="quarter.active"
        :is-range-end="quarter.isRangeEnd"
        :is-range-start="quarter.isRangeStart"
        mode="quarter"
        :today="quarter.today"
      >
        <button
          :aria-disabled="quarter.disabled"
          :aria-label="quarter.ariaLabel"
          :aria-pressed="quarter.active"
          :class="quarter.buttonClasses"
          :disabled="quarter.disabled"
          type="button"
          @click="emit('click', quarter.quarterDate)"
          @mouseenter="emit('quarterHover', quarter.quarterDate)"
        >
          Q{{ quarter.quarter }}
        </button>
      </MznCalendarCell>
    </div>
  </div>
</template>
