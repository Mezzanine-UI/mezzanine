<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  calendarHalfYears,
  calendarHalfYearYearsCount,
  getYearRange,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import MznCalendarCell from './calendar-cell.vue';
import { useCalendarContext } from './calendar-context';
import type { CalendarHalfYearsProps } from './calendar-half-years.types';

/**
 * 半年面板，每一列是一個年份、上下兩個半年。
 *
 * 一次顯示五年，範圍由 `referenceDate` 所在的區間決定；被停用的半年不會送出事件。
 * 可用來組裝自訂日曆。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendarHalfYears } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznCalendarHalfYears reference-date="2026-01-01" @click="onChange" />
 * </template>
 * ```
 *
 * @see MznCalendar 依 `mode` 切換各面板
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarHalfYearsProps>(), {
  isHalfYearDisabled: undefined,
  isHalfYearInRange: undefined,
  value: undefined,
});

const emit = defineEmits<{
  click: [target: DateType];
  halfYearHover: [target: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const start = computed(
  (): number =>
    getYearRange(
      calendar.value.getYear(props.referenceDate),
      calendarHalfYearYearsCount,
    )[0],
);

const rows = computed(() =>
  Array.from({ length: calendarHalfYearYearsCount }, (_, i) => {
    const year = start.value + i;
    const {
      getNow,
      getCurrentHalfYearFirstDate,
      isHalfYearIncluded,
      setYear,
      setMonth,
    } = calendar.value;

    return {
      halfYears: calendarHalfYears.map((halfYear) => {
        const halfYearStartMonth = (halfYear - 1) * 6;
        const halfYearDate = setMonth(
          setYear(getCurrentHalfYearFirstDate(props.referenceDate), year),
          halfYearStartMonth,
        );

        const disabled =
          props.isHalfYearDisabled && props.isHalfYearDisabled(halfYearDate);
        const inRange =
          !disabled &&
          props.isHalfYearInRange &&
          props.isHalfYearInRange(halfYearDate);
        const active =
          !disabled &&
          props.value &&
          isHalfYearIncluded(halfYearDate, props.value);
        const isRangeStart =
          props.value && props.value.length > 0
            ? isHalfYearIncluded(halfYearDate, [props.value[0]])
            : false;
        const isRangeEnd =
          props.value && props.value.length > 0
            ? isHalfYearIncluded(halfYearDate, [
                props.value[props.value.length - 1],
              ])
            : false;

        // Accessible half-year label for screen readers
        const halfYearMonths =
          halfYear === 1 ? 'January to June' : 'July to December';

        const ariaLabel = [
          `Half ${halfYear}, ${year}`,
          halfYearMonths,
          active && 'Selected',
          disabled && 'Not available',
        ]
          .filter(Boolean)
          .join(', ');

        return {
          active,
          ariaLabel,
          buttonClasses: clsx(classes.button, {
            [classes.buttonDisabled]: disabled,
            [classes.buttonInRange]: inRange,
            [classes.buttonActive]: active,
          }),
          disabled,
          halfYear,
          halfYearDate,
          isRangeEnd,
          isRangeStart,
          today: isHalfYearIncluded(halfYearDate, [getNow()]),
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

function handleClick(disabled: boolean | undefined, target: DateType): void {
  if (disabled) return;

  emit('click', target);
}

function handleMouseEnter(
  disabled: boolean | undefined,
  target: DateType,
): void {
  if (disabled) return;

  emit('halfYearHover', target);
}
</script>

<template>
  <div :class="hostClasses" v-bind="forwardedAttrs">
    <div
      v-for="(row, rowIndex) in rows"
      :key="row.year"
      :class="rowClasses(rowIndex)"
    >
      <MznCalendarCell disabled mode="half-year">
        {{ row.year }}
      </MznCalendarCell>
      <MznCalendarCell
        v-for="halfYear in row.halfYears"
        :key="halfYear.halfYear"
        :active="halfYear.active"
        :is-range-end="halfYear.isRangeEnd"
        :is-range-start="halfYear.isRangeStart"
        mode="half-year"
        :today="halfYear.today"
      >
        <button
          :aria-disabled="halfYear.disabled"
          :aria-label="halfYear.ariaLabel"
          :aria-pressed="halfYear.active"
          :class="halfYear.buttonClasses"
          :disabled="halfYear.disabled"
          type="button"
          @click="handleClick(halfYear.disabled, halfYear.halfYearDate)"
          @mouseenter="
            handleMouseEnter(halfYear.disabled, halfYear.halfYearDate)
          "
        >
          H{{ halfYear.halfYear }}
        </button>
      </MznCalendarCell>
    </div>
  </div>
</template>
