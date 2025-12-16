'use client';

import {
  forwardRef,
  FocusEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../Calendar';
import DateRangePickerCalendar, {
  DateRangePickerCalendarProps,
} from './DateRangePickerCalendar';
import { useDateRangePickerValue } from './useDateRangePickerValue';
import {
  RangePickerTrigger,
  RangePickerTriggerProps,
  usePickerDocumentEventClose,
} from '../Picker';
import Icon from '../Icon';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface DateRangePickerProps
  extends Pick<
      DateRangePickerCalendarProps,
      | 'actions'
      | 'calendarProps'
      | 'disabledMonthSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'displayWeekDayLocale'
      | 'fadeProps'
      | 'firstCalendarRef'
      | 'isDateDisabled'
      | 'isWeekDisabled'
      | 'isMonthDisabled'
      | 'isYearDisabled'
      | 'isQuarterDisabled'
      | 'isHalfYearDisabled'
      | 'mode'
      | 'popperProps'
      | 'quickSelect'
      | 'renderAnnotations'
      | 'secondCalendarRef'
    >,
    Pick<
      RangePickerTriggerProps,
      | 'className'
      | 'clearable'
      | 'disabled'
      | 'error'
      | 'errorMessagesFrom'
      | 'errorMessagesTo'
      | 'fullWidth'
      | 'inputFromPlaceholder'
      | 'inputFromProps'
      | 'inputToPlaceholder'
      | 'inputToProps'
      | 'prefix'
      | 'readOnly'
      | 'required'
      | 'size'
      | 'validateFrom'
      | 'validateTo'
    > {
  /**
   * Default value for date range picker.
   */
  defaultValue?: [DateType, DateType];
  /**
   * The format for displaying date.
   */
  format?: string;
  /**
   * A function that fires when calendar toggle. Receive open status in boolean format as props.
   */
  onCalendarToggle?: (open: boolean) => void;
  /**
   * Change handler. Takes an array of your declared `DateType` which represents from and to in order.
   */
  onChange?: (target?: RangePickerValue) => void;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateRangePickerCalendarProps['referenceDate'];
  /**
   * Value of the range picker.
   * It is an array of your declared `DateType` which represents from and to in order.
   */
  value?: RangePickerValue;
}

/**
 * The react component for `mezzanine` date range picker.
 * Notice that any component related to date-range-picker should be used along with `CalendarContext`.
 */
const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(props, ref) {
    const { addDay, getNow, isBefore, isBetween } = useCalendarContext();
    const {
      actions,
      calendarProps,
      className,
      clearable = true,
      defaultValue,
      disabledMonthSwitch = false,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disableOnNext,
      disableOnPrev,
      disabled = false,
      disabledYearSwitch = false,
      displayMonthLocale,
      displayWeekDayLocale,
      error = false,
      errorMessagesFrom,
      errorMessagesTo,
      fadeProps,
      firstCalendarRef,
      format: formatProp,
      fullWidth = false,
      inputFromPlaceholder,
      inputFromProps,
      inputToPlaceholder,
      inputToProps,
      isDateDisabled,
      isHalfYearDisabled,
      isMonthDisabled,
      isQuarterDisabled,
      isWeekDisabled,
      isYearDisabled,
      mode = 'day',
      onCalendarToggle: onCalendarToggleProp,
      onChange: onChangeProp,
      popperProps,
      prefix,
      quickSelect,
      readOnly,
      referenceDate: referenceDateProp,
      renderAnnotations,
      required = false,
      secondCalendarRef,
      size,
      validateFrom,
      validateTo,
      value: valueProp,
    } = props;

    const format = formatProp || getDefaultModeFormat(mode);

    function isBetweenRange(
      valueToCheck: DateType,
      t1: DateType,
      t2: DateType,
      granularity: string,
    ) {
      return (
        isBetween(valueToCheck, t1, t2, granularity) ||
        isBetween(valueToCheck, t2, t1, granularity)
      );
    }

    /** Check if there are disabled dates in the range */
    const hasDisabledDateInRange = useCallback(
      (start: DateType, end: DateType): boolean => {
        const [rangeStart, rangeEnd] = isBefore(start, end)
          ? [start, end]
          : [end, start];

        let current = rangeStart;
        while (isBefore(current, rangeEnd) || current === rangeEnd) {
          let isDisabled = false;

          switch (mode) {
            case 'day':
              isDisabled = isDateDisabled?.(current) ?? false;
              break;
            case 'week':
              isDisabled = isWeekDisabled?.(current) ?? false;
              break;
            case 'month':
              isDisabled = isMonthDisabled?.(current) ?? false;
              break;
            case 'year':
              isDisabled = isYearDisabled?.(current) ?? false;
              break;
            case 'quarter':
              isDisabled = isQuarterDisabled?.(current) ?? false;
              break;
            case 'half-year':
              isDisabled = isHalfYearDisabled?.(current) ?? false;
              break;
            default:
              break;
          }

          if (isDisabled) {
            return true;
          }

          current = addDay(current, 1);
          if (isBefore(rangeEnd, current)) {
            break;
          }
        }
        return false;
      },
      [
        addDay,
        isBefore,
        mode,
        isDateDisabled,
        isWeekDisabled,
        isMonthDisabled,
        isYearDisabled,
        isQuarterDisabled,
        isHalfYearDisabled,
      ],
    );

    /** Using internal reference date */
    const [referenceDate, updateReferenceDate] = useState(
      referenceDateProp || defaultValue?.[0] || getNow(),
    );

    /** Calendar panel toggle */
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly;
    const onCalendarToggle = useCallback(
      (currentOpen: boolean) => {
        if (!preventOpen) {
          setOpen(currentOpen);
          onCalendarToggleProp?.(currentOpen);
        }
      },
      [onCalendarToggleProp, preventOpen],
    );

    /** Values and onChange */
    const inputToRef = useRef<HTMLInputElement>(null);
    const inputFromRef = useRef<HTMLInputElement>(null);

    const {
      calendarValue,
      checkIsInRange,
      inputFromValue,
      inputToValue,
      onCalendarChange,
      onCalendarHover,
      onChange,
      onClear,
      onFromBlur,
      onFromFocus,
      onInputFromChange,
      onInputToChange,
      onToBlur,
      onToFocus,
      value: internalValue,
    } = useDateRangePickerValue({
      format,
      hasDisabledDateInRange,
      inputFromRef,
      inputToRef,
      mode,
      onChange: onChangeProp,
      value: valueProp,
    });

    // Update reference date when internal value changes
    useEffect(() => {
      const [from, to] = internalValue;

      if (from) {
        updateReferenceDate(from);
      } else if (to) {
        updateReferenceDate(to);
      }
    }, [internalValue]);

    /** Bind calendar open control to handlers */
    const onCalendarChangeWithCloseControl = useCallback(
      (val: [DateType, DateType | undefined]) => {
        onCalendarChange(val);

        // Close panel when range is complete
        if (val[0] && val[1]) {
          onCalendarToggle(false);
        }
      },
      [onCalendarChange, onCalendarToggle],
    );

    /** Calendar cell in range checker */
    const getIsInRangeHandler = (granularity: string) => {
      const [anchor1, anchor2] = calendarValue || [];

      // If no range or disabled dates exist in range, return undefined
      if (!anchor1 || !anchor2 || !checkIsInRange(anchor2)) {
        return undefined;
      }

      return (date: DateType) =>
        isBetweenRange(date, anchor1, anchor2, granularity);
    };

    /** Popper settings */
    const anchorRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([anchorRef, ref]);

    /** Input focus handlers */
    const onFromFocusHandler = useCallback(
      (_event: FocusEvent<HTMLInputElement>) => {
        onFromFocus();
        onCalendarToggle(true);
      },
      [onCalendarToggle, onFromFocus],
    );

    const onToFocusHandler = useCallback(
      (_event: FocusEvent<HTMLInputElement>) => {
        onToFocus();
        onCalendarToggle(true);
      },
      [onCalendarToggle, onToFocus],
    );

    /** Blur, click away and key down close */
    const onClose = useCallback(() => {
      onChange(valueProp);
      onCalendarToggle(false);
    }, [onChange, onCalendarToggle, valueProp]);

    const onChangeClose = useCallback(() => {
      const [from, to] = internalValue;

      if (from && to) {
        onChangeProp?.([from, to]);
      } else {
        onChange(valueProp);
      }

      onCalendarToggle(false);
    }, [internalValue, onChange, onCalendarToggle, onChangeProp, valueProp]);

    usePickerDocumentEventClose({
      anchorRef,
      lastElementRefInFlow: inputToRef,
      onChangeClose,
      onClose,
      open,
      popperRef: calendarRef,
    });

    /** Icon click handler */
    const onIconClick: MouseEventHandler<HTMLElement> = useCallback(
      (e) => {
        e.stopPropagation();

        if (open) {
          onChange(valueProp);
        }

        onCalendarToggle(!open);
      },
      [onChange, onCalendarToggle, open, valueProp],
    );

    const suffixActionIcon = <Icon icon={CalendarIcon} onClick={onIconClick} />;

    return (
      <>
        <RangePickerTrigger
          className={className}
          clearable={clearable}
          disabled={disabled}
          error={error}
          errorMessagesFrom={errorMessagesFrom}
          errorMessagesTo={errorMessagesTo}
          format={format}
          fullWidth={fullWidth}
          inputFromPlaceholder={inputFromPlaceholder}
          inputFromProps={inputFromProps}
          inputFromRef={inputFromRef}
          inputFromValue={inputFromValue}
          inputToPlaceholder={inputToPlaceholder}
          inputToProps={inputToProps}
          inputToRef={inputToRef}
          inputToValue={inputToValue}
          onClear={onClear}
          onFromBlur={onFromBlur}
          onFromFocus={onFromFocusHandler}
          onInputFromChange={onInputFromChange}
          onInputToChange={onInputToChange}
          onToBlur={onToBlur}
          onToFocus={onToFocusHandler}
          prefix={prefix}
          readOnly={readOnly}
          ref={triggerComposedRef}
          required={required}
          size={size}
          suffixActionIcon={suffixActionIcon}
          validateFrom={validateFrom}
          validateTo={validateTo}
        />
        <DateRangePickerCalendar
          actions={actions}
          anchor={anchorRef}
          calendarProps={calendarProps}
          disabledMonthSwitch={disabledMonthSwitch}
          disabledYearSwitch={disabledYearSwitch}
          disableOnDoubleNext={disableOnDoubleNext}
          disableOnDoublePrev={disableOnDoublePrev}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          displayMonthLocale={displayMonthLocale}
          displayWeekDayLocale={displayWeekDayLocale}
          fadeProps={fadeProps}
          firstCalendarRef={firstCalendarRef}
          isDateDisabled={isDateDisabled}
          isDateInRange={getIsInRangeHandler('date')}
          isHalfYearDisabled={isHalfYearDisabled}
          isHalfYearInRange={getIsInRangeHandler('half-year')}
          isMonthDisabled={isMonthDisabled}
          isMonthInRange={getIsInRangeHandler('month')}
          isQuarterDisabled={isQuarterDisabled}
          isQuarterInRange={getIsInRangeHandler('quarter')}
          isWeekDisabled={isWeekDisabled}
          isWeekInRange={getIsInRangeHandler('week')}
          isYearDisabled={isYearDisabled}
          isYearInRange={getIsInRangeHandler('year')}
          mode={mode}
          onChange={onCalendarChangeWithCloseControl}
          onDateHover={onCalendarHover}
          onHalfYearHover={onCalendarHover}
          onMonthHover={onCalendarHover}
          onQuarterHover={onCalendarHover}
          onWeekHover={onCalendarHover}
          onYearHover={onCalendarHover}
          open={open}
          popperProps={popperProps}
          quickSelect={quickSelect}
          ref={calendarRef}
          referenceDate={referenceDate}
          renderAnnotations={renderAnnotations}
          secondCalendarRef={secondCalendarRef}
          value={calendarValue}
        />
      </>
    );
  },
);

export default DateRangePicker;
