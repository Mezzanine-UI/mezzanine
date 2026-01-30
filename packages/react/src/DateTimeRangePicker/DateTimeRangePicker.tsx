'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import { dateTimeRangePickerClasses as classes } from '@mezzanine-ui/core/date-time-range-picker';
import {
  LongTailArrowDownIcon,
  LongTailArrowRightIcon,
} from '@mezzanine-ui/icons';
import { forwardRef, useCallback, useMemo } from 'react';
import DateTimePicker, { DateTimePickerProps } from '../DateTimePicker';
import Icon from '../Icon';
import { cx } from '../utils/cx';

export type DateTimeRangePickerValue = [
  DateType | undefined,
  DateType | undefined,
];

export interface DateTimeRangePickerProps
  extends Omit<
    DateTimePickerProps,
    'defaultValue' | 'onChange' | 'value' | 'ref' | 'prefix'
  > {
  /**
   * CSS class name for the host element.
   */
  className?: string;
  /**
   * The direction of the two date-time pickers.
   * @default 'row'
   */
  direction?: 'row' | 'column';
  /**
   * Change handler for the range value.
   * Called when either from or to value changes.
   */
  onChange?: (value: DateTimeRangePickerValue) => void;
  /**
   * Current value of date-time range picker.
   * Array of [from, to] where each can be a DateType or undefined.
   */
  value?: DateTimeRangePickerValue;
}

/**
 * The react component for `mezzanine` date-time range picker.
 * This component combines two DateTimePicker components for selecting a date-time range.
 * Notice that any component related to date-time picker should be used along with `CalendarContext`.
 */
const DateTimeRangePicker = forwardRef<
  HTMLDivElement,
  DateTimeRangePickerProps
>(function DateTimeRangePicker(props, ref) {
  const {
    className,
    direction = 'row',
    onChange: onChangeProp,
    value: valueProp,
    // Shared DateTimePicker props
    calendarProps,
    calendarRef,
    clearable,
    disabled,
    disabledMonthSwitch,
    disabledYearSwitch,
    disableOnDoubleNext,
    disableOnDoublePrev,
    disableOnNext,
    disableOnPrev,
    displayMonthLocale,
    error,
    fadeProps,
    formatDate,
    formatTime,
    fullWidth,
    hideHour,
    hideMinute,
    hideSecond,
    hourStep,
    isDateDisabled,
    isHalfYearDisabled,
    isMonthDisabled,
    isQuarterDisabled,
    isWeekDisabled,
    isYearDisabled,
    minuteStep,
    mode,
    onClear,
    onPanelToggle,
    placeholderLeft,
    placeholderRight,
    popperProps,
    popperPropsTime,
    readOnly,
    referenceDate,
    required,
    secondStep,
    size,
  } = props;

  const fromValue = useMemo(() => valueProp?.[0], [valueProp]);
  const toValue = useMemo(() => valueProp?.[1], [valueProp]);

  // Handler for "from" DateTimePicker change
  const handleFromChange = useCallback(
    (newFrom?: DateType) => {
      if (!onChangeProp) return;

      onChangeProp([newFrom, toValue]);
    },
    [onChangeProp, toValue],
  );

  // Handler for "to" DateTimePicker change
  const handleToChange = useCallback(
    (newTo?: DateType) => {
      if (!onChangeProp) return;

      onChangeProp([fromValue, newTo]);
    },
    [onChangeProp, fromValue],
  );

  const sharedProps: Partial<DateTimePickerProps> = useMemo(
    () => ({
      calendarProps,
      calendarRef,
      clearable,
      disabled,
      disabledMonthSwitch,
      disabledYearSwitch,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disableOnNext,
      disableOnPrev,
      displayMonthLocale,
      error,
      fadeProps,
      formatDate,
      formatTime,
      fullWidth,
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      isDateDisabled,
      isHalfYearDisabled,
      isMonthDisabled,
      isQuarterDisabled,
      isWeekDisabled,
      isYearDisabled,
      minuteStep,
      mode,
      onClear,
      onPanelToggle,
      placeholderLeft,
      placeholderRight,
      popperProps,
      popperPropsTime,
      readOnly,
      referenceDate,
      required,
      secondStep,
      size,
    }),
    [
      calendarProps,
      calendarRef,
      clearable,
      disabled,
      disabledMonthSwitch,
      disabledYearSwitch,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disableOnNext,
      disableOnPrev,
      displayMonthLocale,
      error,
      fadeProps,
      formatDate,
      formatTime,
      fullWidth,
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      isDateDisabled,
      isHalfYearDisabled,
      isMonthDisabled,
      isQuarterDisabled,
      isWeekDisabled,
      isYearDisabled,
      minuteStep,
      mode,
      onClear,
      onPanelToggle,
      placeholderLeft,
      placeholderRight,
      popperProps,
      popperPropsTime,
      readOnly,
      referenceDate,
      required,
      secondStep,
      size,
    ],
  );

  const ArrowIcon =
    direction === 'column' ? LongTailArrowDownIcon : LongTailArrowRightIcon;

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        direction === 'column' ? classes.column : classes.row,
        className,
      )}
    >
      <DateTimePicker
        {...sharedProps}
        onChange={handleFromChange}
        value={fromValue}
      />
      <Icon className={classes.arrow} icon={ArrowIcon} />
      <DateTimePicker
        {...sharedProps}
        onChange={handleToChange}
        value={toValue}
      />
    </div>
  );
});

export default DateTimeRangePicker;
