'use client';

import {
  calendarClasses as classes,
  DateType,
  calendarMonths,
} from '@mezzanine-ui/core/calendar';
import type { CalendarYearsProps } from './CalendarYears';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCalendarContext } from './CalendarContext';

export interface CalendarMonthsProps
  extends Omit<
      NativeElementPropsWithoutKeyAndRef<'div'>,
      'onClick' | 'children'
    >,
    Pick<CalendarYearsProps, 'isYearDisabled'> {
  /**
   * The locale you want to use when rendering the names of month.
   * If none provided, it will use the `displayMonthLocale` from calendar context.
   */
  displayMonthLocale?: string;
  /**
   * Provide if you have a custom disabling logic. The method takes the date object as its parameter.
   */
  isMonthDisabled?: (date: DateType) => boolean;
  /**
   * Provide if you have a custom logic for checking if the month is in range.
   * The method takes the date object as its parameter.
   */
  isMonthInRange?: (date: DateType) => boolean;
  /**
   * Click handler for each month button.
   */
  onClick?: (target: DateType) => void;
  /**
   * Mouse enter handler for each month button.
   */
  onMonthHover?: (target: DateType) => void;
  /**
   * The refernce date for computing the date object.
   */
  referenceDate: DateType;
  /**
   * If provided, each month that matches the same months in this array will be marked as active.
   */
  value?: DateType[];
}

/**
 * The react component for `mezzanine` calendar months. <br />
 * This component displays a 12 months grid.
 * You may use it to compose your own calendar.
 */
function CalendarMonths(props: CalendarMonthsProps) {
  const {
    displayMonthLocale: displayMonthLocaleFromConfig,
    getMonthShortNames,
    isMonthIncluded,
    getCurrentMonthFirstDate,
    setMonth,
  } = useCalendarContext();
  const {
    className,
    displayMonthLocale = displayMonthLocaleFromConfig,
    isMonthDisabled,
    isMonthInRange,
    isYearDisabled,
    onClick: onClickProp,
    onMonthHover,
    referenceDate,
    value,
    ...rest
  } = props;

  const monthNames = getMonthShortNames(displayMonthLocale);

  return (
    <div className={cx(classes.board, className)} {...rest}>
      <div className={classes.twelveGrid}>
        {calendarMonths.map((month) => {
          const monthDateType = setMonth(
            getCurrentMonthFirstDate(referenceDate),
            month,
          );
          const active = value && isMonthIncluded(monthDateType, value);
          /** @NOTE Current month should be disabled when current year is disabled */
          const disabled =
            isYearDisabled?.(monthDateType) ||
            isMonthDisabled?.(monthDateType) ||
            false;
          const inRange = isMonthInRange && isMonthInRange(monthDateType);

          const onClick = onClickProp
            ? () => {
                onClickProp(monthDateType);
              }
            : undefined;
          const onMouseEnter = onMonthHover
            ? () => {
                onMonthHover(monthDateType);
              }
            : undefined;

          return (
            <button
              key={month}
              type="button"
              aria-disabled={disabled}
              disabled={disabled}
              className={cx(classes.button, {
                [classes.buttonActive]: active,
                [classes.buttonInRange]: inRange,
                [classes.buttonDisabled]: disabled,
              })}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
            >
              {monthNames[month]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarMonths;
