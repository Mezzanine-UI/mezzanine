<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import {
  calendarClasses as classes,
  calendarHalfYearYearsCount,
  calendarQuarterYearsCount,
  calendarYearModuler,
  getYearRange,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import { useCalendarContext } from './calendar-context';
import MznCalendarControls from './calendar-controls.vue';
import MznCalendarDays from './calendar-days.vue';
import MznCalendarFooterControl from './calendar-footer-control.vue';
import MznCalendarHalfYears from './calendar-half-years.vue';
import MznCalendarMonths from './calendar-months.vue';
import MznCalendarQuarters from './calendar-quarters.vue';
import MznCalendarQuickSelect from './calendar-quick-select.vue';
import MznCalendarWeeks from './calendar-weeks.vue';
import MznCalendarYears from './calendar-years.vue';
import type { CalendarProps } from './calendar.types';

/**
 * 日曆本體，依 `mode` 顯示日、週、月、季、半年或年面板。
 *
 * 元件本身不持有狀態：目前顯示的模式與參考日期都由呼叫端提供，
 * 通常搭配 `useCalendarControls`。上一頁／下一頁按鈕只有在對應事件被監聽時才會出現。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCalendar, useCalendarControls } from '@mezzanine-ui/vue/calendar';
 *
 * const { currentMode, referenceDate, onNext, onPrev } = useCalendarControls(today, 'day');
 * <\/script>
 *
 * <template>
 *   <MznCalendar
 *     :mode="currentMode"
 *     :reference-date="referenceDate"
 *     :value="value"
 *     @change="onChange"
 *     @next="onNext"
 *     @prev="onPrev"
 *   />
 * </template>
 * ```
 *
 * @see MznRangeCalendar 並排兩個日曆的區間選取版本
 * @see MznCalendarConfigProvider 提供日期函式庫與語系
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CalendarProps>(), {
  calendarDaysProps: undefined,
  calendarHalfYearsProps: undefined,
  calendarMonthsProps: undefined,
  calendarQuartersProps: undefined,
  calendarWeeksProps: undefined,
  calendarYearsProps: undefined,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
  disabledFooterControl: false,
  disabledMonthSwitch: undefined,
  disabledYearSwitch: undefined,
  displayMonthLocale: undefined,
  displayWeekDayLocale: undefined,
  isDateDisabled: undefined,
  isDateInRange: undefined,
  isHalfYearDisabled: undefined,
  isHalfYearInRange: undefined,
  isMonthDisabled: undefined,
  isMonthInRange: undefined,
  isQuarterDisabled: undefined,
  isQuarterInRange: undefined,
  isWeekDisabled: undefined,
  isWeekInRange: undefined,
  isYearDisabled: undefined,
  isYearInRange: undefined,
  mode: 'day',
  quickSelect: undefined,
  renderAnnotations: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [target: DateType];
  dateHover: [target: DateType];
  doubleNext: [currentMode: CalendarMode];
  doublePrev: [currentMode: CalendarMode];
  halfYearHover: [target: DateType];
  monthControlClick: [];
  monthHover: [target: DateType];
  next: [currentMode: CalendarMode];
  prev: [currentMode: CalendarMode];
  quarterHover: [target: DateType];
  weekHover: [target: DateType];
  yearControlClick: [];
  yearHover: [target: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();
const hasListener = useHasListener();

const displayMonthLocale = computed(
  (): string => props.displayMonthLocale ?? calendar.value.locale,
);

const displayWeekDayLocale = computed(
  (): string => props.displayWeekDayLocale ?? calendar.value.locale,
);

const value = computed((): DateType[] | undefined => {
  if (!props.value) return undefined;

  return Array.isArray(props.value) ? props.value : [props.value];
});

/**
 * Only the arrows the caller listens for are wired up, because
 * MznCalendarControls renders a button per listener it was given — the same
 * way React passes `undefined` for the handlers it has none for.
 */
function controlListeners(): Record<string, () => void> {
  const listeners: Record<string, () => void> = {};

  if (hasListener('doubleNext')) {
    listeners.doubleNext = () => emit('doubleNext', props.mode);
  }

  if (hasListener('next')) {
    listeners.next = () => emit('next', props.mode);
  }

  if (hasListener('doublePrev')) {
    listeners.doublePrev = () => emit('doublePrev', props.mode);
  }

  if (hasListener('prev')) {
    listeners.prev = () => emit('prev', props.mode);
  }

  return listeners;
}

const displayMonth = computed((): string =>
  calendar.value.getMonthShortName(
    calendar.value.getMonth(props.referenceDate),
    displayMonthLocale.value,
  ),
);

const displayYear = computed((): number =>
  calendar.value.getYear(props.referenceDate),
);

const yearRangeLabel = computed((): string => {
  const yearsCount = {
    year: calendarYearModuler,
    quarter: calendarQuarterYearsCount,
    'half-year': calendarHalfYearYearsCount,
  }[props.mode as 'year' | 'quarter' | 'half-year'];

  const [start, end] = getYearRange(displayYear.value, yearsCount);

  return `${start} - ${end}`;
});

const yearRangeAriaLabel = computed((): string => {
  if (props.mode === 'quarter') {
    return `Quarter year range ${yearRangeLabel.value}`;
  }

  if (props.mode === 'half-year') {
    return `Half-year range ${yearRangeLabel.value}`;
  }

  return `Year range ${yearRangeLabel.value}`;
});

const footerControlLabel = computed(
  (): string | undefined =>
    ({
      day: 'Today',
      week: 'This week',
      month: 'This month',
      year: 'This year',
      quarter: 'This quarter',
      'half-year': 'This half year',
    })[props.mode],
);

function handleFooterControlClick(): void {
  const {
    getNow,
    getCurrentWeekFirstDate,
    getCurrentMonthFirstDate,
    getCurrentYearFirstDate,
    getCurrentQuarterFirstDate,
    getCurrentHalfYearFirstDate,
    setHour,
    setMinute,
    setSecond,
    setMillisecond,
  } = calendar.value;

  switch (props.mode) {
    case 'week':
      emit(
        'change',
        getCurrentWeekFirstDate(getNow(), displayWeekDayLocale.value),
      );
      break;
    case 'month':
      emit('change', getCurrentMonthFirstDate(getNow()));
      break;
    case 'year':
      emit('change', getCurrentYearFirstDate(getNow()));
      break;
    case 'quarter':
      emit('change', getCurrentQuarterFirstDate(getNow()));
      break;
    case 'half-year':
      emit('change', getCurrentHalfYearFirstDate(getNow()));
      break;
    case 'day':
    default:
      emit(
        'change',
        setMillisecond(setSecond(setMinute(setHour(getNow(), 0), 0), 0), 0),
      );
  }
}

const hostClasses = computed((): string =>
  clsx(classes.host, classes.mode(props.mode), attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const mainClass = classes.main;
const mainWithFooterClass = classes.mainWithFooter;
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    :aria-label="`Calendar, ${mode} view`"
    :class="hostClasses"
    role="application"
  >
    <MznCalendarQuickSelect
      v-if="quickSelect"
      :active-id="quickSelect.activeId"
      :options="quickSelect.options"
    />
    <div :class="mainWithFooterClass">
      <div :class="mainClass">
        <MznCalendarControls
          :disable-on-double-next="disableOnDoubleNext"
          :disable-on-double-prev="disableOnDoublePrev"
          :disable-on-next="disableOnNext"
          :disable-on-prev="disableOnPrev"
          v-on="controlListeners()"
        >
          <template v-if="mode === 'day' || mode === 'week'">
            <button
              :aria-disabled="disabledMonthSwitch"
              :aria-label="`Select month, currently ${displayMonth}`"
              :disabled="disabledMonthSwitch"
              type="button"
              @click="emit('monthControlClick')"
            >
              {{ displayMonth }}
            </button>
            <button
              :aria-disabled="disabledYearSwitch"
              :aria-label="`Select year, currently ${displayYear}`"
              :disabled="disabledYearSwitch"
              type="button"
              @click="emit('yearControlClick')"
            >
              {{ displayYear }}
            </button>
          </template>
          <button
            v-else-if="mode === 'month'"
            :aria-disabled="disabledYearSwitch"
            :aria-label="`Select year, currently ${displayYear}`"
            :disabled="disabledYearSwitch"
            type="button"
            @click="emit('yearControlClick')"
          >
            {{ displayYear }}
          </button>
          <button
            v-else
            aria-disabled="true"
            :aria-label="yearRangeAriaLabel"
            disabled
            type="button"
          >
            {{ yearRangeLabel }}
          </button>
        </MznCalendarControls>
        <MznCalendarDays
          v-if="mode === 'day'"
          v-bind="calendarDaysProps"
          :display-week-day-locale="displayWeekDayLocale"
          :is-date-disabled="isDateDisabled"
          :is-date-in-range="isDateInRange"
          :is-month-disabled="isMonthDisabled"
          :is-year-disabled="isYearDisabled"
          :reference-date="referenceDate"
          :render-annotations="renderAnnotations"
          :value="value"
          @click="emit('change', $event)"
          @date-hover="emit('dateHover', $event)"
        />
        <MznCalendarWeeks
          v-else-if="mode === 'week'"
          v-bind="calendarWeeksProps"
          :display-week-day-locale="displayWeekDayLocale"
          :is-month-disabled="isMonthDisabled"
          :is-week-disabled="isWeekDisabled"
          :is-week-in-range="isWeekInRange"
          :is-year-disabled="isYearDisabled"
          :reference-date="referenceDate"
          :value="value"
          @click="emit('change', $event)"
          @week-hover="emit('weekHover', $event)"
        />
        <MznCalendarMonths
          v-else-if="mode === 'month'"
          v-bind="calendarMonthsProps"
          :is-month-disabled="isMonthDisabled"
          :is-month-in-range="isMonthInRange"
          :is-year-disabled="isYearDisabled"
          :reference-date="referenceDate"
          :value="value"
          @click="emit('change', $event)"
          @month-hover="emit('monthHover', $event)"
        />
        <MznCalendarYears
          v-else-if="mode === 'year'"
          v-bind="calendarYearsProps"
          :is-year-disabled="isYearDisabled"
          :is-year-in-range="isYearInRange"
          :reference-date="referenceDate"
          :value="value"
          @click="emit('change', $event)"
          @year-hover="emit('yearHover', $event)"
        />
        <MznCalendarQuarters
          v-else-if="mode === 'quarter'"
          v-bind="calendarQuartersProps"
          :is-quarter-disabled="isQuarterDisabled"
          :is-quarter-in-range="isQuarterInRange"
          :reference-date="referenceDate"
          :value="value"
          @click="emit('change', $event)"
          @quarter-hover="emit('quarterHover', $event)"
        />
        <MznCalendarHalfYears
          v-else-if="mode === 'half-year'"
          v-bind="calendarHalfYearsProps"
          :is-half-year-disabled="isHalfYearDisabled"
          :is-half-year-in-range="isHalfYearInRange"
          :reference-date="referenceDate"
          :value="value"
          @click="emit('change', $event)"
          @half-year-hover="emit('halfYearHover', $event)"
        />
      </div>
      <MznCalendarFooterControl
        v-if="!disabledFooterControl && footerControlLabel"
        @click="handleFooterControlClick"
      >
        {{ footerControlLabel }}
      </MznCalendarFooterControl>
    </div>
  </div>
</template>
