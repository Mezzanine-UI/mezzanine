import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { datePickerClasses as classes } from '@mezzanine-ui/core/date-picker';
import {
  forwardRef,
  RefObject,
  useMemo,
} from 'react';
import Calendar, { CalendarProps, useCalendarControls } from '../Calendar';
import { useCalendarContext } from '../Calendar/CalendarContext';
import Popper, { PopperProps } from '../Popper';
import { Fade, FadeProps } from '../Transition';
import { cx } from '../utils/cx';

export interface DatePickerCalendarProps
  extends
  Pick<PopperProps, 'anchor' | 'open'>,
  Pick<CalendarProps,
  | 'disableOnNext'
  | 'disableOnPrev'
  | 'displayMonthLocale'
  | 'isDateDisabled'
  | 'isMonthDisabled'
  | 'isYearDisabled'
  | 'onChange'
  | 'referenceDate'> {
  /**
   * Other calendar props you may provide to `Calendar`.
   */
  calendarProps?: Omit<CalendarProps,
  | 'disableOnNext'
  | 'disableOnPrev'
  | 'displayMonthLocale'
  | 'isDateDisabled'
  | 'isMonthDisabled'
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
  | 'value'>;
  /**
   * Other fade props you may provide to `Fade`.
   */
  fadeProps?: Omit<FadeProps, 'children' | 'in'>;
  /**
   * Other popper props you may provide to `Popper`.
   */
  popperProps?: Omit<PopperProps, 'anchor' | 'open'>;
  /**
   * React ref for calendar component.
   */
  calendarRef?: RefObject<HTMLDivElement>;
  /**
   * The desired mode of calendar.<br />
   * The `onChange` function will only fired if the calendar mode meets this prop.
   */
  mode?: CalendarMode;
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
      getDate,
      getMonth,
      getYear,
      setDate,
      setMonth,
      setYear,
    } = useCalendarContext();
    const {
      anchor,
      calendarProps,
      calendarRef,
      disableOnNext,
      disableOnPrev,
      displayMonthLocale = displayMonthLocaleFromConfig,
      fadeProps,
      isDateDisabled,
      isMonthDisabled,
      isYearDisabled,
      mode = 'day',
      onChange: onChangeProp,
      open,
      popperProps,
      referenceDate: referenceDateProp,
      value,
    } = props;
    const {
      className: calendarClassName,
    } = calendarProps || {};
    const {
      options,
      ...restPopperProps
    } = popperProps || {};
    const {
      modifiers = [],
      ...restPopperOptions
    } = options || {};
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
          const result = currentMode === mode ? target : setDate(referenceDate, getDate(target));

          updateReferenceDate(result);

          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }

      if (currentMode === 'month') {
        return (target: DateType) => {
          const result = currentMode === mode ? target : setMonth(referenceDate, getMonth(target));

          updateReferenceDate(result);

          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }

      if (currentMode === 'year') {
        return (target: DateType) => {
          const result = currentMode === mode ? target : setYear(referenceDate, getYear(target));

          updateReferenceDate(result);

          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }
    }, [
      currentMode,
      setDate,
      referenceDate,
      getDate,
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
      <Fade
        {...fadeProps}
        in={open}
        ref={ref}
      >
        <Popper
          {...restPopperProps}
          open
          anchor={anchor}
          className={classes.popper}
          options={{
            placement: 'bottom-start',
            ...restPopperOptions,
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 4],
                },
              },
              ...modifiers,
            ],
          }}
        >
          <Calendar
            {...calendarProps}
            ref={calendarRef}
            className={cx(
              classes.calendar,
              calendarClassName,
            )}
            disableOnNext={disableOnNext}
            disableOnPrev={disableOnPrev}
            displayMonthLocale={displayMonthLocale}
            isDateDisabled={isDateDisabled}
            isMonthDisabled={isMonthDisabled}
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
        </Popper>
      </Fade>
    );
  },
);

export default DatePickerCalendar;
