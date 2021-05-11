import {
  useState,
  useRef,
  useCallback,
  FocusEvent,
  useContext,
  useMemo,
  useEffect,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  forwardRef,
} from 'react';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../Calendar';
import DateRangePickerCalendar, { DateRangePickerCalendarProps } from './DateRangePickerCalendar';
import { FormControlContext } from '../Form';
import { useDateRangePickerValue } from './useDateRangePickerValue';
import { RangePickerTrigger, RangePickerTriggerProps, usePickerDocumentEventClose } from '../Picker';
import Icon from '../Icon';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface DateRangePickerProps
  extends
  Pick<DateRangePickerCalendarProps,
  | 'calendarProps'
  | 'displayMonthLocale'
  | 'fadeProps'
  | 'mode'
  | 'popperProps'
  | 'isDateDisabled'
  | 'isMonthDisabled'
  | 'isYearDisabled'
  >,
  Pick<RangePickerTriggerProps,
  | 'className'
  | 'clearable'
  | 'disabled'
  | 'error'
  | 'fullWidth'
  | 'inputFromPlaceholder'
  | 'inputFromProps'
  | 'inputToPlaceholder'
  | 'inputToProps'
  | 'prefix'
  | 'readOnly'
  | 'required'
  | 'size'
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
 * Notice that any component related to date-range-picker should be used along with `CalendarContext`. <br />
 */
const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  function DateRangePicker(props, ref) {
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const {
      defaultDateFormat,
      getNow,
      isBetween,
    } = useCalendarContext();
    const {
      calendarProps,
      className,
      clearable,
      defaultValue,
      disabled = disabledFromFormControl || false,
      displayMonthLocale,
      error = severity === 'error' || false,
      fadeProps,
      format = defaultDateFormat,
      fullWidth = fullWidthFromFormControl || false,
      inputFromPlaceholder,
      inputFromProps,
      inputToPlaceholder,
      inputToProps,
      isDateDisabled,
      isMonthDisabled,
      isYearDisabled,
      mode = 'day',
      onCalendarToggle: onCalendarToggleProp,
      onChange: onChangeProp,
      popperProps,
      prefix,
      readOnly,
      referenceDate: referenceDateProp,
      required = requiredFromFormControl || false,
      size,
      value: valueProp,
    } = props;
    const {
      onBlur: onFromBlurProp,
      onKeyDown: onFromKeyDownProp,
      onFocus: onFromFocusProp,
      ...restInputFromProps
    } = inputFromProps || {};
    const {
      onBlur: onToBlurProp,
      onKeyDown: onToKeyDownProp,
      onFocus: onToFocusProp,
      ...restInputToProps
    } = inputToProps || {};
    const formats = useMemo(() => [
      format,
      defaultDateFormat,
      getDefaultModeFormat(mode),
    ], [defaultDateFormat, format, mode]);

    function isBetweenRange(
      valueToCheck: DateType,
      t1: DateType,
      t2: DateType,
      granularity: string,
    ) {
      return isBetween(valueToCheck, t1, t2, granularity) || isBetween(valueToCheck, t2, t1, granularity);
    }

    /** Using internal reference date */
    const [referenceDate, updateReferenceDate] = useState(referenceDateProp || defaultValue?.[0] || getNow());

    /** Calendar panel toggle */
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly;
    const onCalendarToggle = useCallback((currentOpen: boolean) => {
      if (!preventOpen) {
        setOpen(currentOpen);

        if (onCalendarToggleProp) {
          onCalendarToggleProp(currentOpen);
        }
      }
    }, [onCalendarToggleProp, preventOpen]);

    const onFromFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
      if (onFromFocusProp) {
        onFromFocusProp(event);
      }

      onCalendarToggle(true);
    }, [onCalendarToggle, onFromFocusProp]);

    const onToFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
      if (onToFocusProp) {
        onToFocusProp(event);
      }

      onCalendarToggle(true);
    }, [onCalendarToggle, onToFocusProp]);

    /** Values and onChange */
    const inputToRef = useRef<HTMLInputElement>(null);
    const inputFromRef = useRef<HTMLInputElement>(null);

    const {
      calendarValue,
      inputFromValue,
      inputToValue,
      onCalendarChange,
      onCalendarHover,
      onChange,
      onClear,
      onFromBlur,
      onFromKeyDown,
      onInputFromChange,
      onInputToChange,
      onToBlur,
      onToKeyDown,
      value: internalValue,
    } = useDateRangePickerValue({
      format,
      formats,
      value: valueProp,
      inputFromRef,
      inputToRef,
      onChange: onChangeProp,
    });

    useEffect(() => {
      const [from, to] = internalValue;

      if (from) {
        updateReferenceDate(from);
      } else if (to) {
        updateReferenceDate(to);
      }
    }, [internalValue]);

    /** Bind calendar open control to handlers */
    const onCalendarChangeWithCloseControl = useCallback((val: DateType) => {
      onCalendarChange(val);

      const [from, to] = internalValue;
      const hasFirstValue = (from && !to) || (to && !from);

      if (hasFirstValue && val) {
        onCalendarToggle(false);
      }
    }, [internalValue, onCalendarChange, onCalendarToggle]);

    const onFromKeyDownWithCloseControl = useCallback<KeyboardEventHandler<HTMLInputElement>>((event) => {
      onFromKeyDown(event);

      const [from, to] = internalValue;

      if (event.key === 'Enter' && from && to) {
        onCalendarToggle(false);
      }
    }, [internalValue, onCalendarToggle, onFromKeyDown]);

    const onToKeyDownWithCloseControl = useCallback<KeyboardEventHandler<HTMLInputElement>>((event) => {
      onToKeyDown(event);

      const [from, to] = internalValue;

      if (event.key === 'Enter' && from && to) {
        onCalendarToggle(false);
      }
    }, [internalValue, onCalendarToggle, onToKeyDown]);

    /** Calendar cell in range checker */
    const getIsInRangeHandler = (granularity: string) => {
      const [anchor1, anchor2] = calendarValue || [];

      return (
        anchor1 && anchor2
          ? (date: DateType) => isBetweenRange(date, anchor1, anchor2, granularity)
          : undefined
      );
    };

    /** Popper settings */
    const anchorRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([anchorRef, ref]);

    /** Resolve input props */
    const onResolvedFromBlur = useCallback<FocusEventHandler<HTMLInputElement>>((event) => {
      if (onFromBlurProp) {
        onFromBlurProp(event);
      }

      onFromBlur(event);
    }, [onFromBlur, onFromBlurProp]);

    const onResolvedToBlur = useCallback<FocusEventHandler<HTMLInputElement>>((event) => {
      if (onToBlurProp) {
        onToBlurProp(event);
      }

      onToBlur(event);
    }, [onToBlur, onToBlurProp]);

    const onResolvedFromKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>((event) => {
      if (onFromKeyDownProp) {
        onFromKeyDownProp(event);
      }

      onFromKeyDownWithCloseControl(event);
    }, [onFromKeyDownProp, onFromKeyDownWithCloseControl]);

    const onResolvedToKeyDown = useCallback<KeyboardEventHandler<HTMLInputElement>>((event) => {
      if (onToKeyDownProp) {
        onToKeyDownProp(event);
      }

      onToKeyDownWithCloseControl(event);
    }, [onToKeyDownProp, onToKeyDownWithCloseControl]);

    const resolvedInputFromProps = {
      ...restInputFromProps,
      onFocus: onFromFocus,
      onKeyDown: onResolvedFromKeyDown,
      onBlur: onResolvedFromBlur,
      size: format.length + 2,
    };

    const resolvedInputToProps = {
      ...restInputToProps,
      onFocus: onToFocus,
      onKeyDown: onResolvedToKeyDown,
      onBlur: onResolvedToBlur,
      size: format.length + 2,
    };

    /** Blur, click away and key down close */
    const onClose = () => {
      onChange(valueProp);

      onCalendarToggle(false);
    };

    const onChangeClose = () => {
      const [from, to] = internalValue;

      if (from && to) {
        const newValue = onChange([from, to]) as [DateType, DateType];

        onChangeProp?.(newValue);
      } else {
        onChange(valueProp);
      }

      onCalendarToggle(false);
    };

    usePickerDocumentEventClose({
      open,
      anchorRef,
      popperRef: calendarRef,
      lastElementRefInFlow: inputToRef,
      onClose,
      onChangeClose,
    });

    /** Icon */
    const onIconClick: MouseEventHandler<HTMLElement> = (e) => {
      e.stopPropagation();

      if (open) {
        onChange(valueProp);
      }

      onCalendarToggle(!open);
    };

    const suffixActionIcon = (
      <Icon
        icon={CalendarIcon}
        onClick={onIconClick}
      />
    );

    return (
      <>
        <RangePickerTrigger
          ref={triggerComposedRef}
          className={className}
          clearable={clearable}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          inputFromPlaceholder={inputFromPlaceholder}
          inputFromProps={resolvedInputFromProps}
          inputFromRef={inputFromRef}
          inputFromValue={inputFromValue}
          inputToPlaceholder={inputToPlaceholder}
          inputToProps={resolvedInputToProps}
          inputToRef={inputToRef}
          inputToValue={inputToValue}
          onClear={onClear}
          onInputFromChange={onInputFromChange}
          onInputToChange={onInputToChange}
          prefix={prefix}
          readOnly={readOnly}
          required={required}
          size={size}
          suffixActionIcon={suffixActionIcon}
        />
        <DateRangePickerCalendar
          ref={calendarRef}
          open={open}
          anchor={anchorRef}
          calendarProps={calendarProps}
          displayMonthLocale={displayMonthLocale}
          fadeProps={fadeProps}
          isDateDisabled={isDateDisabled}
          isDateInRange={getIsInRangeHandler('date')}
          isMonthDisabled={isMonthDisabled}
          isMonthInRange={getIsInRangeHandler('month')}
          isWeekInRange={getIsInRangeHandler('week')}
          isYearDisabled={isYearDisabled}
          isYearInRange={getIsInRangeHandler('year')}
          mode={mode}
          onChange={onCalendarChangeWithCloseControl}
          onDateHover={onCalendarHover}
          onWeekHover={onCalendarHover}
          onMonthHover={onCalendarHover}
          onYearHover={onCalendarHover}
          popperProps={popperProps}
          referenceDate={referenceDate}
          value={calendarValue}
        />
      </>
    );
  },
);

export default DateRangePicker;
