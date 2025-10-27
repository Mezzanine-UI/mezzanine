'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import { dateRangePickerClasses as classes } from '@mezzanine-ui/core/date-range-picker';
import { forwardRef, RefObject, useCallback, useState } from 'react';
import Calendar, { CalendarProps, useCalendarContext } from '../Calendar';
import { cx } from '../utils/cx';
import InputTriggerPopper, {
  InputTriggerPopperProps,
} from '../_internal/InputTriggerPopper';
import { useDateRangeCalendarControls } from './useDateRangeCalendarControls';

export interface DateRangePickerCalendarProps
  extends Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>,
    Pick<
      CalendarProps,
      | 'value'
      | 'onChange'
      | 'disabledMonthSwitch'
      | 'disabledYearSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'displayMonthLocale'
      | 'mode'
      | 'isDateInRange'
      | 'isDateDisabled'
      | 'isMonthDisabled'
      | 'isMonthInRange'
      | 'isWeekDisabled'
      | 'isWeekInRange'
      | 'isYearDisabled'
      | 'isYearInRange'
      | 'onDateHover'
      | 'onWeekHover'
      | 'onMonthHover'
      | 'onYearHover'
      | 'referenceDate'
    > {
  /**
   * Other props you may pass to calendar component.
   */
  calendarProps?: Omit<CalendarProps, keyof DateRangePickerCalendarProps>;
  /**
   * React Ref for the first(on the left side) calendar
   */
  firstCalendarRef?: RefObject<HTMLDivElement | null>;
  /**
   * Other props you may provide to `Popper` component
   */
  popperProps?: Omit<
    InputTriggerPopperProps,
    'anchor' | 'children' | 'fadeProps' | 'open'
  >;
  /**
   * React Ref for the second(on the right side) calendar
   */
  secondCalendarRef?: RefObject<HTMLDivElement | null>;
}

/**
 * The react component for `mezzanine` date range picker calendar.
 */
const DateRangePickerCalendar = forwardRef<
  HTMLDivElement,
  DateRangePickerCalendarProps
>(function DateRangePickerCalendar(props, ref) {
  const {
    displayMonthLocale: displayMonthLocaleFromConfig,
    getMonth,
    getYear,
    setMonth,
    setYear,
  } = useCalendarContext();
  const {
    anchor,
    calendarProps,
    disabledMonthSwitch,
    disableOnNext,
    disableOnPrev,
    disabledYearSwitch,
    displayMonthLocale = displayMonthLocaleFromConfig,
    fadeProps,
    firstCalendarRef,
    isDateDisabled,
    isDateInRange,
    isMonthDisabled,
    isMonthInRange,
    isWeekDisabled,
    isWeekInRange,
    isYearDisabled,
    isYearInRange,
    mode = 'day',
    onChange: onChangeProp,
    onDateHover,
    onMonthHover,
    onWeekHover,
    onYearHover,
    open,
    popperProps,
    referenceDate: referenceDateProp,
    secondCalendarRef,
    value,
  } = props;
  const { className, ...restCalendarProps } = calendarProps || {};

  const {
    currentMode,
    onMonthControlClick: onMonthControlClickFromHook,
    onFirstNext,
    onFirstPrev,
    onSecondNext,
    onSecondPrev,
    onYearControlClick: onYearControlClickFromHook,
    popModeStack,
    referenceDates,
    updateFirstReferenceDate,
    updateSecondReferenceDate,
  } = useDateRangeCalendarControls(referenceDateProp, mode);

  const onChangeFactory = useCallback(
    (calendar: 0 | 1) => {
      const targetDate = referenceDates[calendar];
      const updateReferenceDate = calendar
        ? updateSecondReferenceDate
        : updateFirstReferenceDate;

      if (currentMode === 'day' || currentMode === 'week') {
        return (target: DateType) => {
          updateReferenceDate(target);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(target);
          }
        };
      }

      if (currentMode === 'month') {
        return (target: DateType) => {
          const result =
            currentMode === mode
              ? target
              : setMonth(targetDate, getMonth(target));

          updateReferenceDate(result);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }

      if (currentMode === 'year') {
        return (target: DateType) => {
          const result =
            currentMode === mode
              ? target
              : setYear(targetDate, getYear(target));

          updateReferenceDate(result);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }
    },
    [
      currentMode,
      getMonth,
      getYear,
      mode,
      onChangeProp,
      popModeStack,
      referenceDates,
      setMonth,
      setYear,
      updateFirstReferenceDate,
      updateSecondReferenceDate,
    ],
  );

  const [controlPanelOnLeft, setControlPanelOnLeft] = useState(true);

  const onMonthControlClickFactory = useCallback(
    (calendar: 0 | 1) => {
      if (calendar) {
        return () => {
          setControlPanelOnLeft(false);
          onMonthControlClickFromHook();
        };
      }

      return () => {
        setControlPanelOnLeft(true);
        onMonthControlClickFromHook();
      };
    },
    [onMonthControlClickFromHook],
  );

  const onYearControlClickFactory = useCallback(
    (calendar: 0 | 1) => {
      if (calendar) {
        return () => {
          setControlPanelOnLeft(false);
          onYearControlClickFromHook();
        };
      }

      return () => {
        setControlPanelOnLeft(true);
        onYearControlClickFromHook();
      };
    },
    [onYearControlClickFromHook],
  );

  const isSettingFirstCalendar = currentMode !== mode && controlPanelOnLeft;
  const isSettingSecondCalendar = currentMode !== mode && !controlPanelOnLeft;

  return (
    <InputTriggerPopper
      {...popperProps}
      ref={ref}
      anchor={anchor}
      open={open}
      fadeProps={fadeProps}
    >
      <div className={classes.calendarGroup}>
        <Calendar
          {...restCalendarProps}
          className={cx(
            classes.calendar,
            {
              [classes.calendarInactive]: isSettingSecondCalendar,
            },
            className,
          )}
          disabledMonthSwitch={disabledMonthSwitch}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          isDateDisabled={isDateDisabled}
          isDateInRange={isDateInRange}
          isMonthDisabled={isMonthDisabled}
          isMonthInRange={isMonthInRange}
          isWeekDisabled={isWeekDisabled}
          isWeekInRange={isWeekInRange}
          isYearDisabled={isYearDisabled}
          isYearInRange={isYearInRange}
          mode={controlPanelOnLeft ? currentMode : mode}
          onChange={onChangeFactory(0)}
          onDateHover={currentMode === mode ? onDateHover : undefined}
          onMonthHover={currentMode === mode ? onMonthHover : undefined}
          onWeekHover={currentMode === mode ? onWeekHover : undefined}
          onYearHover={currentMode === mode ? onYearHover : undefined}
          onMonthControlClick={onMonthControlClickFactory(0)}
          onNext={isSettingFirstCalendar ? onFirstNext : undefined}
          onPrev={onFirstPrev}
          onYearControlClick={onYearControlClickFactory(0)}
          ref={firstCalendarRef}
          referenceDate={referenceDates[0]}
          value={isSettingFirstCalendar ? referenceDates[0] : value}
        />
        <Calendar
          {...restCalendarProps}
          className={cx(
            classes.calendar,
            {
              [classes.calendarInactive]: isSettingFirstCalendar,
            },
            className,
          )}
          disabledMonthSwitch={disabledMonthSwitch}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          isDateDisabled={isDateDisabled}
          isDateInRange={isDateInRange}
          isMonthDisabled={isMonthDisabled}
          isMonthInRange={isMonthInRange}
          isWeekDisabled={isWeekDisabled}
          isWeekInRange={isWeekInRange}
          isYearDisabled={isYearDisabled}
          isYearInRange={isYearInRange}
          mode={!controlPanelOnLeft ? currentMode : mode}
          onChange={onChangeFactory(1)}
          onDateHover={currentMode === mode ? onDateHover : undefined}
          onMonthHover={currentMode === mode ? onMonthHover : undefined}
          onWeekHover={currentMode === mode ? onWeekHover : undefined}
          onYearHover={currentMode === mode ? onYearHover : undefined}
          onMonthControlClick={onMonthControlClickFactory(1)}
          onNext={onSecondNext}
          onPrev={isSettingSecondCalendar ? onSecondPrev : undefined}
          onYearControlClick={onYearControlClickFactory(1)}
          ref={secondCalendarRef}
          referenceDate={referenceDates[1]}
          value={isSettingSecondCalendar ? referenceDates[1] : value}
        />
      </div>
    </InputTriggerPopper>
  );
});

export default DateRangePickerCalendar;
