import {
  useState,
  useRef,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  MouseEventHandler,
  KeyboardEventHandler,
  FocusEventHandler,
  forwardRef,
} from 'react';
import {
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../Calendar';
import DatePickerCalendar, {
  DatePickerCalendarProps,
} from './DatePickerCalendar';
import { FormControlContext } from '../Form';
import {
  PickerTrigger,
  PickerTriggerProps,
  usePickerDocumentEventClose,
  usePickerValue,
} from '../Picker';
import Icon from '../Icon';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface DatePickerProps
  extends
  Omit<DatePickerCalendarProps,
  | 'anchor'
  | 'calendarRef'
  | 'onChange'
  | 'open'
  | 'referenceDate'
  | 'updateReferenceDate'
  >,
  Omit<PickerTriggerProps,
  | 'defaultValue'
  | 'inputRef'
  | 'onChange'
  | 'onClear'
  | 'onClick'
  | 'onIconClick'
  | 'onKeyDown'
  | 'suffixActionIcon'
  | 'value'
  > {
  /**
   * Default value for date picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying date.
   */
  format?: string;
  /**
   * A function that fires when calendar toggle. Receive open status in boolean format as props.
   */
  onCalendarToggle?: (open: boolean) => void;
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
const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const {
      defaultDateFormat,
      getNow,
    } = useCalendarContext();
    const {
      calendarProps,
      className,
      clearable = true,
      defaultValue,
      disabledMonthSwitch = false,
      disableOnNext,
      disableOnPrev,
      disabledYearSwitch = false,
      disabled = disabledFromFormControl || false,
      displayMonthLocale,
      error = severity === 'error' || false,
      fadeProps,
      format = defaultDateFormat,
      fullWidth = fullWidthFromFormControl || false,
      inputProps,
      isDateDisabled,
      isMonthDisabled,
      isWeekDisabled,
      isYearDisabled,
      mode = 'day',
      onCalendarToggle: onCalendarToggleProp,
      onChange: onChangeProp,
      placeholder,
      popperProps,
      prefix,
      readOnly,
      referenceDate: referenceDateProp,
      required = requiredFromFormControl || false,
      size,
      value: valueProp,
      ...restTriggerProps
    } = props;
    const {
      onBlur: onBlurProp,
      onKeyDown: onKeyDownProp,
      onFocus: onFocusProp,
      size: inputSize = format.length + 2,
      ...restInputProp
    } = inputProps || {};

    const formats = useMemo(() => [
      format,
      defaultDateFormat,
      getDefaultModeFormat(mode),
    ], [defaultDateFormat, format, mode]);

    /** Calender display control */
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly;
    const onCalendarToggle = useCallback((currentOpen: boolean) => {
      if (!preventOpen) {
        if (onCalendarToggleProp) {
          onCalendarToggleProp(currentOpen);
        }

        setOpen(currentOpen);
      }
    }, [onCalendarToggleProp, preventOpen]);

    const onFocus = useMemo<FocusEventHandler<HTMLInputElement> | undefined>(() => {
      if (readOnly) {
        return undefined;
      }

      return (event) => {
        if (onFocusProp) {
          onFocusProp(event);
        }

        onCalendarToggle(true);
      };
    }, [onCalendarToggle, onFocusProp, readOnly]);

    /** Value and change handlers */
    const inputRef = useRef<HTMLInputElement>(null);
    const {
      inputValue,
      onBlur,
      onChange,
      onInputChange,
      onKeyDown,
      value: internalValue,
    } = usePickerValue({
      defaultValue,
      format,
      formats,
      inputRef,
      value: valueProp,
    });

    /** Bind close control to handlers */
    const onCalendarChange = (val: DateType) => {
      onChange(val);
      onChangeProp?.(val);
      onCalendarToggle(false);
    };

    const onKeyDownWithCloseControl = useCallback<KeyboardEventHandler<HTMLInputElement>>((event) => {
      onKeyDown(event);

      if (onKeyDownProp) {
        onKeyDownProp(event);
      }

      if (event.key === 'Enter') {
        onChangeProp?.(internalValue);
        onCalendarToggle(false);
      }
    }, [internalValue, onCalendarToggle, onChangeProp, onKeyDown, onKeyDownProp]);

    /** using internal reference date */
    const [referenceDate, setReferenceDate] = useState(referenceDateProp || defaultValue || getNow());

    useEffect(() => {
      if (internalValue) {
        setReferenceDate(internalValue);
      }
    }, [internalValue]);

    /** Resolve input props */
    const onResolvedBlur = useCallback<FocusEventHandler<HTMLInputElement>>((event) => {
      if (onBlurProp) {
        onBlurProp(event);
      }

      onBlur(event);
    }, [onBlur, onBlurProp]);

    const resolvedInputProps = {
      ...restInputProp,
      size: inputSize,
      onFocus,
      onKeyDown: onKeyDownWithCloseControl,
      onBlur: onResolvedBlur,
    };

    /** Popper positioning */
    const anchorRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([ref, anchorRef]);
    const calendarRef = useRef<HTMLDivElement>(null);

    /** Clear handler */
    const onClear = useCallback<MouseEventHandler<HTMLInputElement>>(() => {
      onChange(undefined);
      onChangeProp?.(undefined);
    }, [onChange, onChangeProp]);

    /** Blur, click away and key down close */
    const onClose = () => {
      onChange(valueProp);

      onCalendarToggle(false);
    };

    const onChangeClose = () => {
      onChangeProp?.(internalValue);

      onCalendarToggle(false);
    };

    usePickerDocumentEventClose({
      open,
      anchorRef,
      popperRef: calendarRef,
      lastElementRefInFlow: inputRef,
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
        <PickerTrigger
          {...restTriggerProps}
          ref={triggerComposedRef}
          className={className}
          clearable={clearable}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          inputProps={resolvedInputProps}
          inputRef={inputRef}
          onChange={onInputChange}
          onClear={onClear}
          placeholder={placeholder}
          prefix={prefix}
          readOnly={readOnly}
          required={required}
          size={size}
          suffixActionIcon={suffixActionIcon}
          value={inputValue}
        />
        <DatePickerCalendar
          ref={calendarRef}
          anchor={anchorRef}
          calendarProps={calendarProps}
          disabledMonthSwitch={disabledMonthSwitch}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          fadeProps={fadeProps}
          isDateDisabled={isDateDisabled}
          isMonthDisabled={isMonthDisabled}
          isWeekDisabled={isWeekDisabled}
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
  },
);

export default DatePicker;
