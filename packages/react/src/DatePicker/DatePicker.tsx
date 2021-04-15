import {
  useState,
  useRef,
  useCallback,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import { useSyncTriggerInputValue } from './useSyncTriggerInputValue';
import { useCalendarContext } from '../Calendar/CalendarContext';
import { useClickAway } from '../hooks/useClickAway';
import DatePickerTrigger, { DatePickerTriggerProps } from './DatePickerTrigger';
import DatePickerCalendar, { DatePickerCalendarProps } from './DatePickerCalendar';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { FormControlContext } from '../Form';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import { useTriggerInputHandlers } from './useTriggerInputHandlers';
import { useTabKeyClose } from './useTabKeyClose';

export interface DatePickerProps
  extends
  Omit<DatePickerCalendarProps,
  | 'anchor'
  | 'onChange'
  | 'updateReferenceDate'
  | 'calendarRef'
  | 'referenceDate'
  | 'open'>,
  Omit<DatePickerTriggerProps,
  | 'value'
  | 'onChange'
  | 'onClear'
  | 'defaultValue'> {
  /**
   * Default value for date picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying date.
   */
  format?: string;
  /**
   * Change handler. Takes your declared `DateType` as argument.
   */
  onChange?: (target?: DateType) => void;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateType;
}

/**
 * The react component for `mezzanine` date picker.
 * Notice that any component related to date-picker should be used along with `CalendarContext`. <br />
 */
function DatePicker(props: DatePickerProps) {
  const {
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    format: formatFromCalendarConfig,
    formatToString,
    getNow,
    parse,
    valueLocale,
  } = useCalendarContext();
  const {
    calendarProps,
    className,
    clearable,
    defaultValue,
    disableOnNext,
    disableOnPrev,
    disabled = disabledFromFormControl || false,
    displayMonthLocale,
    error = severity === 'error' || false,
    fadeProps,
    format = formatFromCalendarConfig,
    fullWidth = fullWidthFromFormControl || false,
    inputProps,
    isDateDisabled,
    isMonthDisabled,
    isYearDisabled,
    mode = 'day',
    onChange,
    placeholder,
    popperProps,
    prefix,
    readOnly,
    referenceDate: referenceDateProp,
    required = requiredFromFormControl || false,
    size,
    value,
    ...restTriggerProps
  } = props;
  const {
    onBlur: onBlurProp,
    onKeyDown: onKeyDownProp,
    onFocus: onFocusProp,
    ...restInputProp
  } = inputProps || {};

  const formats = useMemo(() => [
    format,
    formatFromCalendarConfig,
    getDefaultModeFormat(mode),
  ], [format, formatFromCalendarConfig, mode]);

  /** Syncing value */
  const inputDefaultValue = defaultValue ? formatToString(valueLocale, defaultValue, format) : '';
  const htmlInputRef = useRef<HTMLInputElement>(null);

  const {
    inputValue,
    onChange: resolvedChangeHandler,
    onInputChange,
    onInputClear,
  } = useSyncTriggerInputValue({
    format,
    inputDefaultValue,
    inputRef: htmlInputRef,
    onChange,
    value,
  });

  const internalValue = useMemo(() => (
    parse(valueLocale, inputValue, formats) || undefined
  ), [formats, inputValue, parse, valueLocale]);

  /** using internal reference date */
  const [referenceDate, setReferenceDate] = useState(referenceDateProp || defaultValue || getNow());

  useEffect(() => {
    if (internalValue) {
      setReferenceDate(internalValue);
    }
  }, [internalValue]);

  /** Calender display control */
  const [open, setOpen] = useState(false);

  /** Popper positioning */
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const anchorComposedRef = useComposeRefs([setAnchor, anchorRef]);
  const calendarRef = useRef<HTMLDivElement>(null);

  /** Calendar change handler */
  const onCalendarChange = (val: DateType) => {
    resolvedChangeHandler(val);

    setOpen(false);
  };

  /** Trigger input handlers */
  const {
    onBlur,
    onFocus,
    onKeyDown,
  } = useTriggerInputHandlers({
    formats,
    inputRef: htmlInputRef,
    onBlur: onBlurProp,
    onChange,
    onFocus: onFocusProp,
    onInputChange,
    onKeyDown: onKeyDownProp,
    readOnly,
    setOpen,
  });

  /** Trigger click handler for closing calendar */
  const onTriggerClick = () => {
    if (!open && !readOnly) {
      setOpen(false);
    }
  };

  /** Bind input clear control */
  const onClear = useCallback((e) => {
    onInputClear(e);

    if (onChange) {
      onChange(undefined);
    }
  }, [onInputClear, onChange]);

  /** Close calendar when clicked outside */
  useClickAway(
    () => {
      if (!open) {
        return () => {};
      }

      return (event) => {
        if (!calendarRef.current?.contains(event.target as HTMLElement)) {
          setOpen(false);
        }
      };
    },
    anchorRef,
    [open],
  );

  /** Close calendar when escape key down */
  useDocumentEscapeKeyDown(() => () => {
    if (open) {
      setOpen(false);

      htmlInputRef.current?.blur();
    }
  }, [open]);

  /** Close calendar when tab key down */
  useTabKeyClose(
    () => { setOpen(false); },
    htmlInputRef,
    [],
  );

  return (
    <>
      <DatePickerTrigger
        {...restTriggerProps}
        ref={anchorComposedRef}
        className={className}
        clearable={clearable}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        inputRef={htmlInputRef}
        onChange={onInputChange}
        onClear={onClear}
        onClick={onTriggerClick}
        onIconClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        placeholder={placeholder}
        prefix={prefix}
        readOnly={readOnly}
        required={required}
        size={size}
        value={inputValue}
        inputProps={{
          ...restInputProp,
          size: format.length + 2,
          onFocus,
          onKeyDown,
          onBlur,
        }}
      />
      <DatePickerCalendar
        anchor={anchor}
        calendarProps={calendarProps}
        calendarRef={calendarRef}
        disableOnNext={disableOnNext}
        disableOnPrev={disableOnPrev}
        displayMonthLocale={displayMonthLocale}
        fadeProps={fadeProps}
        isDateDisabled={isDateDisabled}
        isMonthDisabled={isMonthDisabled}
        isYearDisabled={isYearDisabled}
        mode={mode}
        onChange={onCalendarChange}
        open={open}
        popperProps={popperProps}
        referenceDate={referenceDate}
        value={internalValue}
      />
    </>
  );
}

export default DatePicker;
