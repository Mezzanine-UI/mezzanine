<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { calendarClasses, type DateType } from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';
import { resolveElement } from '../_internal/resolve-element';
import MznCalendar from './calendar.vue';
import { useCalendarContext } from './calendar-context';
import MznCalendarFooterActions from './calendar-footer-actions.vue';
import MznCalendarQuickSelect from './calendar-quick-select.vue';
import type { RangeCalendarProps } from './range-calendar.types';
import { useRangeCalendarControls } from './use-range-calendar-controls';
import { useRangeScan } from './use-range-scan';

/**
 * 並排兩個日曆的區間選取版本。
 *
 * 第一次點擊設定起點、第二次完成區間並依 `mode` 正規化成該單位的起訖時刻；
 * 起訖顛倒會自動對調。區間中若含有被停用的單位，或範圍長到無法在上限內掃描完，
 * 這次選取會退回成新的起點，`isXxxInRange` 的highlight 也會一併停用。
 * 兩個日曆永遠一起換頁。必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznRangeCalendar } from '@mezzanine-ui/vue/calendar';
 * <\/script>
 *
 * <template>
 *   <MznRangeCalendar
 *     :reference-date="referenceDate"
 *     :value="value"
 *     @change="onChange"
 *   />
 * </template>
 * ```
 *
 * @see MznCalendar 單一日曆
 * @see useRangeScan 判斷區間能否選取的掃描
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RangeCalendarProps>(), {
  actions: undefined,
  calendarProps: undefined,
  disableOnDoubleNext: undefined,
  disableOnDoublePrev: undefined,
  disableOnNext: undefined,
  disableOnPrev: undefined,
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
  previewValue: undefined,
  quickSelect: undefined,
  renderAnnotations: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [value: [DateType, DateType | undefined]];
  dateHover: [target: DateType];
  halfYearHover: [target: DateType];
  monthHover: [target: DateType];
  quarterHover: [target: DateType];
  weekHover: [target: DateType];
  yearHover: [target: DateType];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const firstCalendar = ref<ComponentPublicInstance | null>(null);
const secondCalendar = ref<ComponentPublicInstance | null>(null);

/**
 * React hands the two calendars out through `firstCalendarRef` /
 * `secondCalendarRef` props; Vue's equivalent of that is the parent placing a
 * `ref` on this component, so the elements are exposed instead.
 */
defineExpose({
  firstCalendar: computed(() => resolveElement(firstCalendar.value)),
  secondCalendar: computed(() => resolveElement(secondCalendar.value)),
});

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
 * What the calendars paint: the committed anchors plus the hover preview
 * while a range is still half-finished. `value` itself stays untouched so
 * the click handler keeps seeing only what the user has committed.
 */
const displayValue = computed((): DateType[] | undefined => {
  if (!props.previewValue) return value.value;
  if (!value.value?.length) return [props.previewValue];
  if (value.value.length === 1) return [value.value[0], props.previewValue];

  return value.value;
});

const {
  currentMode,
  onMonthControlClick,
  onFirstPrev,
  onFirstDoublePrev,
  onSecondNext,
  onSecondDoubleNext,
  onYearControlClick,
  popModeStack,
  referenceDates,
  updateFirstReferenceDate,
  updateSecondReferenceDate,
} = useRangeCalendarControls(props.referenceDate, props.mode);

function normalizeRangeStart(date: DateType): DateType {
  const {
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
    case 'day':
      return setMillisecond(setSecond(setMinute(setHour(date, 0), 0), 0), 0);
    case 'week':
      return getCurrentWeekFirstDate(date, displayWeekDayLocale.value);
    case 'month':
      return getCurrentMonthFirstDate(date);
    case 'year':
      return getCurrentYearFirstDate(date);
    case 'quarter':
      return getCurrentQuarterFirstDate(date);
    case 'half-year':
      return getCurrentHalfYearFirstDate(date);
    default:
      return date;
  }
}

function normalizeRangeEnd(date: DateType): DateType {
  const {
    getCurrentWeekFirstDate,
    getCurrentMonthFirstDate,
    getCurrentYearFirstDate,
    getCurrentQuarterFirstDate,
    getCurrentHalfYearFirstDate,
    addSecond,
    addDay,
    addMonth,
    addYear,
    setHour,
    setMinute,
    setSecond,
    setMillisecond,
  } = calendar.value;
  const endOfDay = (target: DateType): DateType =>
    setMillisecond(setSecond(setMinute(setHour(target, 23), 59), 59), 999);

  switch (props.mode) {
    case 'day':
      return endOfDay(date);
    case 'week': {
      const weekStart = getCurrentWeekFirstDate(
        date,
        displayWeekDayLocale.value,
      );

      return endOfDay(addSecond(addDay(weekStart, 7), -1));
    }
    case 'month':
      return endOfDay(
        addSecond(addMonth(getCurrentMonthFirstDate(date), 1), -1),
      );
    case 'year':
      return endOfDay(addSecond(addYear(getCurrentYearFirstDate(date), 1), -1));
    case 'quarter':
      return endOfDay(
        addSecond(addMonth(getCurrentQuarterFirstDate(date), 3), -1),
      );
    case 'half-year':
      return endOfDay(
        addSecond(addMonth(getCurrentHalfYearFirstDate(date), 6), -1),
      );
    default:
      return date;
  }
}

const scanRange = useRangeScan(() => ({
  displayWeekDayLocale: displayWeekDayLocale.value,
  isDateDisabled: props.isDateDisabled,
  isHalfYearDisabled: props.isHalfYearDisabled,
  isMonthDisabled: props.isMonthDisabled,
  isQuarterDisabled: props.isQuarterDisabled,
  isWeekDisabled: props.isWeekDisabled,
  isYearDisabled: props.isYearDisabled,
  mode: props.mode,
}));

/**
 * A disabled or incompletely checked range is not selectable, so it is not
 * painted as one. This asks the same question `handleRangeSelection` asks
 * before committing a selection, so the preview never invites a click that
 * would then be rejected. Computed because the six granularity handlers
 * below all need the answer and the scan must run once, not once each.
 */
const shouldSuppressInRange = computed((): boolean => {
  const [rangeAnchorStart, rangeAnchorEnd] = displayValue.value ?? [];

  return Boolean(
    rangeAnchorStart &&
      rangeAnchorEnd &&
      scanRange(rangeAnchorStart, rangeAnchorEnd) !== 'clear',
  );
});

const resolvedIsDateInRange = computed(() =>
  shouldSuppressInRange.value ? undefined : props.isDateInRange,
);
const resolvedIsHalfYearInRange = computed(() =>
  shouldSuppressInRange.value ? undefined : props.isHalfYearInRange,
);
const resolvedIsMonthInRange = computed(() =>
  shouldSuppressInRange.value ? undefined : props.isMonthInRange,
);
const resolvedIsQuarterInRange = computed(() =>
  shouldSuppressInRange.value ? undefined : props.isQuarterInRange,
);
const resolvedIsWeekInRange = computed(() =>
  shouldSuppressInRange.value ? undefined : props.isWeekInRange,
);
const resolvedIsYearInRange = computed(() =>
  shouldSuppressInRange.value ? undefined : props.isYearInRange,
);

function handleRangeSelection(target: DateType): void {
  const [existingStart, existingEnd] = value.value || [];

  if (!existingStart || (existingStart && existingEnd)) {
    // 未選取起始日期，或已完成區間選取，重新開始選取
    emit('change', [target, undefined]);

    return;
  }

  const rawStart = existingStart;
  const rawEnd = target;

  // 檢查是否有不可選日期
  if (scanRange(rawStart, rawEnd) !== 'clear') {
    emit('change', [target, undefined]);

    return;
  }

  const isEndBeforeStart = calendar.value.isBefore(rawEnd, rawStart);
  const [start, end] = isEndBeforeStart
    ? [rawEnd, rawStart]
    : [rawStart, rawEnd];

  emit('change', [normalizeRangeStart(start), normalizeRangeEnd(end)]);
}

function getTargetValue(target: DateType, targetDate: DateType): DateType {
  const { getMonth, getYear, setMonth, setYear } = calendar.value;

  if (currentMode.value === props.mode) {
    return target;
  }

  if (currentMode.value === 'month') {
    return setMonth(targetDate, getMonth(target));
  }

  if (currentMode.value === 'year') {
    return setYear(targetDate, getYear(target));
  }

  return target;
}

function handleChange(calendarIndex: 0 | 1, target: DateType): void {
  const targetDate = referenceDates.value[calendarIndex];
  const updateReferenceDate = calendarIndex
    ? updateSecondReferenceDate
    : updateFirstReferenceDate;
  const resultValue = getTargetValue(target, targetDate);

  if (currentMode.value === props.mode) {
    handleRangeSelection(resultValue);

    return;
  }

  updateReferenceDate(resultValue);
  popModeStack();
}

const footerActions = computed(() => {
  if (!props.actions) return undefined;

  return {
    secondaryButtonProps: {
      children: 'Cancel',
      disabled: false,
      ...props.actions.secondaryButtonProps,
    },
    primaryButtonProps: {
      children: 'Ok',
      disabled: false,
      ...props.actions.primaryButtonProps,
    },
  };
});

const calendarBundle = computed((): Record<string, unknown> => {
  const { class: _class, ...rest } = (props.calendarProps ?? {}) as Record<
    string,
    unknown
  >;

  return rest;
});

const calendarClass = computed((): string =>
  clsx(
    calendarClasses.noShadowHost,
    (props.calendarProps as { class?: string } | undefined)?.class,
  ),
);

const hostClasses = computed((): string =>
  clsx(calendarClasses.host, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const mainWithFooterClass = calendarClasses.mainWithFooter;
const wrapperClass = calendarClasses.mainRangeCalendarWrapper;
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    :aria-label="`Range calendar, ${mode} view`"
    :class="hostClasses"
    role="application"
  >
    <MznCalendarQuickSelect
      v-if="quickSelect"
      :active-id="quickSelect.activeId"
      :options="quickSelect.options"
    />
    <div :class="mainWithFooterClass">
      <div :class="wrapperClass">
        <MznCalendar
          ref="firstCalendar"
          v-bind="calendarBundle"
          :class="calendarClass"
          disabled-footer-control
          :disable-on-double-prev="disableOnDoublePrev"
          :disable-on-prev="disableOnPrev"
          :disabled-month-switch="disabledMonthSwitch"
          :disabled-year-switch="disabledYearSwitch"
          :display-month-locale="displayMonthLocale"
          :display-week-day-locale="displayWeekDayLocale"
          :is-date-disabled="isDateDisabled"
          :is-date-in-range="resolvedIsDateInRange"
          :is-half-year-disabled="isHalfYearDisabled"
          :is-half-year-in-range="resolvedIsHalfYearInRange"
          :is-month-disabled="isMonthDisabled"
          :is-month-in-range="resolvedIsMonthInRange"
          :is-quarter-disabled="isQuarterDisabled"
          :is-quarter-in-range="resolvedIsQuarterInRange"
          :is-week-disabled="isWeekDisabled"
          :is-week-in-range="resolvedIsWeekInRange"
          :is-year-disabled="isYearDisabled"
          :is-year-in-range="resolvedIsYearInRange"
          :mode="currentMode"
          :reference-date="referenceDates[0]"
          :render-annotations="renderAnnotations"
          :value="displayValue"
          @change="handleChange(0, $event)"
          @date-hover="emit('dateHover', $event)"
          @double-prev="onFirstDoublePrev"
          @half-year-hover="emit('halfYearHover', $event)"
          @month-control-click="onMonthControlClick"
          @month-hover="emit('monthHover', $event)"
          @prev="onFirstPrev"
          @quarter-hover="emit('quarterHover', $event)"
          @week-hover="emit('weekHover', $event)"
          @year-control-click="onYearControlClick"
          @year-hover="emit('yearHover', $event)"
        />
        <MznCalendar
          ref="secondCalendar"
          v-bind="calendarBundle"
          :class="calendarClass"
          disabled-footer-control
          :disable-on-double-next="disableOnDoubleNext"
          :disable-on-next="disableOnNext"
          :disabled-month-switch="disabledMonthSwitch"
          :disabled-year-switch="disabledYearSwitch"
          :display-month-locale="displayMonthLocale"
          :display-week-day-locale="displayWeekDayLocale"
          :is-date-disabled="isDateDisabled"
          :is-date-in-range="resolvedIsDateInRange"
          :is-half-year-disabled="isHalfYearDisabled"
          :is-half-year-in-range="resolvedIsHalfYearInRange"
          :is-month-disabled="isMonthDisabled"
          :is-month-in-range="resolvedIsMonthInRange"
          :is-quarter-disabled="isQuarterDisabled"
          :is-quarter-in-range="resolvedIsQuarterInRange"
          :is-week-disabled="isWeekDisabled"
          :is-week-in-range="resolvedIsWeekInRange"
          :is-year-disabled="isYearDisabled"
          :is-year-in-range="resolvedIsYearInRange"
          :mode="currentMode"
          :reference-date="referenceDates[1]"
          :render-annotations="renderAnnotations"
          :value="displayValue"
          @change="handleChange(1, $event)"
          @date-hover="emit('dateHover', $event)"
          @double-next="onSecondDoubleNext"
          @half-year-hover="emit('halfYearHover', $event)"
          @month-control-click="onMonthControlClick"
          @month-hover="emit('monthHover', $event)"
          @next="onSecondNext"
          @quarter-hover="emit('quarterHover', $event)"
          @week-hover="emit('weekHover', $event)"
          @year-control-click="onYearControlClick"
          @year-hover="emit('yearHover', $event)"
        />
      </div>
      <MznCalendarFooterActions v-if="footerActions" :actions="footerActions" />
    </div>
  </div>
</template>
