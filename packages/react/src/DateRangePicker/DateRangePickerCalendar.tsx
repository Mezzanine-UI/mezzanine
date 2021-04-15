import { DateType } from '@mezzanine-ui/core/calendar';
import { dateRangePickerClasses as classes } from '@mezzanine-ui/core/date-range-picker';
import {
  forwardRef,
  RefObject,
  useCallback,
  useState,
} from 'react';
import Calendar, { CalendarProps } from '../Calendar';
import { useCalendarContext } from '../Calendar/CalendarContext';
import Popper, { PopperProps } from '../Popper';
import { Fade, FadeProps } from '../Transition';
import { cx } from '../utils/cx';
import { useDateRangeCalendarControls } from './useDateRangeCalendarControls';

export interface DateRangePickerCalendarProps
  extends
  Pick<PopperProps, 'anchor' | 'open'>,
  Pick<CalendarProps,
  | 'value'
  | 'onChange'
  | 'displayMonthLocale'
  | 'mode'
  | 'isDateInRange'
  | 'isDateDisabled'
  | 'isMonthDisabled'
  | 'isMonthInRange'
  | 'isWeekInRange'
  | 'isYearDisabled'
  | 'isYearInRange'
  | 'onDateHover'
  | 'onWeekHover'
  | 'onMonthHover'
  | 'onYearHover'
  | 'referenceDate'
  > {
  /**
   * Other props you may pass to calendar component.
   */
  calendarProps?: Omit<CalendarProps, keyof DateRangePickerCalendarProps> ;
  /**
   * Other props you may pass to fade component.
   */
  fadeProps?: Omit<FadeProps, 'children' | 'in'>;
  /**
   * React Ref for the first(on the left side) calendar
   */
  firstCalendarRef?: RefObject<HTMLDivElement>;
  /**
   * Other props you may pass to popper component.
   */
  popperProps?: Omit<PopperProps, 'anchor' | 'open'>;
  /**
   * React Ref for the second(on the right side) calendar
   */
  secondCalendarRef?: RefObject<HTMLDivElement>;
}

/**
 * The react component for `mezzanine` date range picker calendar.
 */
const DateRangePickerCalendar = forwardRef<HTMLDivElement, DateRangePickerCalendarProps>(
  function DateRangePickerCalendar(props, ref) {
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
      displayMonthLocale = displayMonthLocaleFromConfig,
      fadeProps,
      firstCalendarRef,
      isDateDisabled,
      isDateInRange,
      isMonthDisabled,
      isMonthInRange,
      isWeekInRange,
      isYearDisabled,
      isYearInRange,
      mode = 'day',
      onChange: onChangeProp,
      onDateHover,
      onMonthHover,
      onWeekHover,
      onYearHover,
      open,
      popperProps,
      referenceDate: referenceDateProp,
      secondCalendarRef,
      value,
    } = props;
    const {
      options,
      ...restPopperProps
    } = popperProps || {};
    const {
      modifiers = [],
      ...restPopperOptions
    } = options || {};
    const {
      className,
      ...restCalendarProps
    } = calendarProps || {};

    const popperOptions: PopperProps['options'] = {
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
    };

    const {
      currentMode,
      onMonthControlClick: onMonthControlClickFromHook,
      onFirstNext,
      onFirstPrev,
      onSecondNext,
      onSecondPrev,
      onYearControlClick: onYearControlClickFromHook,
      popModeStack,
      referenceDates,
      updateFirstReferenceDate,
      updateSecondReferenceDate,
    } = useDateRangeCalendarControls(
      referenceDateProp,
      mode,
    );

    const onChangeFactory = useCallback((calendar: 0 | 1) => {
      const targetDate = referenceDates[calendar];
      const updateReferenceDate = calendar ? updateSecondReferenceDate : updateFirstReferenceDate;

      if (currentMode === 'day' || currentMode === 'week') {
        return (target: DateType) => {
          const result = currentMode === mode ? target : setDate(targetDate, getDate(target));

          updateReferenceDate(result);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }

      if (currentMode === 'month') {
        return (target: DateType) => {
          const result = currentMode === mode ? target : setMonth(targetDate, getMonth(target));

          updateReferenceDate(result);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }

      if (currentMode === 'year') {
        return (target: DateType) => {
          const result = currentMode === mode ? target : setYear(targetDate, getYear(target));

          updateReferenceDate(result);
          popModeStack();

          if (currentMode === mode && onChangeProp) {
            onChangeProp(result);
          }
        };
      }
    }, [
      currentMode,
      getDate,
      getMonth,
      getYear,
      mode,
      onChangeProp,
      popModeStack,
      referenceDates,
      setDate,
      setMonth,
      setYear,
      updateFirstReferenceDate,
      updateSecondReferenceDate,
    ]);

    const [controlPanelOnLeft, setControlPanelOnLeft] = useState(true);

    const onMonthControlClickFactory = useCallback((calendar: 0 | 1) => {
      if (calendar) {
        return () => {
          setControlPanelOnLeft(false);
          onMonthControlClickFromHook();
        };
      }

      return () => {
        setControlPanelOnLeft(true);
        onMonthControlClickFromHook();
      };
    }, [onMonthControlClickFromHook]);

    const onYearControlClickFactory = useCallback((calendar: 0 | 1) => {
      if (calendar) {
        return () => {
          setControlPanelOnLeft(false);
          onYearControlClickFromHook();
        };
      }

      return () => {
        setControlPanelOnLeft(true);
        onYearControlClickFromHook();
      };
    }, [onYearControlClickFromHook]);

    const isSettingFirstCalendar = currentMode !== mode && controlPanelOnLeft;
    const isSettingSecondCalendar = currentMode !== mode && !controlPanelOnLeft;

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
          options={popperOptions}
        >
          <div className={classes.calendarGroup}>
            <Calendar
              {...restCalendarProps}
              className={cx(
                classes.calendar,
                {
                  [classes.calendarInactive]: isSettingSecondCalendar,
                },
                className,
              )}
              displayMonthLocale={displayMonthLocale}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              isWeekInRange={isWeekInRange}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              mode={controlPanelOnLeft ? currentMode : mode}
              onChange={onChangeFactory(0)}
              onDateHover={currentMode === mode ? onDateHover : undefined}
              onMonthHover={currentMode === mode ? onMonthHover : undefined}
              onWeekHover={currentMode === mode ? onWeekHover : undefined}
              onYearHover={currentMode === mode ? onYearHover : undefined}
              onMonthControlClick={onMonthControlClickFactory(0)}
              onNext={isSettingFirstCalendar ? onFirstNext : undefined}
              onPrev={onFirstPrev}
              onYearControlClick={onYearControlClickFactory(0)}
              ref={firstCalendarRef}
              referenceDate={referenceDates[0]}
              value={isSettingFirstCalendar ? referenceDates[0] : value}
            />
            <Calendar
              {...restCalendarProps}
              className={cx(
                classes.calendar,
                {
                  [classes.calendarInactive]: isSettingFirstCalendar,
                },
                className,
              )}
              displayMonthLocale={displayMonthLocale}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              isWeekInRange={isWeekInRange}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              mode={!controlPanelOnLeft ? currentMode : mode}
              onChange={onChangeFactory(1)}
              onDateHover={currentMode === mode ? onDateHover : undefined}
              onMonthHover={currentMode === mode ? onMonthHover : undefined}
              onWeekHover={currentMode === mode ? onWeekHover : undefined}
              onYearHover={currentMode === mode ? onYearHover : undefined}
              onMonthControlClick={onMonthControlClickFactory(1)}
              onNext={onSecondNext}
              onPrev={isSettingSecondCalendar ? onSecondPrev : undefined}
              onYearControlClick={onYearControlClickFactory(1)}
              ref={secondCalendarRef}
              referenceDate={referenceDates[1]}
              value={isSettingSecondCalendar ? referenceDates[1] : value}
            />
          </div>
        </Popper>
      </Fade>
    );
  },
);

export default DateRangePickerCalendar;
