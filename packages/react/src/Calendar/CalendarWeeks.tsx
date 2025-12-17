'use client';

import {
  calendarClasses as classes,
  DateType,
} from '@mezzanine-ui/core/calendar';
import { useMemo } from 'react';
import CalendarCell from './CalendarCell';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import CalendarDayOfWeek, { CalendarDayOfWeekProps } from './CalendarDayOfWeek';
import { useCalendarContext } from './CalendarContext';
import type { CalendarYearsProps } from './CalendarYears';
import type { CalendarMonthsProps } from './CalendarMonths';

export interface CalendarWeeksProps
  extends Pick<CalendarDayOfWeekProps, 'displayWeekDayLocale'>,
    Pick<CalendarYearsProps, 'isYearDisabled'>,
    Pick<CalendarMonthsProps, 'isMonthDisabled'>,
    Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick' | 'children'> {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object of first date in week as its parameter.
   */
  isWeekDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the week is in range.
   * The method takes the date object of first date in week as its parameter.
   */
  isWeekInRange?: (firstDateOfWeek: DateType) => boolean;
  /**
   * Click handler for the button of week row.
   * The method takes the date object of first date in week as its parameter.
   */
  onClick?: (date: DateType) => void;
  /**
   * Mouse enter handler for the button of week row.
   * The method takes the date object of first date in week as its parameter.
   */
  onWeekHover?: (firstDateOfWeek: DateType) => void;
  /**
   * The reference date for getting the dates of calendar.
   */
  referenceDate: DateType;
  /**
   * The week will be marked as active if the first date of week matches the same date of any value in the array.
   */
  value?: DateType[];
}

/**
 * The react component for `mezzanine` calendar weeks. <br />
 * This component displays a monthly calendar whose month is the same as `referenceDate`.
 * You may use it to compose your own calendar.
 */
function CalendarWeeks(props: CalendarWeeksProps) {
  const {
    locale,
    getCalendarGrid,
    getWeek,
    getDate,
    getMonth,
    getNow,
    isInMonth,
    isSameDate,
    isWeekIncluded,
    setDate,
    setMonth,
    setHour,
    setMinute,
    setSecond,
    setMillisecond,
    getCurrentWeekFirstDate,
  } = useCalendarContext();
  const {
    className,
    displayWeekDayLocale = locale,
    isYearDisabled,
    isMonthDisabled,
    isWeekDisabled,
    isWeekInRange,
    onClick: onClickProp,
    onWeekHover,
    referenceDate,
    value,
    ...rest
  } = props;

  const daysGrid = useMemo(
    () => getCalendarGrid(referenceDate, displayWeekDayLocale),
    [getCalendarGrid, referenceDate, displayWeekDayLocale],
  );

  const weekFirstDates = useMemo(() => {
    return daysGrid.map((week, index) => {
      const dateNum = week[0];
      const isPrevMonth = index === 0 && dateNum > 7;
      const isNextMonth = index > 3 && dateNum <= 14;
      const thisMonth = getMonth(referenceDate);

      const month = isPrevMonth
        ? thisMonth - 1
        : isNextMonth
          ? thisMonth + 1
          : thisMonth;

      const weekFirstDate = setDate(setMonth(referenceDate, month), dateNum);

      return getCurrentWeekFirstDate(weekFirstDate, displayWeekDayLocale);
    });
  }, [
    daysGrid,
    getMonth,
    referenceDate,
    setDate,
    setMonth,
    getCurrentWeekFirstDate,
    displayWeekDayLocale,
  ]);

  return (
    <div {...rest} className={cx(classes.board, className)}>
      <div className={classes.week}>
        {weekFirstDates.map((firstDate, idx) => (
          <div key={idx} className={classes.weekRow}>
            <CalendarCell disabled>
              {getWeek(firstDate, displayWeekDayLocale)}
            </CalendarCell>
          </div>
        ))}
      </div>
      <div className={classes.daysGrid}>
        <CalendarDayOfWeek displayWeekDayLocale={displayWeekDayLocale} />
        {daysGrid.map((week, index) => {
          const dates: DateType[] = [];
          const weekStartInPrevMonth = index === 0 && week[0] > 7;
          const weekStartInNextMonth = index > 3 && week[0] <= 14;

          week.forEach((dateNum) => {
            const isPrevMonth = index === 0 && dateNum > 7;
            const isNextMonth = index > 3 && dateNum <= 14;
            const thisMonth = getMonth(referenceDate);

            const month = isPrevMonth
              ? thisMonth - 1
              : isNextMonth
                ? thisMonth + 1
                : thisMonth;
            const date = setMillisecond(
              setSecond(
                setMinute(
                  setHour(setDate(setMonth(referenceDate, month), dateNum), 0),
                  0,
                ),
                0,
              ),
              0,
            );

            dates.push(date);
          });

          const disabled =
            isYearDisabled?.(dates[0]) ||
            isMonthDisabled?.(dates[0]) ||
            isWeekDisabled?.(dates[0]) ||
            false;
          const inactive =
            !disabled && (weekStartInPrevMonth || weekStartInNextMonth);
          const active =
            !disabled &&
            !inactive &&
            value &&
            isWeekIncluded(dates[0], value, displayWeekDayLocale);
          const inRange =
            !disabled && !inactive && isWeekInRange && isWeekInRange(dates[0]);

          const onMouseEnter = onWeekHover
            ? () => {
                onWeekHover(
                  getCurrentWeekFirstDate(dates[0], displayWeekDayLocale),
                );
              }
            : undefined;

          const onClick = onClickProp
            ? () => {
                onClickProp(
                  getCurrentWeekFirstDate(dates[0], displayWeekDayLocale),
                );
              }
            : undefined;

          // Accessible week label for screen readers
          const firstDate = new Date(dates[0]);
          const lastDate = new Date(dates[dates.length - 1]);
          const weekNum = getWeek(dates[0], displayWeekDayLocale);
          const startMonth = firstDate.toLocaleDateString(
            displayWeekDayLocale,
            { month: 'short' },
          );
          const endMonth = lastDate.toLocaleDateString(displayWeekDayLocale, {
            month: 'short',
          });
          const startDay = firstDate.getDate();
          const endDay = lastDate.getDate();

          const ariaLabel = [
            `Week ${weekNum}`,
            `${startMonth} ${startDay} to ${endMonth} ${endDay}`,
            active && 'Selected',
            disabled && 'Not available',
            inactive && 'Outside current month',
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <button
              key={`CALENDAR_WEEKS/WEEK_OF/${index}`}
              type="button"
              className={cx(classes.button, classes.row, {
                [classes.buttonActive]: active,
                [classes.buttonInRange]: inRange,
                [classes.buttonDisabled]: disabled,
              })}
              disabled={disabled}
              aria-disabled={disabled}
              aria-label={ariaLabel}
              aria-pressed={active}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
            >
              {week.map((dateNum, dateIndex) => (
                <CalendarCell
                  key={`${getMonth(dates[dateIndex])}/${getDate(dates[dateIndex])}`}
                  today={isSameDate(dates[dateIndex], getNow())}
                  disabled={
                    disabled ||
                    !isInMonth(dates[dateIndex], getMonth(referenceDate))
                  }
                  active={active}
                >
                  {dateNum}
                </CalendarCell>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarWeeks;
