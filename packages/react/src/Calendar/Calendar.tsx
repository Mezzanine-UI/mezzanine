'use client';

import {
  calendarClasses as classes,
  CalendarMode,
  DateType,
  getYearRange,
  calendarYearModuler,
} from '@mezzanine-ui/core/calendar';
import castArray from 'lodash/castArray';
import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCalendarContext } from './CalendarContext';
import CalendarControls, { CalendarControlsProps } from './CalendarControls';
import CalendarDays, { CalendarDaysProps } from './CalendarDays';
import CalendarMonths, { CalendarMonthsProps } from './CalendarMonths';
import CalendarWeeks, { CalendarWeeksProps } from './CalendarWeeks';
import CalendarYears, { CalendarYearsProps } from './CalendarYears';
import CalendarFooterControl from './CalendarFooterControl';

export interface CalendarProps
  extends Omit<
      NativeElementPropsWithoutKeyAndRef<'div'>,
      'onChange' | 'children'
    >,
    Pick<
      CalendarDaysProps,
      | 'isDateDisabled'
      | 'isDateInRange'
      | 'onDateHover'
      | 'displayWeekDayLocale'
    >,
    Pick<
      CalendarMonthsProps,
      | 'isMonthDisabled'
      | 'isMonthInRange'
      | 'onMonthHover'
      | 'displayMonthLocale'
    >,
    Pick<
      CalendarWeeksProps,
      'isWeekDisabled' | 'isWeekInRange' | 'onWeekHover'
    >,
    Pick<
      CalendarYearsProps,
      'isYearDisabled' | 'isYearInRange' | 'onYearHover'
    >,
    Pick<
      CalendarControlsProps,
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
    > {
  /**
   * Other props you may provide to `CalendarDays`
   */
  calendarDaysProps?: Omit<
    CalendarDaysProps,
    | 'onClick'
    | 'referenceDate'
    | 'value'
    | 'displayWeekDayLocale'
    | 'isDateDisabled'
    | 'isDateInRange'
    | 'onDateHover'
    | 'updateReferenceDate'
  >;
  /**
   * Other props you may provide to `CalendarMonths`
   */
  calendarMonthsProps?: Omit<
    CalendarMonthsProps,
    | 'onClick'
    | 'referenceDate'
    | 'value'
    | 'isMonthDisabled'
    | 'isMonthInRange'
    | 'onMonthHover'
    | 'displayMonthLocale'
  >;
  /**
   * Other props you may provide to `CalendarWeeks`
   */
  calendarWeeksProps?: Omit<
    CalendarWeeksProps,
    | 'onClick'
    | 'referenceDate'
    | 'value'
    | 'displayWeekDayLocale'
    | 'isWeekDisabled'
    | 'isWeekInRange'
    | 'onWeekHover'
  >;
  /**
   * Other props you may provide to `CalendarYears`
   */
  calendarYearsProps?: Omit<
    CalendarYearsProps,
    | 'onClick'
    | 'referenceDate'
    | 'value'
    | 'isYearDisabled'
    | 'isYearInRange'
    | 'onYearHover'
  >;
  /**
   * Disabled `Month` calendar button click
   * @default false
   */
  disabledMonthSwitch?: boolean;
  /**
   * Disabled `Year` calendar button click
   * @default false
   */
  disabledYearSwitch?: boolean;
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Click handler for every cell on calendars.
   */
  onChange?: (target: DateType) => void;
  /**
   * Click handler for control button of month.
   */
  onMonthControlClick?: VoidFunction;
  /**
   * Click handler for control button of next.
   */
  onNext?: (currentMode: CalendarMode) => void;
  /**
   * Click handler for control button of next.
   */
  onDoubleNext?: (currentMode: CalendarMode) => void;
  /**
   * Click handler for control button of prev.
   */
  onPrev?: (currentMode: CalendarMode) => void;
  /**
   * Click handler for control button of double prev.
   */
  onDoublePrev?: (currentMode: CalendarMode) => void;
  /**
   * Click handler for control button of year.
   */
  onYearControlClick?: VoidFunction;
  /**
   * The refernce date for getting the calendar.
   * **The type of `referenceDate` should be the same as your declared `DateType`.**
   */
  referenceDate: DateType;
  /**
   * The displaying cells will be marked as active
   * if the single value of it matches any date object in the array. <br />
   * **The type of `value` should be the same as your declared `DateType`.**
   */
  value?: DateType | DateType[];
}

/**
 * The react component for `mezzanine` calendar. <br />
 * Notice that any component related to calendar should be used along with `CalendarContext`. <br />
 * You may use the handlers provided by `useCalendarControls` hook or your own customizd methods.
 */
const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(props, ref) {
    const {
      displayMonthLocale: displayMonthLocaleFromConfig,
      getNow,
      getMonth,
      getMonthShortName,
      getYear,
    } = useCalendarContext();

    const {
      calendarDaysProps,
      calendarMonthsProps,
      calendarWeeksProps,
      calendarYearsProps,
      className,
      disabledMonthSwitch,
      disableOnNext,
      disableOnPrev,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disabledYearSwitch,
      displayMonthLocale = displayMonthLocaleFromConfig,
      displayWeekDayLocale,
      isDateDisabled,
      isDateInRange,
      isMonthDisabled,
      isMonthInRange,
      isWeekDisabled,
      isWeekInRange,
      isYearDisabled,
      isYearInRange,
      mode = 'day',
      onChange,
      onDateHover,
      onMonthControlClick,
      onMonthHover,
      onNext,
      onDoubleNext,
      onPrev,
      onDoublePrev,
      onWeekHover,
      onYearControlClick,
      onYearHover,
      referenceDate,
      value: valueProp,
      ...restCalendarProps
    } = props;

    const value = valueProp ? castArray(valueProp) : undefined;

    /** Compute which calendar to use */
    let displayCalendar;
    let displayFooterControl;

    if (mode === 'day') {
      displayCalendar = (
        <CalendarDays
          {...calendarDaysProps}
          isYearDisabled={isYearDisabled}
          isMonthDisabled={isMonthDisabled}
          isDateDisabled={isDateDisabled}
          isDateInRange={isDateInRange}
          onClick={onChange}
          onDateHover={onDateHover}
          referenceDate={referenceDate}
          displayWeekDayLocale={displayWeekDayLocale}
          value={value}
        />
      );

      displayFooterControl = (
        <CalendarFooterControl onClick={() => onChange?.(getNow())}>
          Today
        </CalendarFooterControl>
      );
    } else if (mode === 'week') {
      displayCalendar = (
        <CalendarWeeks
          {...calendarWeeksProps}
          isYearDisabled={isYearDisabled}
          isMonthDisabled={isMonthDisabled}
          isWeekDisabled={isWeekDisabled}
          isWeekInRange={isWeekInRange}
          onClick={onChange}
          onWeekHover={onWeekHover}
          referenceDate={referenceDate}
          displayWeekDayLocale={displayWeekDayLocale}
          value={value}
        />
      );

      displayFooterControl = (
        <CalendarFooterControl onClick={() => onChange?.(getNow())}>
          This week
        </CalendarFooterControl>
      );
    } else if (mode === 'month') {
      displayCalendar = (
        <CalendarMonths
          {...calendarMonthsProps}
          isYearDisabled={isYearDisabled}
          isMonthDisabled={isMonthDisabled}
          isMonthInRange={isMonthInRange}
          onClick={onChange}
          onMonthHover={onMonthHover}
          referenceDate={referenceDate}
          value={value}
        />
      );

      displayFooterControl = (
        <CalendarFooterControl onClick={() => onChange?.(getNow())}>
          This month
        </CalendarFooterControl>
      );
    } else if (mode === 'year') {
      displayCalendar = (
        <CalendarYears
          {...calendarYearsProps}
          isYearDisabled={isYearDisabled}
          isYearInRange={isYearInRange}
          onClick={onChange}
          onYearHover={onYearHover}
          referenceDate={referenceDate}
          value={value}
        />
      );

      displayFooterControl = (
        <CalendarFooterControl onClick={() => onChange?.(getNow())}>
          This year
        </CalendarFooterControl>
      );
    }

    /** Compute controls outcome */
    const [start, end] = getYearRange(
      getYear(referenceDate),
      calendarYearModuler,
    );
    const displayYearRange = `${start} - ${end}`;
    let controls;

    if (mode === 'day' || mode === 'week') {
      controls = (
        <>
          <button
            type="button"
            disabled={disabledMonthSwitch}
            aria-disabled={disabledMonthSwitch}
            onClick={onMonthControlClick}
          >
            {getMonthShortName(getMonth(referenceDate), displayMonthLocale)}
          </button>
          <button
            type="button"
            disabled={disabledMonthSwitch}
            aria-disabled={disabledMonthSwitch}
            onClick={onYearControlClick}
          >
            {getYear(referenceDate)}
          </button>
        </>
      );
    } else if (mode === 'month') {
      controls = (
        <button
          type="button"
          disabled={disabledYearSwitch}
          aria-disabled={disabledYearSwitch}
          onClick={onYearControlClick}
        >
          {getYear(referenceDate)}
        </button>
      );
    } else if (mode === 'year') {
      controls = (
        <button type="button" disabled aria-disabled>
          {displayYearRange}
        </button>
      );
    }

    return (
      <div
        {...restCalendarProps}
        ref={ref}
        className={cx(classes.host, classes.mode(mode), className)}
      >
        <div className={classes.main}>
          <CalendarControls
            disableOnNext={disableOnNext}
            disableOnPrev={disableOnPrev}
            disableOnDoubleNext={disableOnDoubleNext}
            disableOnDoublePrev={disableOnDoublePrev}
            onDoubleNext={
              onDoubleNext
                ? () => {
                    onDoubleNext(mode);
                  }
                : undefined
            }
            onNext={
              onNext
                ? () => {
                    onNext(mode);
                  }
                : undefined
            }
            onDoublePrev={
              onDoublePrev
                ? () => {
                    onDoublePrev(mode);
                  }
                : undefined
            }
            onPrev={
              onPrev
                ? () => {
                    onPrev(mode);
                  }
                : undefined
            }
          >
            {controls}
          </CalendarControls>
          {displayCalendar}
        </div>
        {displayFooterControl}
      </div>
    );
  },
);

export default Calendar;
