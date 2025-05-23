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
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'isDateDisabled'
      | 'isMonthDisabled'
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
    | 'displayMonthLocale'
    | 'isDateDisabled'
    | 'isMonthDisabled'
    | 'isWeekDisabled'
    | 'isYearDisabled'
    | 'locale'
    | 'mode'
    | 'onChange'
    | 'onMonthControlClick'
    | 'onNext'
    | 'onPrev'
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

/**
 * The react component for `mezzanine` date picker calendar.
 */
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
      disabledYearSwitch,
      displayMonthLocale = displayMonthLocaleFromConfig,
      fadeProps,
      isDateDisabled,
      isMonthDisabled,
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
      onYearControlClick,
      popModeStack,
      referenceDate,
      updateReferenceDate,
    } = useCalendarControls(referenceDateProp, mode);

    const onChange = useMemo(() => {
      if (currentMode === 'day' || currentMode === 'week') {
        return (target: DateType) => {
          updateReferenceDate(target);

          popModeStack();

          if (onChangeProp) {
            onChangeProp(target);
          }
        };
      }

      if (currentMode === 'month') {
        return (target: DateType) => {
          const result =
            currentMode === mode
              ? target
              : setMonth(referenceDate, getMonth(target));

          updateReferenceDate(result);

          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }

      if (currentMode === 'year') {
        return (target: DateType) => {
          const result =
            currentMode === mode
              ? target
              : setYear(referenceDate, getYear(target));

          updateReferenceDate(result);

          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }
    }, [
      currentMode,
      referenceDate,
      updateReferenceDate,
      popModeStack,
      mode,
      onChangeProp,
      setMonth,
      getMonth,
      setYear,
      getYear,
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
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          isDateDisabled={isDateDisabled}
          isMonthDisabled={isMonthDisabled}
          isWeekDisabled={isWeekDisabled}
          isYearDisabled={isYearDisabled}
          mode={currentMode}
          onChange={onChange}
          onMonthControlClick={onMonthControlClick}
          onNext={onNext}
          onPrev={onPrev}
          onYearControlClick={onYearControlClick}
          referenceDate={referenceDate}
          value={value}
        />
      </InputTriggerPopper>
    );
  },
);

export default DatePickerCalendar;
