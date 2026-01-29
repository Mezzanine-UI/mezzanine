'use client';

import {
  FocusEvent,
  forwardRef,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { timeRangePickerClasses } from '@mezzanine-ui/core/time-range-picker';
import { ClockIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../Calendar';
import {
  RangePickerTrigger,
  RangePickerTriggerProps,
  usePickerDocumentEventClose,
} from '../Picker';
import Icon from '../Icon';
import { useComposeRefs } from '../hooks/useComposeRefs';
import {
  TimeRangePickerValue,
  useTimeRangePickerValue,
} from './useTimeRangePickerValue';
import TimePickerPanel, {
  TimePickerPanelProps,
} from '../TimePicker/TimePickerPanel';
import { cx } from '../utils/cx';

export interface TimeRangePickerProps
  extends Pick<
      TimePickerPanelProps,
      | 'fadeProps'
      | 'hideHour'
      | 'hideMinute'
      | 'hideSecond'
      | 'hourStep'
      | 'minuteStep'
      | 'popperProps'
      | 'secondStep'
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
   * Default value for time range picker.
   */
  defaultValue?: TimeRangePickerValue;
  /**
   * The format for displaying time.
   * @default 'HH:mm:ss' or 'HH:mm' based on hideSecond
   */
  format?: string;
  /**
   * A function that fires when panel toggle. Receive open status in boolean format as props.
   */
  onPanelToggle?: (open: boolean) => void;
  /**
   * Change handler. Takes an array of your declared `DateType` which represents from and to in order.
   */
  onChange?: (target?: TimeRangePickerValue) => void;
  /**
   * Value of the range picker.
   * It is an array of your declared `DateType` which represents from and to in order.
   */
  value?: TimeRangePickerValue;
}

/**
 * The react component for `mezzanine` time range picker.
 * Notice that any component related to time-range-picker should be used along with `CalendarContext`.
 */
const TimeRangePicker = forwardRef<HTMLDivElement, TimeRangePickerProps>(
  function TimeRangePicker(props, ref) {
    const { defaultTimeFormat } = useCalendarContext();
    const {
      className,
      clearable = true,
      defaultValue,
      disabled = false,
      error = false,
      errorMessagesFrom,
      errorMessagesTo,
      fadeProps,
      format: formatProp,
      fullWidth = false,
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      inputFromPlaceholder,
      inputFromProps,
      inputToPlaceholder,
      inputToProps,
      minuteStep,
      onChange: onChangeProp,
      onPanelToggle: onPanelToggleProp,
      popperProps,
      prefix,
      readOnly,
      required = false,
      secondStep,
      size,
      validateFrom,
      validateTo,
      value: valueProp,
    } = props;

    // Determine default format based on hideSecond
    const resolvedFormat =
      formatProp ?? (hideSecond ? 'HH:mm' : defaultTimeFormat);

    /** Panel open control */
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly;

    const onPanelToggle = useCallback(
      (nextOpen: boolean) => {
        if (!preventOpen) {
          setOpen(nextOpen);
          onPanelToggleProp?.(nextOpen);
        }
      },
      [onPanelToggleProp, preventOpen],
    );

    /** Values and onChange */
    const inputToRef = useRef<HTMLInputElement>(null);
    const inputFromRef = useRef<HTMLInputElement>(null);

    const {
      focusedInput,
      inputFromValue,
      inputToValue,
      onChange,
      onClear,
      onFromBlur,
      onFromFocus,
      onInputFromChange,
      onInputToChange,
      onPanelChange,
      onToBlur,
      onToFocus,
      panelValue,
      value: internalValue,
    } = useTimeRangePickerValue({
      format: resolvedFormat,
      onChange: onChangeProp,
      value: valueProp ?? defaultValue,
    });

    /** Popper settings */
    const anchorRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([anchorRef, ref]);

    /** Dynamic anchor for panel - follows the focused input */
    const panelAnchor = useMemo(() => {
      if (focusedInput === 'from') {
        return inputFromRef;
      }

      if (focusedInput === 'to') {
        return inputToRef;
      }

      return inputFromRef;
    }, [focusedInput]);

    /** Input focus handlers */
    const onFromFocusHandler = useCallback(
      (_event: FocusEvent<HTMLInputElement>) => {
        onFromFocus();
        onPanelToggle(true);
      },
      [onPanelToggle, onFromFocus],
    );

    const onToFocusHandler = useCallback(
      (_event: FocusEvent<HTMLInputElement>) => {
        onToFocus();
        onPanelToggle(true);
      },
      [onPanelToggle, onToFocus],
    );

    /** Icon click handler */
    const onIconClick: MouseEventHandler<HTMLElement> = useCallback(
      (e) => {
        e.stopPropagation();

        if (open) {
          onChange(valueProp);
        }

        onPanelToggle(!open);
      },
      [open, onChange, onPanelToggle, valueProp],
    );

    /** Clear handler */
    const onClearHandler = useCallback<
      MouseEventHandler<HTMLInputElement>
    >(() => {
      onClear();
    }, [onClear]);

    /** Close handlers */
    const onClose = useCallback(() => {
      onChange(valueProp);
      onPanelToggle(false);
    }, [onChange, onPanelToggle, valueProp]);

    const onChangeClose = useCallback(() => {
      onChangeProp?.(internalValue);
      onPanelToggle(false);
    }, [internalValue, onChangeProp, onPanelToggle]);

    usePickerDocumentEventClose({
      anchorRef,
      lastElementRefInFlow: inputToRef,
      onChangeClose,
      onClose,
      open,
      popperRef: panelRef,
    });

    /** Suffix icon */
    const suffixIcon = (
      <Icon
        aria-label="Open time picker"
        icon={ClockIcon}
        onClick={readOnly ? undefined : onIconClick}
      />
    );

    return (
      <>
        <RangePickerTrigger
          className={cx(timeRangePickerClasses.host, className)}
          clearable={clearable}
          disabled={disabled}
          error={error}
          errorMessagesFrom={errorMessagesFrom}
          errorMessagesTo={errorMessagesTo}
          format={resolvedFormat}
          fullWidth={fullWidth}
          inputFromPlaceholder={inputFromPlaceholder}
          inputFromProps={inputFromProps}
          inputFromRef={inputFromRef}
          inputFromValue={inputFromValue}
          inputToPlaceholder={inputToPlaceholder}
          inputToProps={inputToProps}
          inputToRef={inputToRef}
          inputToValue={inputToValue}
          onClear={onClearHandler}
          onFromBlur={onFromBlur}
          onFromFocus={onFromFocusHandler}
          onIconClick={onIconClick}
          onInputFromChange={onInputFromChange}
          onInputToChange={onInputToChange}
          onToBlur={onToBlur}
          onToFocus={onToFocusHandler}
          prefix={prefix}
          readOnly={readOnly}
          ref={triggerComposedRef}
          required={required}
          size={size}
          suffixActionIcon={suffixIcon}
          validateFrom={validateFrom}
          validateTo={validateTo}
        />
        {focusedInput && (
          <TimePickerPanel
            anchor={panelAnchor}
            fadeProps={fadeProps}
            hideHour={hideHour}
            hideMinute={hideMinute}
            hideSecond={hideSecond}
            hourStep={hourStep}
            minuteStep={minuteStep}
            onChange={onPanelChange}
            open={open}
            popperProps={popperProps}
            ref={panelRef}
            secondStep={secondStep}
            value={panelValue}
          />
        )}
      </>
    );
  },
);

export default TimeRangePicker;
