'use client';

import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { forwardRef, RefObject, useMemo } from 'react';
import Calendar, {
  CalendarProps,
  useCalendarControls,
  useCalendarContext,
} from '../Calendar';
import InputTriggerPopper, {
  InputTriggerPopperProps,
} from '../_internal/InputTriggerPopper';

export interface DatePickerCalendarProps
  extends Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'>,
    Pick<
      CalendarProps,
      | 'disabledMonthSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'isDateDisabled'
      | 'isMonthDisabled'
      | 'isQuarterDisabled'
      | 'isHalfYearDisabled'
      | 'isWeekDisabled'
      | 'isYearDisabled'
      | 'onChange'
      | 'referenceDate'
    > {
  /**
   * Other calendar props you may provide to `Calendar`.
   */
  calendarProps?: Omit<
    CalendarProps,
    | 'disableOnNext'
    | 'disableOnPrev'
    | 'disableOnDoubleNext'
    | 'disableOnDoublePrev'
    | 'displayMonthLocale'
    | 'isDateDisabled'
    | 'isMonthDisabled'
    | 'isQuarterDisabled'
    | 'isHalfYearDisabled'
    | 'isWeekDisabled'
    | 'isYearDisabled'
    | 'locale'
    | 'mode'
    | 'onChange'
    | 'onMonthControlClick'
    | 'onNext'
    | 'onDoubleNext'
    | 'onPrev'
    | 'onDoublePrev'
    | 'onYearControlClick'
    | 'referenceDate'
    | 'updateReferenceDate'
    | 'value'
  >;
  /**
   * React ref for calendar component.
   */
  calendarRef?: RefObject<HTMLDivElement | null>;
  /**
   * The desired mode of calendar.<br />
   * The `onChange` function will only fired if the calendar mode meets this prop.
   */
  mode?: CalendarMode;
  /**
   * Other props you may provide to `Popper` component
   */
  popperProps?: Omit<
    InputTriggerPopperProps,
    'anchor' | 'children' | 'fadeProps' | 'open'
  >;
  /**
   * The calendar cell will be marked as active if it matches the same date of given value.
   */
  value?: DateType;
}

const DatePickerCalendar = forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  function DatePickerCalendar(props, ref) {
    const {
      displayMonthLocale: displayMonthLocaleFromConfig,
      getMonth,
      getYear,
      setMonth,
      setYear,
    } = useCalendarContext();
    const {
      anchor,
      calendarProps,
      calendarRef,
      disabledMonthSwitch,
      disableOnNext,
      disableOnPrev,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disabledYearSwitch,
      displayMonthLocale = displayMonthLocaleFromConfig,
      fadeProps,
      isDateDisabled,
      isMonthDisabled,
      isQuarterDisabled,
      isHalfYearDisabled,
      isWeekDisabled,
      isYearDisabled,
      mode = 'day',
      onChange: onChangeProp,
      open,
      popperProps,
      referenceDate: referenceDateProp,
      value,
    } = props;
    const { className: calendarClassName, ...restCalendarProps } =
      calendarProps || {};
    const {
      currentMode,
      onMonthControlClick,
      onNext,
      onPrev,
      onDoublePrev,
      onDoubleNext,
      onYearControlClick,
      popModeStack,
      referenceDate,
      updateReferenceDate,
    } = useCalendarControls(referenceDateProp, mode);

    // Helper to handle mode switching with optional value transformation
    const createModeChangeHandler = useMemo(() => {
      return (
        transformValue?: (target: DateType, reference: DateType) => DateType,
      ) => {
        return (target: DateType) => {
          const result = transformValue
            ? transformValue(target, referenceDate)
            : target;

          updateReferenceDate(result);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      };
    }, [
      currentMode,
      mode,
      referenceDate,
      updateReferenceDate,
      popModeStack,
      onChangeProp,
    ]);

    const onChange = useMemo(() => {
      switch (currentMode) {
        case 'day':
        case 'week':
          return createModeChangeHandler();
        case 'month':
          return createModeChangeHandler((target, reference) =>
            currentMode === mode
              ? target
              : setMonth(reference, getMonth(target)),
          );
        case 'year':
          return createModeChangeHandler((target, reference) =>
            currentMode === mode ? target : setYear(reference, getYear(target)),
          );
        case 'quarter':
        case 'half-year':
          return createModeChangeHandler();
        default:
          return undefined;
      }
    }, [
      currentMode,
      mode,
      createModeChangeHandler,
      getMonth,
      setMonth,
      getYear,
      setYear,
    ]);

    return (
      <InputTriggerPopper
        {...popperProps}
        ref={ref}
        anchor={anchor}
        open={open}
        fadeProps={fadeProps}
      >
        <Calendar
          {...restCalendarProps}
          ref={calendarRef}
          className={calendarClassName}
          disabledMonthSwitch={disabledMonthSwitch}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          disableOnDoubleNext={disableOnDoubleNext}
          disableOnDoublePrev={disableOnDoublePrev}
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          isDateDisabled={isDateDisabled}
          isMonthDisabled={isMonthDisabled}
          isQuarterDisabled={isQuarterDisabled}
          isHalfYearDisabled={isHalfYearDisabled}
          isWeekDisabled={isWeekDisabled}
          isYearDisabled={isYearDisabled}
          mode={currentMode}
          onChange={onChange}
          onMonthControlClick={onMonthControlClick}
          onNext={onNext}
          onDoubleNext={onDoubleNext}
          onPrev={onPrev}
          onDoublePrev={onDoublePrev}
          onYearControlClick={onYearControlClick}
          referenceDate={referenceDate}
          value={value}
        />
      </InputTriggerPopper>
    );
  },
);

export default DatePickerCalendar;
