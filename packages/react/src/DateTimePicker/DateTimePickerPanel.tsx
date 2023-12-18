import { dateTimePickerClasses as classes } from '@mezzanine-ui/core/date-time-picker';
import { forwardRef } from 'react';
import { DateType } from '@mezzanine-ui/core/calendar';
import TimePanel, { TimePanelAction, TimePanelProps } from '../TimePanel';
import Calendar, { CalendarProps, useCalendarContext, useCalendarControls } from '../Calendar';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import InputTriggerPopper, { InputTriggerPopperProps } from '../_internal/InputTriggerPopper';

export interface DateTimePickerPanelProps
  extends
  Omit<TimePanelProps,
  | Exclude<keyof NativeElementPropsWithoutKeyAndRef<'div'>, | 'className' | 'style' | 'id'>
  | 'withoutAction'
  | 'onChange'
  | 'value'
  | 'withoutAction'
  >,
  Pick<InputTriggerPopperProps,
  | 'anchor'
  | 'fadeProps'
  | 'open'
  >,
  Pick<CalendarProps,
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
  calendarProps?: Omit<CalendarProps,
  | 'disabledMonthSwitch'
  | 'disableOnNext'
  | 'disableOnPrev'
  | 'disabledYearSwitch'
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
   * Change Handler. Receive `DateType` as props.
   */
  onChange?: (value?: DateType) => void;
  /**
   * Other props you may provide to `Popper` component
   */
  popperProps?: Omit<InputTriggerPopperProps,
  | 'anchor'
  | 'children'
  | 'fadeProps'
  | 'open'
  >
  /**
   * Display value of the panel.
   */
  value?: DateType;
}

/**
 * The react component for `mezzanine` time picker panel.
 */
const DateTimePickerPanel = forwardRef<HTMLDivElement, DateTimePickerPanelProps>(
  function TimePickerPanel(props, ref) {
    const {
      displayMonthLocale: displayMonthLocaleFromConfig,
      getMonth,
      getYear,
      setMonth,
      setYear,
      setHour,
      setMinute,
      setSecond,
      getHour,
      getMinute,
      getSecond,
    } = useCalendarContext();
    const {
      anchor,
      calendarProps,
      className,
      confirmText,
      disabledMonthSwitch,
      disableOnNext,
      disableOnPrev,
      disabledYearSwitch,
      displayMonthLocale = displayMonthLocaleFromConfig,
      fadeProps,
      hideHour,
      hideMinute,
      hideSecond,
      hourPrefix,
      hourStep,
      isDateDisabled,
      isMonthDisabled,
      isWeekDisabled,
      isYearDisabled,
      minutePrefix,
      minuteStep,
      onChange: onChangeProp,
      onConfirm,
      open,
      popperProps,
      referenceDate: referenceDateProp,
      secondPrefix,
      secondStep,
      value,
      ...restHostProps
    } = props;
    const mode = 'day';
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

    const onCalendarChange = (target: DateType) => {
      if (currentMode === 'day' || currentMode === 'week') {
        updateReferenceDate(target);

        popModeStack();

        if (currentMode === mode && onChangeProp) {
          onChangeProp(target);
        }
      }

      if (currentMode === 'month') {
        const result = setMonth(referenceDate, getMonth(target));

        updateReferenceDate(result);

        popModeStack();
      }

      if (currentMode === 'year') {
        const result = setYear(referenceDate, getYear(target));

        updateReferenceDate(result);

        popModeStack();
      }
    };

    const onTimePanelChange = (target: DateType) => {
      const result = setHour(
        setMinute(
          setSecond(
            referenceDate,
            getSecond(target),
          ),
          getMinute(target),
        ),
        getHour(target),
      );

      updateReferenceDate(result);

      if (currentMode === mode && onChangeProp) {
        onChangeProp(result);
      }
    };

    return (
      <InputTriggerPopper
        {...popperProps}
        ref={ref}
        anchor={anchor}
        open={open}
        fadeProps={fadeProps}
      >
        <div
          {...restHostProps}
          className={cx(
            classes.panel,
            className,
          )}
        >
          <div className={classes.panelSelectors}>
            <Calendar
              {...calendarProps}
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
              onChange={onCalendarChange}
              onMonthControlClick={onMonthControlClick}
              onNext={onNext}
              onPrev={onPrev}
              onYearControlClick={onYearControlClick}
              referenceDate={referenceDate}
              value={value}
              className={classes.panelCalendar}
            />
            <TimePanel
              hideHour={hideHour}
              hourStep={hourStep}
              hideMinute={hideMinute}
              minuteStep={minuteStep}
              hideSecond={hideSecond}
              secondStep={secondStep}
              hourPrefix={hourPrefix}
              minutePrefix={minutePrefix}
              secondPrefix={secondPrefix}
              onChange={onTimePanelChange}
              value={value}
              withoutAction
            />
          </div>
          <TimePanelAction
            onConfirm={onConfirm}
            confirmText={confirmText}
          />
        </div>
      </InputTriggerPopper>
    );
  },
);

export default DateTimePickerPanel;
