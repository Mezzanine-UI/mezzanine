'use client';

import {
  calendarClasses as classes,
  CalendarMode,
  DateType,
  getYearRange,
  calendarYearModuler,
  calendarQuarterYearsCount,
  calendarHalfYearYearsCount,
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
import CalendarQuarters, { CalendarQuartersProps } from './CalendarQuarters';
import CalendarHalfYears, { CalendarHalfYearsProps } from './CalendarHalfYears';
import CalendarFooterControl from './CalendarFooterControl';
import CalendarQuickSelect, {
  CalendarQuickSelectProps,
} from './CalendarQuickSelect';

export interface CalendarProps
  extends Omit<
      NativeElementPropsWithoutKeyAndRef<'div'>,
      'onChange' | 'children'
    >,
    Pick<
      CalendarDaysProps,
      | 'renderAnnotations'
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
      CalendarQuartersProps,
      'isQuarterDisabled' | 'isQuarterInRange' | 'onQuarterHover'
    >,
    Pick<
      CalendarHalfYearsProps,
      'isHalfYearDisabled' | 'isHalfYearInRange' | 'onHalfYearHover'
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
   * Other props you may provide to `CalendarQuarters`
   */
  calendarQuartersProps?: Omit<
    CalendarQuartersProps,
    | 'onClick'
    | 'referenceDate'
    | 'value'
    | 'isQuarterDisabled'
    | 'isQuarterInRange'
    | 'onQuarterHover'
  >;
  /**
   * Other props you may provide to `CalendarHalfYears`
   */
  calendarHalfYearsProps?: Omit<
    CalendarHalfYearsProps,
    | 'onClick'
    | 'referenceDate'
    | 'value'
    | 'isHalfYearDisabled'
    | 'isHalfYearInRange'
    | 'onHalfYearHover'
  >;
  /**
   * Disabled footer control element
   * @default false
   */
  disabledFooterControl?: boolean;
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
   * The reference date for getting the calendar.
   * **The type of `referenceDate` should be the same as your declared `DateType`.**
   */
  referenceDate: DateType;
  /**
   * Quick select options for calendar.
   * Provide options for users to quickly select specific dates or ranges.
   */
  quickSelect?: Pick<CalendarQuickSelectProps, 'activeId' | 'options'>;
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
      locale,
      getNow,
      getMonth,
      getMonthShortName,
      getYear,
      getCurrentWeekFirstDate,
      getCurrentMonthFirstDate,
      getCurrentYearFirstDate,
      getCurrentQuarterFirstDate,
      getCurrentHalfYearFirstDate,
      setHour,
      setMinute,
      setSecond,
      setMillisecond,
    } = useCalendarContext();

    const {
      renderAnnotations,
      calendarDaysProps,
      calendarMonthsProps,
      calendarWeeksProps,
      calendarYearsProps,
      calendarQuartersProps,
      calendarHalfYearsProps,
      className,
      disabledFooterControl = false,
      disabledMonthSwitch,
      disableOnNext,
      disableOnPrev,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disabledYearSwitch,
      displayMonthLocale = locale,
      displayWeekDayLocale = locale,
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
      onQuarterHover,
      onHalfYearHover,
      quickSelect,
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
          renderAnnotations={renderAnnotations}
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

      if (!disabledFooterControl) {
        displayFooterControl = (
          <CalendarFooterControl
            onClick={() =>
              onChange?.(
                setMillisecond(
                  setSecond(setMinute(setHour(getNow(), 0), 0), 0),
                  0,
                ),
              )
            }
          >
            Today
          </CalendarFooterControl>
        );
      }
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

      if (!disabledFooterControl) {
        displayFooterControl = (
          <CalendarFooterControl
            onClick={() =>
              onChange?.(
                getCurrentWeekFirstDate(getNow(), displayWeekDayLocale),
              )
            }
          >
            This week
          </CalendarFooterControl>
        );
      }
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

      if (!disabledFooterControl) {
        displayFooterControl = (
          <CalendarFooterControl
            onClick={() => onChange?.(getCurrentMonthFirstDate(getNow()))}
          >
            This month
          </CalendarFooterControl>
        );
      }
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

      if (!disabledFooterControl) {
        displayFooterControl = (
          <CalendarFooterControl
            onClick={() => onChange?.(getCurrentYearFirstDate(getNow()))}
          >
            This year
          </CalendarFooterControl>
        );
      }
    } else if (mode === 'quarter') {
      displayCalendar = (
        <CalendarQuarters
          {...calendarQuartersProps}
          isQuarterDisabled={isQuarterDisabled}
          isQuarterInRange={isQuarterInRange}
          onClick={onChange}
          onQuarterHover={onQuarterHover}
          referenceDate={referenceDate}
          value={value}
        />
      );

      if (!disabledFooterControl) {
        displayFooterControl = (
          <CalendarFooterControl
            onClick={() => onChange?.(getCurrentQuarterFirstDate(getNow()))}
          >
            This quarter
          </CalendarFooterControl>
        );
      }
    } else if (mode === 'half-year') {
      displayCalendar = (
        <CalendarHalfYears
          {...calendarHalfYearsProps}
          isHalfYearDisabled={isHalfYearDisabled}
          isHalfYearInRange={isHalfYearInRange}
          onClick={onChange}
          onHalfYearHover={onHalfYearHover}
          referenceDate={referenceDate}
          value={value}
        />
      );

      if (!disabledFooterControl) {
        displayFooterControl = (
          <CalendarFooterControl
            onClick={() => onChange?.(getCurrentHalfYearFirstDate(getNow()))}
          >
            This half year
          </CalendarFooterControl>
        );
      }
    }

    /** Compute controls outcome */
    let controls;

    if (mode === 'day' || mode === 'week') {
      const displayMonth = getMonthShortName(
        getMonth(referenceDate),
        displayMonthLocale,
      );

      const displayYear = getYear(referenceDate);

      controls = (
        <>
          <button
            type="button"
            disabled={disabledMonthSwitch}
            aria-disabled={disabledMonthSwitch}
            aria-label={`Select month, currently ${displayMonth}`}
            onClick={onMonthControlClick}
          >
            {displayMonth}
          </button>
          <button
            type="button"
            disabled={disabledYearSwitch}
            aria-disabled={disabledYearSwitch}
            aria-label={`Select year, currently ${displayYear}`}
            onClick={onYearControlClick}
          >
            {displayYear}
          </button>
        </>
      );
    } else if (mode === 'month') {
      const displayYear = getYear(referenceDate);

      controls = (
        <button
          type="button"
          disabled={disabledYearSwitch}
          aria-disabled={disabledYearSwitch}
          aria-label={`Select year, currently ${displayYear}`}
          onClick={onYearControlClick}
        >
          {displayYear}
        </button>
      );
    } else if (mode === 'year') {
      const [start, end] = getYearRange(
        getYear(referenceDate),
        calendarYearModuler,
      );
      const displayYearRange = `${start} - ${end}`;

      controls = (
        <button
          type="button"
          disabled
          aria-disabled
          aria-label={`Year range ${displayYearRange}`}
        >
          {displayYearRange}
        </button>
      );
    } else if (mode === 'quarter') {
      const [start, end] = getYearRange(
        getYear(referenceDate),
        calendarQuarterYearsCount,
      );
      const displayQuarterYearRange = `${start} - ${end}`;

      controls = (
        <button
          type="button"
          disabled
          aria-disabled
          aria-label={`Quarter year range ${displayQuarterYearRange}`}
        >
          {displayQuarterYearRange}
        </button>
      );
    } else if (mode === 'half-year') {
      const [start, end] = getYearRange(
        getYear(referenceDate),
        calendarHalfYearYearsCount,
      );
      const displayHalfYearYearRange = `${start} - ${end}`;

      controls = (
        <button
          type="button"
          disabled
          aria-disabled
          aria-label={`Half-year range ${displayHalfYearYearRange}`}
        >
          {displayHalfYearYearRange}
        </button>
      );
    }

    return (
      <div
        {...restCalendarProps}
        ref={ref}
        role="application"
        aria-label={`Calendar, ${mode} view`}
        className={cx(classes.host, classes.mode(mode), className)}
      >
        {quickSelect && (
          <CalendarQuickSelect
            activeId={quickSelect.activeId}
            options={quickSelect.options}
          />
        )}
        <div className={classes.mainWithFooter}>
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
      </div>
    );
  },
);

export default Calendar;
