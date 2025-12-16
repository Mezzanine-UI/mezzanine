'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import { CalendarTimeIcon } from '@mezzanine-ui/icons';
import {
  FocusEventHandler,
  forwardRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCalendarContext } from '../Calendar';
import { DatePickerCalendar, DatePickerCalendarProps } from '../DatePicker';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import {
  PickerTriggerWithSeparator,
  PickerTriggerWithSeparatorProps,
  usePickerDocumentEventClose,
} from '../Picker';
import { TimePickerPanelProps } from '../TimePicker';
import TimePickerPanel from '../TimePicker/TimePickerPanel';

type FocusedInput = 'left' | 'right' | null;

export interface DateTimePickerProps
  extends Omit<
      DatePickerCalendarProps,
      'anchor' | 'onChange' | 'open' | 'referenceDate' | 'value'
    >,
    Omit<
      TimePickerPanelProps,
      'anchor' | 'onChange' | 'open' | 'popperProps' | 'value'
    >,
    Omit<
      PickerTriggerWithSeparatorProps,
      | 'formatLeft'
      | 'formatRight'
      | 'inputLeftRef'
      | 'inputRightRef'
      | 'onBlurLeft'
      | 'onBlurRight'
      | 'onChangeLeft'
      | 'onChangeRight'
      | 'onFocusLeft'
      | 'onFocusRight'
      | 'onLeftComplete'
      | 'onRightComplete'
      | 'suffix'
      | 'valueLeft'
      | 'valueRight'
    > {
  /**
   * Default value for date-time picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying date (left input).
   */
  formatDate?: string;
  /**
   * The format for displaying time (right input).
   */
  formatTime?: string;
  /**
   * Change handler. Takes your declared `DateType` as argument.
   * Called when both date and time values are complete.
   */
  onChange?: (target?: DateType) => void;
  /**
   * A function that fires when panel toggled. Receive open status and focused input as props.
   */
  onPanelToggle?: (open: boolean, focusedInput: FocusedInput) => void;
  /**
   * Other props you may provide to the time picker panel's `Popper` component
   */
  popperPropsTime?: TimePickerPanelProps['popperProps'];
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateType;
  /**
   * Current value of date-time picker.
   */
  value?: DateType;
}

/**
 * The react component for `mezzanine` date-time picker.
 * This component features two separate inputs for date and time,
 * with independent calendar and time panels shown based on focus.
 * Notice that any component related to date-time picker should be used along with `CalendarContext`.
 */
const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  function DateTimePicker(props, ref) {
    const {
      defaultDateFormat,
      defaultTimeFormat,
      formatToString,
      getNow,
      getHour,
      getMinute,
      getSecond,
      isValid,
      setHour,
      setMinute,
      setSecond,
      startOf,
      locale,
    } = useCalendarContext();

    const {
      // Calendar props
      calendarProps,
      calendarRef,
      disabledMonthSwitch = false,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disableOnNext,
      disableOnPrev,
      disabledYearSwitch = false,
      displayMonthLocale,
      isDateDisabled,
      isHalfYearDisabled,
      isMonthDisabled,
      isQuarterDisabled,
      isWeekDisabled,
      isYearDisabled,
      mode = 'day',
      // Time panel props
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      minuteStep,
      secondStep,
      // DateTimePicker specific props
      className,
      clearable = true,
      defaultValue,
      disabled = false,
      error = false,
      fadeProps,
      formatDate = defaultDateFormat,
      formatTime = hideSecond ? 'HH:mm' : defaultTimeFormat,
      fullWidth = false,
      onClear: onClearProp,
      onChange: onChangeProp,
      onPanelToggle: onPanelToggleProp,
      placeholderLeft = formatDate,
      placeholderRight = formatTime,
      popperProps,
      popperPropsTime,
      prefix,
      readOnly,
      referenceDate: referenceDateProp,
      required = false,
      size,
      value: valueProp,
      ...restTriggerProps
    } = props;

    // Internal state
    const [focusedInput, setFocusedInput] = useState<FocusedInput>(null);
    const [dateValue, setDateValue] = useState<DateType | undefined>(
      defaultValue ?? valueProp,
    );
    const [timeValue, setTimeValue] = useState<DateType | undefined>(
      defaultValue ?? valueProp,
    );

    // Refs
    const inputLeftRef = useRef<HTMLInputElement>(null);
    const inputRightRef = useRef<HTMLInputElement>(null);
    const anchorRef = useRef<HTMLDivElement>(null);
    const calendarPanelRef = useRef<HTMLDivElement>(null);
    const timePanelRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([anchorRef, ref]);

    // Reference date for calendar
    const [referenceDate, setReferenceDate] = useState<DateType>(
      startOf(referenceDateProp || defaultValue || getNow(), 'day'),
    );

    // Sync external value
    useEffect(() => {
      if (valueProp !== undefined) {
        setDateValue(valueProp);
        setTimeValue(valueProp);

        if (valueProp) {
          setReferenceDate(startOf(valueProp, 'day'));
        }
      }
    }, [valueProp, startOf]);

    // Open state based on focused input
    const openCalendar = focusedInput === 'left' && !readOnly;
    const openTimePanel = focusedInput === 'right' && !readOnly;

    // Format values for display
    const displayDateValue = useMemo(() => {
      if (!dateValue) return '';

      return formatToString(locale, dateValue, formatDate) || '';
    }, [dateValue, formatDate, formatToString, locale]);

    const displayTimeValue = useMemo(() => {
      if (!timeValue) return '';

      return formatToString(locale, timeValue, formatTime) || '';
    }, [timeValue, formatTime, formatToString, locale]);

    // Panel toggle handler
    const onPanelToggle = useCallback(
      (open: boolean, input: FocusedInput) => {
        if (onPanelToggleProp) {
          onPanelToggleProp(open, input);
        }
      },
      [onPanelToggleProp],
    );

    // Focus handlers
    const onFocusLeft: FocusEventHandler<HTMLInputElement> = useCallback(() => {
      if (!readOnly) {
        setFocusedInput('left');
        onPanelToggle(true, 'left');
      }
    }, [onPanelToggle, readOnly]);

    const onFocusRight: FocusEventHandler<HTMLInputElement> =
      useCallback(() => {
        if (!readOnly) {
          setFocusedInput('right');
          onPanelToggle(true, 'right');
        }
      }, [onPanelToggle, readOnly]);

    // Combine date and time into a single value
    const combineDateTime = useCallback(
      (
        date: DateType | undefined,
        time: DateType | undefined,
      ): DateType | undefined => {
        if (!date) return undefined;

        const timeSource = time || getNow();

        const result = setHour(
          setMinute(
            setSecond(date, getSecond(timeSource)),
            getMinute(timeSource),
          ),
          getHour(timeSource),
        );

        return result;
      },
      [getNow, getHour, getMinute, getSecond, setHour, setMinute, setSecond],
    );

    // Close handler
    const onClose = useCallback(() => {
      setFocusedInput(null);
      onPanelToggle(false, null);
    }, [onPanelToggle]);

    // Trigger onChange when both date and time are set
    const notifyChange = useCallback(
      (date: DateType | undefined, time: DateType | undefined) => {
        if (!onChangeProp) return;

        if (date && time) {
          const combined = combineDateTime(date, time);

          onChangeProp(combined);
        }
      },
      [combineDateTime, onChangeProp],
    );

    // Handle left complete - auto focus right
    const onLeftComplete = useCallback(() => {
      if (timeValue) {
        onClose();
      } else {
        setTimeout(() => {
          inputRightRef.current?.focus();
        }, 0);
      }
    }, [timeValue, onClose]);

    // Handle left complete - auto focus right
    const onRightComplete = useCallback(() => {
      if (dateValue) {
        onClose();
      } else {
        setTimeout(() => {
          inputLeftRef.current?.focus();
        }, 0);
      }
    }, [dateValue, onClose]);

    // Handle date change from input
    const onChangeLeft = useCallback(
      (isoValue: string) => {
        if (!isoValue) {
          setDateValue(undefined);

          return;
        }

        if (isValid(isoValue)) {
          setDateValue(isoValue);
          setReferenceDate(startOf(isoValue, 'day'));
          notifyChange(isoValue, timeValue);
        }
      },
      [isValid, notifyChange, startOf, timeValue],
    );

    const onChangeRight = useCallback(
      (isoValue: string) => {
        if (!isoValue) {
          setTimeValue(undefined);

          return;
        }

        if (isValid(isoValue)) {
          setTimeValue(isoValue);
          notifyChange(dateValue, isoValue);
        }
      },
      [dateValue, isValid, notifyChange],
    );

    const onCalendarChange = useCallback(
      (target: DateType) => {
        setDateValue(target);
        setReferenceDate(startOf(target, 'day'));
        notifyChange(target, timeValue);
        onLeftComplete();
      },
      [notifyChange, startOf, timeValue, onLeftComplete],
    );

    // Handle time change from panel
    const onTimePanelChange = useCallback(
      (target?: DateType) => {
        if (!target) return;

        setTimeValue(target);
        notifyChange(dateValue, target);
        onRightComplete();
      },
      [dateValue, notifyChange, onRightComplete],
    );

    // Document event close for calendar
    usePickerDocumentEventClose({
      anchorRef,
      lastElementRefInFlow: inputLeftRef,
      onChangeClose: onClose,
      onClose,
      open: openCalendar,
      popperRef: calendarPanelRef,
    });

    // Document event close for time panel
    usePickerDocumentEventClose({
      anchorRef,
      lastElementRefInFlow: inputRightRef,
      onChangeClose: onClose,
      onClose,
      open: openTimePanel,
      popperRef: timePanelRef,
    });

    const onClear: MouseEventHandler = useCallback(
      (evt) => {
        setDateValue(undefined);
        setTimeValue(undefined);
        onChangeProp?.(undefined);
        onClearProp?.(evt);
      },
      [onChangeProp, onClearProp],
    );

    const onCalendarIconClick = useCallback(() => {
      if (readOnly || disabled) return;

      if (focusedInput) {
        setFocusedInput(null);
        onPanelToggle(false, null);
      } else {
        inputLeftRef.current?.focus();
      }
    }, [disabled, focusedInput, onPanelToggle, readOnly]);

    const suffix = (
      <Icon
        aria-label="Open calendar"
        icon={CalendarTimeIcon}
        onClick={onCalendarIconClick}
      />
    );

    return (
      <>
        <PickerTriggerWithSeparator
          {...restTriggerProps}
          ref={triggerComposedRef}
          className={className}
          clearable={clearable}
          disabled={disabled}
          error={error}
          formatLeft={formatDate}
          formatRight={formatTime}
          fullWidth={fullWidth}
          inputLeftRef={inputLeftRef}
          inputRightRef={inputRightRef}
          onBlurLeft={() => {}}
          onBlurRight={() => {}}
          onChangeLeft={onChangeLeft}
          onChangeRight={onChangeRight}
          onClear={onClear}
          onFocusLeft={onFocusLeft}
          onFocusRight={onFocusRight}
          onLeftComplete={onLeftComplete}
          onRightComplete={onRightComplete}
          placeholderLeft={placeholderLeft}
          placeholderRight={placeholderRight}
          prefix={prefix}
          readOnly={readOnly}
          required={required}
          size={size}
          suffix={suffix}
          valueLeft={displayDateValue}
          valueRight={displayTimeValue}
        />
        <DatePickerCalendar
          ref={calendarPanelRef}
          anchor={anchorRef}
          calendarProps={calendarProps}
          calendarRef={calendarRef}
          disabledMonthSwitch={disabledMonthSwitch}
          disableOnDoubleNext={disableOnDoubleNext}
          disableOnDoublePrev={disableOnDoublePrev}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          fadeProps={fadeProps}
          isDateDisabled={isDateDisabled}
          isHalfYearDisabled={isHalfYearDisabled}
          isMonthDisabled={isMonthDisabled}
          isQuarterDisabled={isQuarterDisabled}
          isWeekDisabled={isWeekDisabled}
          isYearDisabled={isYearDisabled}
          mode={mode}
          onChange={onCalendarChange}
          open={openCalendar}
          popperProps={popperProps}
          referenceDate={referenceDate}
          value={dateValue}
        />
        <TimePickerPanel
          ref={timePanelRef}
          anchor={anchorRef}
          fadeProps={fadeProps}
          hideHour={hideHour}
          hideMinute={hideMinute}
          hideSecond={hideSecond}
          hourStep={hourStep}
          minuteStep={minuteStep}
          onChange={onTimePanelChange}
          open={openTimePanel}
          popperProps={popperPropsTime}
          secondStep={secondStep}
          value={timeValue}
        />
      </>
    );
  },
);

export default DateTimePicker;
