'use client';

import {
  calendarClasses,
  CalendarMode,
  DateType,
} from '@mezzanine-ui/core/calendar';
import castArray from 'lodash/castArray';
import { forwardRef, RefObject, useCallback } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Calendar, { CalendarProps } from './Calendar';
import { useCalendarContext } from './CalendarContext';
import { useRangeCalendarControls } from './useRangeCalendarControls';
import CalendarFooterActions, {
  CalendarFooterActionsProps,
} from './CalendarFooterActions';
import CalendarQuickSelect, {
  CalendarQuickSelectProps,
} from './CalendarQuickSelect';

export interface RangeCalendarProps
  extends Omit<
      NativeElementPropsWithoutKeyAndRef<'div'>,
      'onChange' | 'children'
    >,
    Pick<
      CalendarProps,
      | 'renderAnnotations'
      | 'isDateDisabled'
      | 'isDateInRange'
      | 'onDateHover'
      | 'displayWeekDayLocale'
      | 'isMonthDisabled'
      | 'isMonthInRange'
      | 'onMonthHover'
      | 'displayMonthLocale'
      | 'isWeekDisabled'
      | 'isWeekInRange'
      | 'onWeekHover'
      | 'isYearDisabled'
      | 'isYearInRange'
      | 'onYearHover'
      | 'isQuarterDisabled'
      | 'isQuarterInRange'
      | 'onQuarterHover'
      | 'isHalfYearDisabled'
      | 'isHalfYearInRange'
      | 'onHalfYearHover'
      | 'disabledMonthSwitch'
      | 'disabledYearSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
    > {
  /**
   * Footer action buttons props
   */
  actions?: CalendarFooterActionsProps['actions'];
  /**
   * Other props you may provide to each `Calendar`
   */
  calendarProps?: Omit<
    CalendarProps,
    | 'mode'
    | 'value'
    | 'onChange'
    | 'referenceDate'
    | 'onNext'
    | 'onPrev'
    | 'onDoubleNext'
    | 'onDoublePrev'
    | 'onMonthControlClick'
    | 'onYearControlClick'
  >;
  /**
   * React Ref for the first (left) calendar
   */
  firstCalendarRef?: RefObject<HTMLDivElement | null>;
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Click handler for every cell on calendars.
   * When completing a range (second click), returns normalized [start, end].
   * When starting a new range (first click), returns the clicked date.
   * The normalization ensures start is beginning of period and end is end of period based on mode.
   */
  onChange?: (value: [DateType, DateType | undefined]) => void;
  /**
   * Quick select options for range calendar.
   * Provide options for users to quickly select specific date ranges.
   */
  quickSelect?: Pick<CalendarQuickSelectProps, 'activeId' | 'options'>;
  /**
   * The reference date for getting the calendar.
   * **The type of `referenceDate` should be the same as your declared `DateType`.**
   */
  referenceDate: DateType;
  /**
   * React Ref for the second (right) calendar
   */
  secondCalendarRef?: RefObject<HTMLDivElement | null>;
  /**
   * The displaying cells will be marked as active
   * if the single value of it matches any date object in the array.
   * **The type of `value` should be the same as your declared `DateType`.**
   */
  value?: DateType | DateType[];
}

/**
 * The react component for `mezzanine` range calendar.
 * Displays two calendars side by side for range selection.
 * Notice that any component related to calendar should be used along with `CalendarContext`.
 */
const RangeCalendar = forwardRef<HTMLDivElement, RangeCalendarProps>(
  function RangeCalendar(props, ref) {
    const {
      locale,
      getMonth,
      getYear,
      setMonth,
      setYear,
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
      isBefore,
    } = useCalendarContext();

    const {
      actions,
      renderAnnotations,
      calendarProps,
      className,
      disabledMonthSwitch,
      disabledYearSwitch,
      disableOnNext,
      disableOnPrev,
      disableOnDoubleNext,
      disableOnDoublePrev,
      displayMonthLocale = locale,
      displayWeekDayLocale = locale,
      firstCalendarRef,
      isDateDisabled,
      isDateInRange,
      isMonthDisabled,
      isMonthInRange,
      isWeekDisabled,
      isWeekInRange,
      isYearDisabled,
      isYearInRange,
      isQuarterDisabled,
      isQuarterInRange,
      isHalfYearDisabled,
      isHalfYearInRange,
      mode = 'day',
      onChange: onChangeProp,
      onDateHover,
      onMonthHover,
      onWeekHover,
      onYearHover,
      onQuarterHover,
      onHalfYearHover,
      quickSelect,
      referenceDate: referenceDateProp,
      secondCalendarRef,
      value: valueProp,
      ...restProps
    } = props;

    const value = valueProp ? castArray(valueProp) : undefined;

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
    } = useRangeCalendarControls(referenceDateProp, mode);

    const normalizeRangeStart = useCallback(
      (date: DateType): DateType => {
        switch (mode) {
          case 'day':
            return setMillisecond(
              setSecond(setMinute(setHour(date, 0), 0), 0),
              0,
            );
          case 'week':
            return getCurrentWeekFirstDate(date, displayWeekDayLocale);
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
      },
      [
        displayWeekDayLocale,
        mode,
        getCurrentWeekFirstDate,
        getCurrentMonthFirstDate,
        getCurrentYearFirstDate,
        getCurrentQuarterFirstDate,
        getCurrentHalfYearFirstDate,
        setHour,
        setMinute,
        setSecond,
        setMillisecond,
      ],
    );

    const normalizeRangeEnd = useCallback(
      (date: DateType): DateType => {
        switch (mode) {
          case 'day':
            return setMillisecond(
              setSecond(setMinute(setHour(date, 23), 59), 59),
              999,
            );
          case 'week': {
            const weekStart = getCurrentWeekFirstDate(
              date,
              displayWeekDayLocale,
            );
            const weekEnd = addSecond(addDay(weekStart, 7), -1);
            return setMillisecond(
              setSecond(setMinute(setHour(weekEnd, 23), 59), 59),
              999,
            );
          }
          case 'month': {
            const nextMonth = addSecond(
              addMonth(getCurrentMonthFirstDate(date), 1),
              -1,
            );
            return setMillisecond(
              setSecond(setMinute(setHour(nextMonth, 23), 59), 59),
              999,
            );
          }
          case 'year': {
            const nextYear = addSecond(
              addYear(getCurrentYearFirstDate(date), 1),
              -1,
            );
            return setMillisecond(
              setSecond(setMinute(setHour(nextYear, 23), 59), 59),
              999,
            );
          }
          case 'quarter': {
            const nextQuarter = addSecond(
              addMonth(getCurrentQuarterFirstDate(date), 3),
              -1,
            );
            return setMillisecond(
              setSecond(setMinute(setHour(nextQuarter, 23), 59), 59),
              999,
            );
          }
          case 'half-year': {
            const nextHalfYear = addSecond(
              addMonth(getCurrentHalfYearFirstDate(date), 6),
              -1,
            );
            return setMillisecond(
              setSecond(setMinute(setHour(nextHalfYear, 23), 59), 59),
              999,
            );
          }
          default:
            return date;
        }
      },
      [
        displayWeekDayLocale,
        mode,
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
      ],
    );

    const hasDisabledDateInRange = useCallback(
      (start: DateType, end: DateType): boolean => {
        const [rangeStart, rangeEnd] = isBefore(start, end)
          ? [start, end]
          : [end, start];

        let current = rangeStart;
        while (isBefore(current, rangeEnd) || current === rangeEnd) {
          // Check disabled based on current mode
          let isDisabled = false;

          switch (mode) {
            case 'day':
              isDisabled = isDateDisabled?.(current) ?? false;
              break;
            case 'week':
              isDisabled = isWeekDisabled?.(current) ?? false;
              break;
            case 'month':
              isDisabled = isMonthDisabled?.(current) ?? false;
              break;
            case 'year':
              isDisabled = isYearDisabled?.(current) ?? false;
              break;
            case 'quarter':
              isDisabled = isQuarterDisabled?.(current) ?? false;
              break;
            case 'half-year':
              isDisabled = isHalfYearDisabled?.(current) ?? false;
              break;
            default:
              break;
          }

          if (isDisabled) {
            return true;
          }

          current = addDay(current, 1);
          // Break if we've passed the end date (safety check)
          if (isBefore(rangeEnd, current)) {
            break;
          }
        }
        return false;
      },
      [
        mode,
        isBefore,
        addDay,
        isDateDisabled,
        isWeekDisabled,
        isMonthDisabled,
        isYearDisabled,
        isQuarterDisabled,
        isHalfYearDisabled,
      ],
    );

    const handleRangeSelection = useCallback(
      (target: DateType) => {
        if (!onChangeProp) return;

        const [existingStart, existingEnd] = value || [];

        if (!existingStart || (existingStart && existingEnd)) {
          // 未選取起始日期，或已完成區間選取，重新開始選取
          onChangeProp([target, undefined]);
        } else {
          const rawStart = existingStart;
          const rawEnd = target;

          // 檢查是否有不可選日期
          if (hasDisabledDateInRange(rawStart, rawEnd)) {
            onChangeProp([target, undefined]);
            return;
          }

          const isEndBeforeStart = isBefore(rawEnd, rawStart);
          const [start, end] = isEndBeforeStart
            ? [rawEnd, rawStart]
            : [rawStart, rawEnd];

          const normalizedStart = normalizeRangeStart(start);
          const normalizedEnd = normalizeRangeEnd(end);

          onChangeProp([normalizedStart, normalizedEnd]);
        }
      },
      [
        value,
        onChangeProp,
        isBefore,
        normalizeRangeStart,
        normalizeRangeEnd,
        hasDisabledDateInRange,
      ],
    );

    const getTargetValue = useCallback(
      (target: DateType, targetDate: DateType): DateType => {
        if (currentMode === mode) {
          return target;
        }

        if (currentMode === 'month') {
          return setMonth(targetDate, getMonth(target));
        }
        if (currentMode === 'year') {
          return setYear(targetDate, getYear(target));
        }

        return target;
      },
      [currentMode, mode, getMonth, getYear, setMonth, setYear],
    );

    const onChangeFactory = useCallback(
      (calendar: 0 | 1) => {
        const targetDate = referenceDates[calendar];
        const updateReferenceDate = calendar
          ? updateSecondReferenceDate
          : updateFirstReferenceDate;

        return (target: DateType) => {
          if (currentMode === mode) {
            const resultValue = getTargetValue(target, targetDate);
            handleRangeSelection(resultValue);
          } else {
            const resultValue = getTargetValue(target, targetDate);
            updateReferenceDate(resultValue);
            popModeStack();
          }
        };
      },
      [
        currentMode,
        mode,
        referenceDates,
        updateFirstReferenceDate,
        updateSecondReferenceDate,
        popModeStack,
        getTargetValue,
        handleRangeSelection,
      ],
    );

    return (
      <div
        {...restProps}
        ref={ref}
        role="application"
        aria-label={`Range calendar, ${mode} view`}
        className={cx(calendarClasses.host, className)}
      >
        {quickSelect && (
          <CalendarQuickSelect
            activeId={quickSelect.activeId}
            options={quickSelect.options}
          />
        )}
        <div className={calendarClasses.mainWithFooter}>
          <div style={{ display: 'inline-flex', flexFlow: 'row' }}>
            <Calendar
              {...calendarProps}
              renderAnnotations={renderAnnotations}
              className={cx(
                calendarClasses.noShadowHost,
                calendarProps?.className,
              )}
              ref={firstCalendarRef}
              mode={currentMode}
              value={value}
              onChange={onChangeFactory(0)}
              referenceDate={referenceDates[0]}
              onPrev={onFirstPrev}
              onDoublePrev={onFirstDoublePrev}
              onMonthControlClick={onMonthControlClick}
              onYearControlClick={onYearControlClick}
              disabledFooterControl
              disabledMonthSwitch={disabledMonthSwitch}
              disabledYearSwitch={disabledYearSwitch}
              disableOnPrev={disableOnPrev}
              disableOnDoublePrev={disableOnDoublePrev}
              displayMonthLocale={displayMonthLocale}
              displayWeekDayLocale={displayWeekDayLocale}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              onDateHover={onDateHover}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              onMonthHover={onMonthHover}
              isWeekDisabled={isWeekDisabled}
              isWeekInRange={isWeekInRange}
              onWeekHover={onWeekHover}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              onYearHover={onYearHover}
              isQuarterDisabled={isQuarterDisabled}
              isQuarterInRange={isQuarterInRange}
              onQuarterHover={onQuarterHover}
              isHalfYearDisabled={isHalfYearDisabled}
              isHalfYearInRange={isHalfYearInRange}
              onHalfYearHover={onHalfYearHover}
            />
            <Calendar
              {...calendarProps}
              renderAnnotations={renderAnnotations}
              className={cx(
                calendarClasses.noShadowHost,
                calendarProps?.className,
              )}
              ref={secondCalendarRef}
              mode={currentMode}
              value={value}
              onChange={onChangeFactory(1)}
              referenceDate={referenceDates[1]}
              onNext={onSecondNext}
              onDoubleNext={onSecondDoubleNext}
              onMonthControlClick={onMonthControlClick}
              onYearControlClick={onYearControlClick}
              disabledFooterControl
              disabledMonthSwitch={disabledMonthSwitch}
              disabledYearSwitch={disabledYearSwitch}
              disableOnNext={disableOnNext}
              disableOnDoubleNext={disableOnDoubleNext}
              displayMonthLocale={displayMonthLocale}
              displayWeekDayLocale={displayWeekDayLocale}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              onDateHover={onDateHover}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              onMonthHover={onMonthHover}
              isWeekDisabled={isWeekDisabled}
              isWeekInRange={isWeekInRange}
              onWeekHover={onWeekHover}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              onYearHover={onYearHover}
              isQuarterDisabled={isQuarterDisabled}
              isQuarterInRange={isQuarterInRange}
              onQuarterHover={onQuarterHover}
              isHalfYearDisabled={isHalfYearDisabled}
              isHalfYearInRange={isHalfYearInRange}
              onHalfYearHover={onHalfYearHover}
            />
          </div>
          <CalendarFooterActions
            actions={{
              secondaryButtonProps: {
                children: 'Cancel',
                disabled: false,
                ...actions?.secondaryButtonProps,
              },
              primaryButtonProps: {
                children: 'Ok',
                disabled: false,
                ...actions?.primaryButtonProps,
              },
            }}
          />
        </div>
      </div>
    );
  },
);

export default RangeCalendar;
