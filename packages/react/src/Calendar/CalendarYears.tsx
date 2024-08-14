import {
  calendarClasses as classes,
  DateType,
  getCalendarYearRange,
  calendarYearsBase,
} from '@mezzanine-ui/core/calendar';
import { useMemo } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCalendarContext } from './CalendarContext';

export interface CalendarYearsProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'onClick' | 'children'
  > {
  /**
   * Provide if you have a custom disabling logic.
   * The method takes the date object as its parameter.
   */
  isYearDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the year is in range.
   * The method takes the date object as its parameter.
   */
  isYearInRange?: (date: DateType) => boolean;
  /**
   * Click handler for the button of each year.
   * The method takes the date object as its parameter.
   */
  onClick?: (target: DateType) => void;
  /**
   * Mouse enter handler for the button of each year.
   * The method takes the date object as its parameter.
   */
  onYearHover?: (target: DateType) => void;
  /**
   * The refernce date for getting the years range and computing the date object.
   */
  referenceDate: DateType;
  /**
   * The year will be marked as active if it matches the same year of any value in the array.
   */
  value?: DateType[];
}

/**
 * The react component for `mezzanine` calendar years. <br />
 * This component displays a 12 year grid.
 * You may use it to compose your own calendar.
 */
function CalendarYears(props: CalendarYearsProps) {
  const { getNow, getYear, isYearIncluded, setYear } = useCalendarContext();
  const {
    className,
    isYearDisabled,
    isYearInRange,
    onClick: onClickProp,
    onYearHover,
    referenceDate,
    value,
    ...rest
  } = props;

  const [start] = useMemo(
    () => getCalendarYearRange(getYear(referenceDate)),
    [getYear, referenceDate],
  );

  return (
    <div className={cx(classes.board, className)} {...rest}>
      <div className={classes.twelveGrid}>
        {calendarYearsBase.map((base) => {
          const thisYear = base + start;
          const yearDateType = setYear(getNow(), thisYear);
          const disabled = isYearDisabled && isYearDisabled(yearDateType);
          const inactive = !disabled && (base === 0 || base === 11);
          const active =
            !disabled &&
            !inactive &&
            value &&
            isYearIncluded(yearDateType, value);
          const inRange = isYearInRange && isYearInRange(yearDateType);

          const onClick = onClickProp
            ? () => {
                onClickProp(yearDateType);
              }
            : undefined;
          const onMouseEnter = onYearHover
            ? () => {
                onYearHover(yearDateType);
              }
            : undefined;

          return (
            <button
              key={base + start}
              type="button"
              aria-disabled={disabled}
              disabled={disabled}
              className={cx(classes.button, {
                [classes.buttonActive]: active,
                [classes.buttonInRange]: inRange,
                [classes.buttonDisabled]: disabled,
                [classes.buttonInactive]: inactive,
              })}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
            >
              {thisYear}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarYears;
