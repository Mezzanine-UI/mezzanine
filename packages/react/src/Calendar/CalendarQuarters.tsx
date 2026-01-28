'use client';

import {
  calendarClasses as classes,
  DateType,
  calendarQuarters,
  calendarQuarterYearsCount,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import { useMemo } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCalendarContext } from './CalendarContext';
import CalendarCell from './CalendarCell';

export interface CalendarQuartersProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'onClick' | 'children'
  > {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object as its parameter.
   */
  isQuarterDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the quarter is in range.
   * The method takes the date object as its parameter.
   */
  isQuarterInRange?: (date: DateType) => boolean;
  /**
   * Click handler for the button of each quarter.
   * The method takes the date object as its parameter.
   */
  onClick?: (target: DateType) => void;
  /**
   * Mouse enter handler for the button of each quarter.
   * The method takes the date object as its parameter.
   */
  onQuarterHover?: (target: DateType) => void;
  /**
   * The reference date for getting the quarters range and computing the date object.
   */
  referenceDate: DateType;
  /**
   * The quarter will be marked as active if it matches the same quarter of any value in the array.
   */
  value?: DateType[];
}

/**
 * The react component for `mezzanine` calendar quarters.
 */
function CalendarQuarters(props: CalendarQuartersProps) {
  const {
    getNow,
    getYear,
    getCurrentQuarterFirstDate,
    isQuarterIncluded,
    setYear,
    setMonth,
  } = useCalendarContext();

  const {
    className,
    isQuarterDisabled,
    isQuarterInRange,
    onClick: onClickProp,
    onQuarterHover,
    referenceDate,
    value,
    ...rest
  } = props;

  const currentYear = getYear(referenceDate);

  const [start] = useMemo(
    () => getYearRange(currentYear, calendarQuarterYearsCount),
    [currentYear],
  );

  const years = useMemo(() => {
    return Array.from(
      { length: calendarQuarterYearsCount },
      (_, i) => start + i,
    );
  }, [start]);

  return (
    <div className={cx(classes.board, className)} {...rest}>
      {years.map((year, yearIndex) => {
        return (
          <div
            key={year}
            className={cx(classes.row, {
              [classes.rowWithBorder]: yearIndex > 0,
            })}
          >
            <CalendarCell disabled mode="quarter">
              {year}
            </CalendarCell>
            {calendarQuarters.map((quarter) => {
              const quarterStartMonth = (quarter - 1) * 3;
              const quarterDate = setMonth(
                setYear(
                  getCurrentQuarterFirstDate(
                    getCurrentQuarterFirstDate(referenceDate),
                  ),
                  year,
                ),
                quarterStartMonth,
              );

              const active = value && isQuarterIncluded(quarterDate, value);
              const disabled =
                isQuarterDisabled && isQuarterDisabled(quarterDate);
              const inRange = isQuarterInRange && isQuarterInRange(quarterDate);
              const isRangeStart =
                value && value.length > 0
                  ? isQuarterIncluded(quarterDate, [value[0]])
                  : false;
              const isRangeEnd =
                value && value.length > 0
                  ? isQuarterIncluded(quarterDate, [value[value.length - 1]])
                  : false;

              const onClick = onClickProp
                ? () => {
                    onClickProp(quarterDate);
                  }
                : undefined;

              const onMouseEnter = onQuarterHover
                ? () => {
                    onQuarterHover(quarterDate);
                  }
                : undefined;

              // Accessible quarter label for screen readers
              const quarterMonths = [
                ['January', 'February', 'March'],
                ['April', 'May', 'June'],
                ['July', 'August', 'September'],
                ['October', 'November', 'December'],
              ];
              const monthNames = quarterMonths[quarter - 1].join(', ');

              const ariaLabel = [
                `Quarter ${quarter}, ${year}`,
                `${monthNames}`,
                active && 'Selected',
                disabled && 'Not available',
              ]
                .filter(Boolean)
                .join(', ');

              return (
                <CalendarCell
                  key={quarter}
                  mode="quarter"
                  today={isQuarterIncluded(quarterDate, [getNow()])}
                  active={active}
                  isRangeStart={isRangeStart}
                  isRangeEnd={isRangeEnd}
                >
                  <button
                    type="button"
                    disabled={disabled}
                    aria-disabled={disabled}
                    aria-label={ariaLabel}
                    aria-pressed={active}
                    className={cx(classes.button, {
                      [classes.buttonActive]: active,
                      [classes.buttonInRange]: inRange,
                      [classes.buttonDisabled]: disabled,
                    })}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                  >
                    Q{quarter}
                  </button>
                </CalendarCell>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default CalendarQuarters;
