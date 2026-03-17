'use client';

import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  MouseEventHandler,
  KeyboardEventHandler,
  FocusEventHandler,
  forwardRef,
} from 'react';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import { pickerClasses } from '@mezzanine-ui/core/picker';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../Calendar';
import { cx } from '../utils/cx';
import DatePickerCalendar, {
  DatePickerCalendarProps,
} from './DatePickerCalendar';
import {
  PickerTrigger,
  PickerTriggerProps,
  usePickerDocumentEventClose,
  usePickerValue,
} from '../Picker';
import Icon from '../Icon';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface DatePickerProps
  extends Omit<
      DatePickerCalendarProps,
      | 'anchor'
      | 'calendarRef'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'onChange'
      | 'open'
      | 'referenceDate'
      | 'updateReferenceDate'
    >,
    Omit<
      PickerTriggerProps,
      | 'defaultValue'
      | 'format'
      | 'inputRef'
      | 'onChange'
      | 'onClear'
      | 'onClick'
      | 'onIconClick'
      | 'onKeyDown'
      | 'value'
    > {
  /**
   * Default value for date picker.
   */
  defaultValue?: DateType;
  /**
   * Disabled "double next" button on calendar controls
   * @default false
   */
  disableOnDoubleNext?: boolean;
  /**
   * Disabled "double prev" button on calendar controls
   * @default false
   */
  disableOnDoublePrev?: boolean;
  /**
   * The format for displaying date.
   * The length of the format must match the length of the actual generated value. For example, "gggg-wo" may cause a length mismatch when the week of year is a single digit. It is recommended to use the system's default format instead.
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
 * 日期選擇器元件，透過點擊輸入框或日曆圖示開啟日曆彈出層進行日期選取。
 *
 * 必須搭配 `CalendarContext`（`CalendarConfigProvider`）使用，以提供語系與格式化函式。
 * 支援 `day`、`week`、`month`、`quarter`、`half-year`、`year` 等多種選取模式，
 * 可透過 `isDateDisabled` 等相關 props 限制可選日期範圍，並支援受控（`value`）
 * 與非受控（`defaultValue`）兩種使用方式。
 *
 * @example
 * ```tsx
 * import DatePicker from '@mezzanine-ui/react/DatePicker';
 * import CalendarConfigProvider from '@mezzanine-ui/react/CalendarConfigProvider';
 *
 * // 基本用法（需包覆在 CalendarConfigProvider 內）
 * <CalendarConfigProvider methods={...}>
 *   <DatePicker onChange={(date) => console.log(date)} />
 * </CalendarConfigProvider>
 *
 * // 受控用法
 * const [date, setDate] = useState<DateType>();
 * <CalendarConfigProvider methods={...}>
 *   <DatePicker value={date} onChange={setDate} />
 * </CalendarConfigProvider>
 *
 * // 月份選取模式，禁用過去月份
 * <CalendarConfigProvider methods={...}>
 *   <DatePicker
 *     mode="month"
 *     isMonthDisabled={(iso) => iso < '2024-01'}
 *     onChange={setDate}
 *   />
 * </CalendarConfigProvider>
 * ```
 *
 * @see {@link DateRangePicker} 日期範圍選擇器元件
 * @see {@link DateTimePicker} 日期時間選擇器元件
 * @see {@link Calendar} 日曆元件
 */
const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const { formatToString, getNow, locale } = useCalendarContext();
    const {
      calendarProps,
      className,
      clearable = true,
      defaultValue,
      disabledMonthSwitch = false,
      disableOnNext,
      disableOnPrev,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disabledYearSwitch = false,
      disabled = false,
      displayMonthLocale,
      error = false,
      errorMessages,
      fadeProps,
      format: formatProp,
      fullWidth = false,
      inputProps,
      isDateDisabled,
      isMonthDisabled,
      isWeekDisabled,
      isYearDisabled,
      isQuarterDisabled,
      isHalfYearDisabled,
      mode = 'day',
      onCalendarToggle: onCalendarToggleProp,
      onChange: onChangeProp,
      placeholder,
      popperProps,
      prefix,
      readOnly,
      referenceDate: referenceDateProp,
      required = false,
      size,
      value: valueProp,
      ...restTriggerProps
    } = props;
    const format = formatProp || getDefaultModeFormat(mode);
    const {
      onBlur: onBlurProp,
      onKeyDown: onKeyDownProp,
      onFocus: onFocusProp,
      size: inputSize = format.length + 2,
      ...restInputProp
    } = inputProps || {};

    /**
     * Validate date value against disabled constraints based on mode.
     * Returns true if valid, false if the date is disabled.
     */
    const validateDate = useCallback(
      (isoDate: string): boolean => {
        switch (mode) {
          case 'day':
            return !isDateDisabled?.(isoDate);
          case 'week':
            return !isWeekDisabled?.(isoDate);
          case 'month':
            return !isMonthDisabled?.(isoDate);
          case 'quarter':
            return !isQuarterDisabled?.(isoDate);
          case 'year':
            return !isYearDisabled?.(isoDate);
          case 'half-year':
            return !isHalfYearDisabled?.(isoDate);
          default:
            return true;
        }
      },
      [
        isDateDisabled,
        isHalfYearDisabled,
        isMonthDisabled,
        isQuarterDisabled,
        isWeekDisabled,
        isYearDisabled,
        mode,
      ],
    );

    /** Calender display control */
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly;
    const onCalendarToggle = useCallback(
      (currentOpen: boolean) => {
        if (!preventOpen) {
          if (onCalendarToggleProp) {
            onCalendarToggleProp(currentOpen);
          }

          setOpen(currentOpen);
        }
      },
      [onCalendarToggleProp, preventOpen],
    );

    const onFocus = useMemo<
      FocusEventHandler<HTMLInputElement> | undefined
    >(() => {
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
      inputRef,
      value: valueProp,
    });

    /** Bind close control to handlers */
    const onCalendarChange = (val: DateType) => {
      onChange(val);
      onChangeProp?.(val);
      onCalendarToggle(false);
    };

    const onKeyDownWithCloseControl = useCallback<
      KeyboardEventHandler<HTMLInputElement>
    >(
      (event) => {
        onKeyDown(event);

        if (onKeyDownProp) {
          onKeyDownProp(event);
        }

        if (event.key === 'Enter') {
          onChangeProp?.(internalValue);
          onCalendarToggle(false);
        }
      },
      [internalValue, onCalendarToggle, onChangeProp, onKeyDown, onKeyDownProp],
    );

    /** Hover preview value for calendar */
    const [hoverDate, setHoverDate] = useState<DateType | undefined>(undefined);

    /** using internal reference date */
    const [referenceDate, setReferenceDate] = useState(
      referenceDateProp || defaultValue || getNow(),
    );

    useEffect(() => {
      if (internalValue) {
        setReferenceDate(internalValue);
      }
    }, [internalValue]);

    /** Resolve input props */
    const onResolvedBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
      (event) => {
        if (onBlurProp) {
          onBlurProp(event);
        }

        onBlur(event);
      },
      [onBlur, onBlurProp],
    );

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
        aria-label="Open calendar"
        icon={CalendarIcon}
        onClick={readOnly ? undefined : onIconClick}
      />
    );

    const hoverDisplayValue =
      open && !inputValue && hoverDate
        ? (formatToString(locale, hoverDate, format) ?? undefined)
        : undefined;

    return (
      <>
        <PickerTrigger
          {...restTriggerProps}
          ref={triggerComposedRef}
          className={cx(pickerClasses.hostDate, className)}
          clearable={clearable}
          disabled={disabled}
          error={error}
          forceShowClearable={!!internalValue}
          hideSuffixWhenClearable={clearable}
          errorMessages={errorMessages}
          format={format}
          fullWidth={fullWidth}
          hoverValue={hoverDisplayValue}
          inputProps={resolvedInputProps}
          inputRef={inputRef}
          onChange={(e) => {
            onInputChange(e);
            onCalendarChange(e.target.value);
            onCalendarToggle(true);
          }}
          onClear={onClear}
          onFocus={() => onCalendarToggle(true)}
          placeholder={placeholder}
          prefix={prefix}
          readOnly={readOnly}
          required={required}
          size={size}
          suffix={suffixActionIcon}
          validate={validateDate}
          value={inputValue}
        />
        <DatePickerCalendar
          ref={calendarRef}
          anchor={anchorRef}
          calendarProps={calendarProps}
          disabledMonthSwitch={disabledMonthSwitch}
          disableOnNext={disableOnNext}
          disableOnPrev={disableOnPrev}
          disableOnDoubleNext={disableOnDoubleNext}
          disableOnDoublePrev={disableOnDoublePrev}
          disabledYearSwitch={disabledYearSwitch}
          displayMonthLocale={displayMonthLocale}
          fadeProps={fadeProps}
          isDateDisabled={isDateDisabled}
          isMonthDisabled={isMonthDisabled}
          isWeekDisabled={isWeekDisabled}
          isQuarterDisabled={isQuarterDisabled}
          isYearDisabled={isYearDisabled}
          isHalfYearDisabled={isHalfYearDisabled}
          mode={mode}
          onChange={onCalendarChange}
          onHover={setHoverDate}
          onLeave={() => setHoverDate(undefined)}
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
