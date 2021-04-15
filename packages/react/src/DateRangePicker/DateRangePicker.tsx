import {
  useState,
  useRef,
  useCallback,
  FocusEvent,
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import { DateRangePickerPickingValue, DateRangePickerValue } from '@mezzanine-ui/core/date-range-picker';
import { useCalendarContext } from '../Calendar/CalendarContext';
import { useClickAway } from '../hooks/useClickAway';
import DateRangePickerTrigger, { DateRangePickerTriggerProps } from './DateRangePickerTrigger';
import DateRangePickerCalendar, { DateRangePickerCalendarProps } from './DateRangePickerCalendar';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { FormControlContext } from '../Form';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import { useTabKeyClose } from '../DatePicker/useTabKeyClose';

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
  Pick<DateRangePickerTriggerProps,
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
   * Change handler. Takes an array of your declared `DateType` which represents from and to in order.
   */
  onChange?: (target?: DateRangePickerValue) => void;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateRangePickerCalendarProps['referenceDate'];
  /**
   * Value of the range picker.
   * It is an array of your declared `DateType` which represents from and to in order.
   */
  value?: DateRangePickerValue;
}

/**
 * The react component for `mezzanine` date range picker.
 * Notice that any component related to date-range-picker should be used along with `CalendarContext`. <br />
 */
function DateRangePicker(props: DateRangePickerProps) {
  const {
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    addMonth,
    format: formatFromCalendarConfig,
    formatToString,
    getNow,
    isBefore,
    isBetween,
    parse,
    valueLocale,
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
    format = formatFromCalendarConfig,
    fullWidth = fullWidthFromFormControl || false,
    inputFromPlaceholder,
    inputFromProps,
    inputToPlaceholder,
    inputToProps,
    isDateDisabled,
    isMonthDisabled,
    isYearDisabled,
    mode = 'day',
    onChange,
    popperProps,
    prefix,
    readOnly,
    referenceDate: referenceDateProp,
    required = requiredFromFormControl || false,
    size,
    value,
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
    formatFromCalendarConfig,
    getDefaultModeFormat(mode),
  ], [format, formatFromCalendarConfig, mode]);

  const sortValues = useCallback((valueToSort: DateRangePickerPickingValue): DateRangePickerPickingValue => {
    const [v1, v2] = valueToSort;

    if (v1 && v2) {
      return isBefore(v1, v2) ? [v1, v2] : [v2, v1];
    }

    if (!v1 && !v2) {
      return [undefined, undefined];
    }

    return [v1 || v2, undefined] as DateRangePickerPickingValue;
  }, [isBefore]);

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

  const onFromFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    if (onFromFocusProp) {
      onFromFocusProp(event);
    }

    if (!readOnly) {
      setOpen(true);
    }
  }, [onFromFocusProp, readOnly]);

  const onToFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    if (onToFocusProp) {
      onToFocusProp(event);
    }

    if (!readOnly) {
      setOpen(true);
    }
  }, [onToFocusProp, readOnly]);

  /** Values and onChange */
  const [range, setRange] = useState(() => sortValues(value || []));
  const [from, to] = range;
  const [internalFrom, setInternalFrom] = useState(() => (
    value?.[0] ? formatToString(valueLocale, value[0], format) : ''
  ));
  const [internalTo, setInternalTo] = useState(() => (
    value?.[1] ? formatToString(valueLocale, value[1], format) : ''
  ));

  useEffect(() => {
    setRange(value || []);
    setInternalFrom(
      value?.[0] ? formatToString(valueLocale, value[0], format) : '',
    );
    setInternalTo(
      value?.[1] ? formatToString(valueLocale, value[1], format) : '',
    );
  }, [format, formatToString, value, valueLocale]);

  useEffect(() => {
    if (internalFrom) {
      const newRef = parse(valueLocale, internalFrom, formats);

      if (newRef) {
        updateReferenceDate(newRef);
      }
    } else if (internalTo) {
      const newRef = parse(valueLocale, internalTo, formats);

      if (newRef) {
        updateReferenceDate(newRef);
      }
    }
  }, [addMonth, formats, internalFrom, internalTo, parse, valueLocale]);

  const [hoverValue, setHoverValue] = useState<DateType | undefined>(undefined);

  const commitChange = useCallback((val?: DateRangePickerPickingValue) => {
    function clear() {
      setInternalFrom('');
      setInternalTo('');
      setRange([]);
      setHoverValue(undefined);

      if (onChange) {
        onChange(undefined);
      }
    }

    if (!val) {
      clear();
      setOpen(false);

      return;
    }

    const valFrom = val[0] || from || value?.[0];
    const valTo = val[1] || to || value?.[1] || valFrom;
    const sortedVal = sortValues([valFrom, valTo] as DateRangePickerPickingValue);

    if (sortedVal.some((v) => !v)) {
      clear();
    } else {
      setInternalFrom(formatToString(valueLocale, sortedVal[0] as DateType, format));
      setInternalTo(formatToString(valueLocale, sortedVal[1] as DateType, format));
      setRange(sortedVal);
      setHoverValue(undefined);

      if (onChange) {
        onChange(sortedVal as DateRangePickerValue);
      }
    }

    setOpen(false);
  }, [format, formatToString, from, onChange, sortValues, to, value, valueLocale]);

  const onCalendarChange = useCallback((val: DateType) => {
    const firstVal = from || to;

    if (from && to) {
      setInternalFrom(formatToString(valueLocale, val, format));
      setInternalTo('');
      setRange([val]);
    } else if (firstVal) {
      const sortedVal = sortValues([firstVal, val]);

      commitChange(sortedVal as DateRangePickerPickingValue);
      setRange(sortedVal);
    } else {
      setInternalFrom(formatToString(valueLocale, val, format));
      setRange([val]);
    }
  }, [commitChange, format, formatToString, from, sortValues, to, valueLocale]);

  const onFromInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;

    setInternalFrom(val);

    const valDateType = parse(valueLocale, val, formats);
    const toValDateType = parse(valueLocale, internalTo, formats);

    if (valDateType) {
      if (toValDateType) {
        if (isBefore(toValDateType, valDateType)) {
          setInternalTo('');
          setHoverValue(undefined);
          setRange([valDateType]);
        } else {
          setRange([valDateType, toValDateType]);
        }
      } else {
        setRange([valDateType]);
      }
    } else if (toValDateType) {
      setHoverValue(undefined);
      setRange([undefined, toValDateType]);
    } else {
      setHoverValue(undefined);
      setRange([]);
    }
  }, [formats, internalTo, isBefore, parse, valueLocale]);

  const onToInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;

    setInternalTo(val);

    const valDateType = parse(valueLocale, val, formats);
    const fromValDateType = parse(valueLocale, internalFrom, formats);

    if (valDateType) {
      if (fromValDateType) {
        if (isBefore(valDateType, fromValDateType)) {
          setInternalFrom('');
          setHoverValue(undefined);
          setRange([undefined, valDateType]);
        } else {
          setRange([fromValDateType, valDateType]);
        }
      }
    } else if (fromValDateType) {
      setHoverValue(undefined);
      setRange([fromValDateType]);
    } else {
      setHoverValue(undefined);
      setRange([]);
    }
  }, [formats, internalFrom, isBefore, parse, valueLocale]);

  const onFromBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    if (onFromBlurProp) {
      onFromBlurProp(event);
    }

    const val = event.target.value;
    const valDateType = parse(valueLocale, val, formats);

    if (valDateType) {
      setInternalFrom(val);
    } else {
      setInternalFrom('');
    }
  }, [formats, onFromBlurProp, parse, valueLocale]);

  const onToBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    if (onToBlurProp) {
      onToBlurProp(event);
    }

    const val = event.target.value;
    const valDateType = parse(valueLocale, val, formats) || undefined;

    if (valDateType) {
      setInternalTo(val);
    } else {
      setInternalTo('');
    }
  }, [formats, onToBlurProp, parse, valueLocale]);

  const inputToRef = useRef<HTMLInputElement>(null);
  const inputFromRef = useRef<HTMLInputElement>(null);
  const onFromKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (onFromKeyDownProp) {
      onFromKeyDownProp(event);
    }

    if (event.key === 'Enter') {
      inputFromRef.current?.blur();

      const values = [
        parse(valueLocale, internalFrom, formats) || undefined,
        parse(valueLocale, internalTo, formats) || undefined,
      ] as DateRangePickerPickingValue;

      commitChange(values);
    }
  }, [commitChange, formats, internalFrom, internalTo, onFromKeyDownProp, parse, valueLocale]);

  const onToKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (onToKeyDownProp) {
      onToKeyDownProp(event);
    }

    if (event.key === 'Enter') {
      inputToRef.current?.blur();

      const values = [
        parse(valueLocale, internalFrom, formats) || undefined,
        parse(valueLocale, internalTo, formats) || undefined,
      ] as DateRangePickerPickingValue;

      commitChange(values);
    }
  }, [commitChange, formats, internalFrom, internalTo, onToKeyDownProp, parse, valueLocale]);

  /** Hover settings */
  const anchor1 = from || to;
  const anchor2 = from && to ? to : hoverValue;
  const calendarValue = useMemo(() => {
    if (anchor1 && anchor2) {
      return [anchor1, anchor2];
    }

    if (anchor1) {
      return [anchor1];
    }

    return undefined;
  }, [anchor1, anchor2]);
  const getIsInRangeHandler = (granularity: string) => (
    anchor1 && anchor2
      ? (date: DateType) => isBetweenRange(date, anchor1, anchor2, granularity)
      : undefined
  );
  const onHover = anchor1 ? setHoverValue : undefined;

  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const anchorComposedRef = useComposeRefs([setAnchor, anchorRef]);
  const firstCalendarRef = useRef<HTMLDivElement>(null);
  const secondCalendarRef = useRef<HTMLDivElement>(null);

  /** Bind input clear control */
  const [
    inputFromValue,
    inputFromOnChange,
    inputFromOnClear,
  ] = useInputWithClearControlValue({
    defaultValue: defaultValue ? formatToString(valueLocale, defaultValue[0], format) : '',
    onChange: onFromInputChange,
    ref: inputFromRef,
    value: internalFrom,
  });

  const [
    inputToValue,
    inputToOnChange,
    inputToOnClear,
  ] = useInputWithClearControlValue({
    defaultValue: defaultValue ? formatToString(valueLocale, defaultValue[1], format) : '',
    onChange: onToInputChange,
    ref: inputToRef,
    value: internalTo,
  });

  const onClear = useCallback((e) => {
    inputFromOnClear(e);
    inputToOnClear(e);

    commitChange();
  }, [commitChange, inputFromOnClear, inputToOnClear]);

  /** Trigger click handler for closing calendar */
  const onTriggerClick = () => {
    if (!open && !readOnly) {
      setOpen(false);
    }
  };

  /** Close calendar when clicked outside */
  useClickAway(
    () => {
      if (!open) {
        return () => {};
      }

      return (event) => {
        if (
          !firstCalendarRef.current?.contains(event.target as HTMLElement) &&
          !secondCalendarRef.current?.contains(event.target as HTMLElement)
        ) {
          const values = [
            parse(valueLocale, internalFrom, formats) || undefined,
            parse(valueLocale, internalTo, formats) || undefined,
          ] as DateRangePickerPickingValue;

          commitChange(values);
        }
      };
    },
    anchorRef,
    [open, internalFrom, internalTo, valueLocale, formats],
  );

  /** Close calendar when escape key down */
  useDocumentEscapeKeyDown(() => () => {
    if (open) {
      setOpen(false);

      commitChange(value || []);
    }
  }, [open]);

  /** Close calendar when tab key down */
  useTabKeyClose(
    () => { setOpen(false); },
    inputToRef,
    [],
  );

  return (
    <>
      <DateRangePickerTrigger
        ref={anchorComposedRef}
        className={className}
        clearable={clearable}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        inputFromPlaceholder={inputFromPlaceholder}
        inputFromRef={inputFromRef}
        inputFromValue={inputFromValue}
        inputToPlaceholder={inputToPlaceholder}
        inputToRef={inputToRef}
        inputToValue={inputToValue}
        onClear={onClear}
        onClick={onTriggerClick}
        onIconClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onInputFromChange={inputFromOnChange}
        onInputToChange={inputToOnChange}
        prefix={prefix}
        readOnly={readOnly}
        required={required}
        size={size}
        inputFromProps={{
          ...restInputFromProps,
          onFocus: onFromFocus,
          onKeyDown: onFromKeyDown,
          onBlur: onFromBlur,
          size: format.length + 2,
        }}
        inputToProps={{
          ...restInputToProps,
          onFocus: onToFocus,
          onKeyDown: onToKeyDown,
          onBlur: onToBlur,
          size: format.length + 2,
        }}
      />
      <DateRangePickerCalendar
        open={open}
        anchor={anchor}
        calendarProps={calendarProps}
        displayMonthLocale={displayMonthLocale}
        fadeProps={fadeProps}
        firstCalendarRef={firstCalendarRef}
        isDateDisabled={isDateDisabled}
        isDateInRange={getIsInRangeHandler('date')}
        isMonthDisabled={isMonthDisabled}
        isMonthInRange={getIsInRangeHandler('month')}
        isWeekInRange={getIsInRangeHandler('week')}
        isYearDisabled={isYearDisabled}
        isYearInRange={getIsInRangeHandler('year')}
        mode={mode}
        onChange={onCalendarChange}
        onDateHover={onHover}
        onWeekHover={onHover}
        onMonthHover={onHover}
        onYearHover={onHover}
        popperProps={popperProps}
        referenceDate={referenceDate}
        secondCalendarRef={secondCalendarRef}
        value={calendarValue}
      />
    </>
  );
}

export default DateRangePicker;
