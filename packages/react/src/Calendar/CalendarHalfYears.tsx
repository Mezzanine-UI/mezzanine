'use client';

import {
  calendarClasses as classes,
  DateType,
  calendarHalfYears,
  calendarHalfYearYearsCount,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import { useMemo } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCalendarContext } from './CalendarContext';
import CalendarCell from './CalendarCell';

export interface CalendarHalfYearsProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'onClick' | 'children'
  > {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object as its parameter.
   */
  isHalfYearDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the half-year is in range.
   * The method takes the date object as its parameter.
   */
  isHalfYearInRange?: (date: DateType) => boolean;
  /**
   * Click handler for the button of each half-year.
   * The method takes the date object as its parameter.
   */
  onClick?: (target: DateType) => void;
  /**
   * Mouse enter handler for the button of each half-year.
   * The method takes the date object as its parameter.
   */
  onHalfYearHover?: (target: DateType) => void;
  /**
   * The reference date for getting the half-years range and computing the date object.
   */
  referenceDate: DateType;
  /**
   * The half-year will be marked as active if it matches the same half-year of any value in the array.
   */
  value?: DateType[];
}

/**
 * The react component for `mezzanine` calendar half-years.
 * This component displays half-years for 5 years.
 * You may use it to compose your own calendar.
 */
function CalendarHalfYears(props: CalendarHalfYearsProps) {
  const {
    getYear,
    getCurrentHalfYearFirstDate,
    isHalfYearIncluded,
    setYear,
    setMonth,
  } = useCalendarContext();

  const {
    className,
    isHalfYearDisabled,
    isHalfYearInRange,
    onClick: onClickProp,
    onHalfYearHover,
    referenceDate,
    value,
    ...rest
  } = props;

  const currentYear = getYear(referenceDate);

  const [start] = useMemo(
    () => getYearRange(currentYear, calendarHalfYearYearsCount),
    [currentYear],
  );

  const years = useMemo(() => {
    return Array.from(
      { length: calendarHalfYearYearsCount },
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
            <CalendarCell disabled>{year}</CalendarCell>
            {calendarHalfYears.map((halfYear) => {
              const halfYearStartMonth = (halfYear - 1) * 6;
              const halfYearDate = setMonth(
                setYear(getCurrentHalfYearFirstDate(referenceDate), year),
                halfYearStartMonth,
              );

              const disabled =
                isHalfYearDisabled && isHalfYearDisabled(halfYearDate);
              const inRange =
                !disabled &&
                isHalfYearInRange &&
                isHalfYearInRange(halfYearDate);
              const active =
                !disabled && value && isHalfYearIncluded(halfYearDate, value);

              const onClick = () => {
                if (disabled) return;
                onClickProp?.(halfYearDate);
              };

              const onMouseEnter = () => {
                if (disabled) return;
                onHalfYearHover?.(halfYearDate);
              };

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

              return (
                <button
                  key={halfYear}
                  type="button"
                  disabled={disabled}
                  aria-disabled={disabled}
                  aria-label={ariaLabel}
                  aria-pressed={active}
                  className={cx(classes.button, {
                    [classes.buttonDisabled]: disabled,
                    [classes.buttonInRange]: inRange,
                    [classes.buttonActive]: active,
                  })}
                  onClick={onClick}
                  onMouseEnter={onMouseEnter}
                >
                  H{halfYear}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default CalendarHalfYears;
