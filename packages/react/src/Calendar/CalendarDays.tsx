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

export interface CalendarDaysProps
  extends Pick<CalendarDayOfWeekProps, 'displayWeekDayLocale'>,
    Pick<CalendarYearsProps, 'isYearDisabled'>,
    Pick<CalendarMonthsProps, 'isMonthDisabled'>,
    Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick' | 'children'> {
  /**
   * Provide if you have a custom disabling logic. The method takes the date object as its parameter.
   */
  isDateDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the date is in range.
   * The method takes the date object as its parameter.
   */
  isDateInRange?: (date: DateType) => boolean;
  /**
   * Click handler for date button.
   */
  onClick?: (date: DateType) => void;
  /**
   * Mouse enter handler for date button.
   */
  onDateHover?: (date: DateType) => void;
  /**
   * The refernce date for getting the month of the calendar.
   */
  referenceDate: DateType;
  /**
   * If provided, each date that matches the same dates in this array will be marked as active.
   */
  value?: DateType[];
}

/**
 * The react component for `mezzanine` calendar days. <br />
 * This component displays a monthly calendar whose month is the same as `referenceDate`.
 * You may use it to compose your own calendar.
 */
function CalendarDays(props: CalendarDaysProps) {
  const {
    displayWeekDayLocale: displayWeekDayLocaleFromConfig,
    getCalendarGrid,
    getDate,
    getMonth,
    getNow,
    isDateIncluded,
    isSameDate,
    setDate,
    setMonth,
  } = useCalendarContext();
  const {
    className,
    displayWeekDayLocale = displayWeekDayLocaleFromConfig,
    isYearDisabled,
    isMonthDisabled,
    isDateDisabled,
    isDateInRange,
    onClick: onClickProp,
    onDateHover,
    referenceDate,
    value,
    ...rest
  } = props;

  const daysGrid = useMemo(
    () => getCalendarGrid(referenceDate),
    [getCalendarGrid, referenceDate],
  );

  return (
    <div {...rest} className={cx(classes.board, className)}>
      <div className={classes.daysGrid}>
        <CalendarDayOfWeek displayWeekDayLocale={displayWeekDayLocale} />
        {daysGrid.map((week, index) => (
          <div key={`CALENDAR_DAYS/WEEK_OF/${index}`} className={classes.row}>
            {week.map((dateNum) => {
              const isPrevMonth = index === 0 && dateNum > 7;
              const isNextMonth = index > 3 && dateNum <= 14;
              const thisMonth = getMonth(referenceDate);

              const month = isPrevMonth
                ? thisMonth - 1
                : isNextMonth
                  ? thisMonth + 1
                  : thisMonth;
              const date = setDate(setMonth(referenceDate, month), dateNum);
              const disabled =
                isYearDisabled?.(date) ||
                isMonthDisabled?.(date) ||
                isDateDisabled?.(date) ||
                false;
              const inactive = !disabled && (isPrevMonth || isNextMonth);
              const inRange = !inactive && isDateInRange && isDateInRange(date);
              const active =
                !disabled && !inactive && value && isDateIncluded(date, value);

              const onMouseEnter = onDateHover
                ? () => {
                    onDateHover(date);
                  }
                : undefined;

              const onClick = onClickProp
                ? () => {
                    onClickProp(date);
                  }
                : undefined;

              return (
                <CalendarCell
                  key={`${getMonth(date)}/${getDate(date)}`}
                  today={isSameDate(date, getNow())}
                  active={active}
                  disabled={isPrevMonth || isNextMonth}
                >
                  <button
                    type="button"
                    aria-disabled={disabled}
                    disabled={disabled}
                    onMouseEnter={onMouseEnter}
                    className={cx(classes.button, {
                      [classes.buttonInRange]: inRange,
                      [classes.buttonActive]: active,
                      [classes.buttonDisabled]: disabled,
                    })}
                    onClick={onClick}
                  >
                    {dateNum}
                  </button>
                </CalendarCell>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarDays;
