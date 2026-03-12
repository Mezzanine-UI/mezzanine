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
import { DateType } from '@mezzanine-ui/core/calendar';
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
    const {
      defaultTimeFormat,
      getNow,
      getHour,
      getMinute,
      getSecond,
      setHour,
      setMinute,
      setSecond,
    } = useCalendarContext();
    const {
      className,
      clearable = true,
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

    // Compute rounded current time respecting step and hide settings
    const computeCurrentTime = useCallback((): DateType => {
      const now = getNow();
      const h = getHour(now);
      const m = getMinute(now);
      const s = getSecond(now);

      let result = now;

      if (!hideHour) {
        result = setHour(
          result,
          Math.min(Math.round(h / (hourStep ?? 1)) * (hourStep ?? 1), 23),
        );
      }

      if (!hideMinute) {
        result = setMinute(
          result,
          Math.min(Math.round(m / (minuteStep ?? 1)) * (minuteStep ?? 1), 59),
        );
      }

      if (!hideSecond) {
        result = setSecond(
          result,
          Math.min(Math.round(s / (secondStep ?? 1)) * (secondStep ?? 1), 59),
        );
      }

      return result;
    }, [
      getNow,
      getHour,
      getMinute,
      getSecond,
      setHour,
      setMinute,
      setSecond,
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      minuteStep,
      secondStep,
    ]);

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
      onFromFocus,
      onInputFromChange,
      onInputToChange,
      onPanelChange,
      onPanelCancel,
      onPanelConfirm,
      onToFocus,
      panelValue,
      value: internalValue,
    } = useTimeRangePickerValue({
      format: resolvedFormat,
      onChange: onChangeProp,
      value: valueProp,
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

    /** Input focus handlers — initialize panel to current value or current time */
    const onFromFocusHandler = useCallback(
      (_event: FocusEvent<HTMLInputElement>) => {
        onFromFocus();

        const currentFrom = valueProp?.[0] ?? internalValue[0];

        if (!currentFrom) {
          onPanelChange(computeCurrentTime());
        }

        onPanelToggle(true);
      },
      [
        computeCurrentTime,
        internalValue,
        onFromFocus,
        onPanelChange,
        onPanelToggle,
        valueProp,
      ],
    );

    const onToFocusHandler = useCallback(
      (_event: FocusEvent<HTMLInputElement>) => {
        onToFocus();

        const currentTo = valueProp?.[1] ?? internalValue[1];

        if (!currentTo) {
          onPanelChange(computeCurrentTime());
        }

        onPanelToggle(true);
      },
      [
        computeCurrentTime,
        internalValue,
        onPanelChange,
        onPanelToggle,
        onToFocus,
        valueProp,
      ],
    );

    /** Ok: commit pending value + close */
    const onConfirm = useCallback(() => {
      onPanelConfirm();
      onPanelToggle(false);
    }, [onPanelConfirm, onPanelToggle]);

    /** Cancel / click away: revert pending value + close */
    const onCancel = useCallback(() => {
      onPanelCancel();
      onChange(valueProp);
      onPanelToggle(false);
    }, [onChange, onPanelCancel, onPanelToggle, valueProp]);

    /** Clear handler */
    const onClearHandler = useCallback<
      MouseEventHandler<HTMLInputElement>
    >(() => {
      onClear();
    }, [onClear]);

    /** Icon click handler */
    const onIconClick: MouseEventHandler<HTMLElement> = useCallback(
      (e) => {
        e.stopPropagation();

        if (open) {
          onCancel();
        } else {
          onPanelToggle(true);
        }
      },
      [open, onCancel, onPanelToggle],
    );

    usePickerDocumentEventClose({
      anchorRef,
      lastElementRefInFlow: inputToRef,
      onChangeClose: onCancel,
      onClose: onCancel,
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
          className={className}
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
          onFromFocus={onFromFocusHandler}
          onIconClick={onIconClick}
          onInputFromChange={onInputFromChange}
          onInputToChange={onInputToChange}
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
            onCancel={onCancel}
            onConfirm={onConfirm}
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
