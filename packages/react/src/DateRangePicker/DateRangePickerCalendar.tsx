'use client';

import { DateType, CalendarMode } from '@mezzanine-ui/core/calendar';
import { forwardRef } from 'react';
import { RangeCalendar, RangeCalendarProps } from '../Calendar';
import InputTriggerPopper, {
  InputTriggerPopperProps,
} from '../_internal/InputTriggerPopper';

export interface DateRangePickerCalendarProps
  extends Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>,
    Pick<
      RangeCalendarProps,
      | 'actions'
      | 'calendarProps'
      | 'disabledMonthSwitch'
      | 'disabledYearSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'displayMonthLocale'
      | 'displayWeekDayLocale'
      | 'firstCalendarRef'
      | 'isDateDisabled'
      | 'isDateInRange'
      | 'isMonthDisabled'
      | 'isMonthInRange'
      | 'isWeekDisabled'
      | 'isWeekInRange'
      | 'isYearDisabled'
      | 'isYearInRange'
      | 'isQuarterDisabled'
      | 'isQuarterInRange'
      | 'isHalfYearDisabled'
      | 'isHalfYearInRange'
      | 'onDateHover'
      | 'onWeekHover'
      | 'onMonthHover'
      | 'onYearHover'
      | 'onQuarterHover'
      | 'onHalfYearHover'
      | 'quickSelect'
      | 'renderAnnotations'
      | 'secondCalendarRef'
      | 'value'
    > {
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Click handler for every cell on calendars.
   * When completing a range (second click), returns normalized [start, end].
   * When starting a new range (first click), returns the clicked date.
   */
  onChange?: (value: [DateType, DateType | undefined]) => void;
  /**
   * Other props you may provide to `Popper` component
   */
  popperProps?: Omit<
    InputTriggerPopperProps,
    'anchor' | 'children' | 'fadeProps' | 'open'
  >;
  /**
   * The reference date for getting the calendar.
   */
  referenceDate: DateType;
}

/**
 * The react component for `mezzanine` date range picker calendar.
 * This is a wrapper around RangeCalendar with InputTriggerPopper for popup behavior.
 */
const DateRangePickerCalendar = forwardRef<
  HTMLDivElement,
  DateRangePickerCalendarProps
>(function DateRangePickerCalendar(props, ref) {
  const {
    actions,
    anchor,
    calendarProps,
    disabledMonthSwitch,
    disableOnNext,
    disableOnPrev,
    disableOnDoubleNext,
    disableOnDoublePrev,
    disabledYearSwitch,
    displayMonthLocale,
    displayWeekDayLocale,
    fadeProps,
    firstCalendarRef,
    isDateDisabled,
    isDateInRange,
    isHalfYearDisabled,
    isHalfYearInRange,
    isMonthDisabled,
    isMonthInRange,
    isQuarterDisabled,
    isQuarterInRange,
    isWeekDisabled,
    isWeekInRange,
    isYearDisabled,
    isYearInRange,
    mode = 'day',
    onChange,
    onDateHover,
    onHalfYearHover,
    onMonthHover,
    onQuarterHover,
    onWeekHover,
    onYearHover,
    open,
    popperProps,
    quickSelect,
    referenceDate,
    renderAnnotations,
    secondCalendarRef,
    value,
  } = props;

  return (
    <InputTriggerPopper
      {...popperProps}
      ref={ref}
      anchor={anchor}
      fadeProps={fadeProps}
      open={open}
    >
      <RangeCalendar
        actions={actions}
        calendarProps={calendarProps}
        disabledMonthSwitch={disabledMonthSwitch}
        disabledYearSwitch={disabledYearSwitch}
        disableOnDoubleNext={disableOnDoubleNext}
        disableOnDoublePrev={disableOnDoublePrev}
        disableOnNext={disableOnNext}
        disableOnPrev={disableOnPrev}
        displayMonthLocale={displayMonthLocale}
        displayWeekDayLocale={displayWeekDayLocale}
        firstCalendarRef={firstCalendarRef}
        isDateDisabled={isDateDisabled}
        isDateInRange={isDateInRange}
        isHalfYearDisabled={isHalfYearDisabled}
        isHalfYearInRange={isHalfYearInRange}
        isMonthDisabled={isMonthDisabled}
        isMonthInRange={isMonthInRange}
        isQuarterDisabled={isQuarterDisabled}
        isQuarterInRange={isQuarterInRange}
        isWeekDisabled={isWeekDisabled}
        isWeekInRange={isWeekInRange}
        isYearDisabled={isYearDisabled}
        isYearInRange={isYearInRange}
        mode={mode}
        onChange={onChange}
        onDateHover={onDateHover}
        onHalfYearHover={onHalfYearHover}
        onMonthHover={onMonthHover}
        onQuarterHover={onQuarterHover}
        onWeekHover={onWeekHover}
        onYearHover={onYearHover}
        quickSelect={quickSelect}
        referenceDate={referenceDate}
        renderAnnotations={renderAnnotations}
        secondCalendarRef={secondCalendarRef}
        value={value}
      />
    </InputTriggerPopper>
  );
});

export default DateRangePickerCalendar;
