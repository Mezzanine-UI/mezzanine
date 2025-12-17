'use client';

import {
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DateType } from '@mezzanine-ui/core/calendar';
import { ClockIcon } from '@mezzanine-ui/icons';
import { useCalendarContext } from '../Calendar';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import {
  PickerTrigger,
  PickerTriggerProps,
  usePickerDocumentEventClose,
  usePickerValue,
} from '../Picker';
import TimePickerPanel, { TimePickerPanelProps } from './TimePickerPanel';

/**
 * Validate if a time value matches the step constraint.
 */
function isValidStep(value: number, step: number): boolean {
  if (step <= 1) return true;
  return value % step === 0;
}

export interface TimePickerProps
  extends Omit<TimePickerPanelProps, 'anchor' | 'onChange' | 'open' | 'value'>,
    Omit<
      PickerTriggerProps,
      'format' | 'inputRef' | 'onChange' | 'onClear' | 'suffix' | 'value'
    > {
  /**
   * Default value for time picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying time.
   * @default 'HH:mm:ss' or 'HH:mm' based on hideSecond
   */
  format?: string;
  /**
   * Change handler. Takes your declared `DateType` as argument.
   */
  onChange?: (target?: DateType) => void;
  /**
   * A function that fires when panel toggled. Receive open status in boolean format as props.
   */
  onPanelToggle?: (open: boolean) => void;
  /**
   * Current value of time picker.
   */
  value?: DateType;
}

/**
 * The react component for `mezzanine` time picker.
 * Notice that any component related to time-picker should be used along with `CalendarContext`.
 */
const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  function TimePicker(props, ref) {
    const { defaultTimeFormat } = useCalendarContext();
    const {
      className,
      clearable = true,
      defaultValue,
      disabled = false,
      error = false,
      fadeProps,
      fullWidth = false,
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      inputProps,
      minuteStep,
      onChange: onChangeProp,
      onPanelToggle: onPanelToggleProp,
      placeholder,
      popperProps,
      prefix,
      readOnly,
      required = false,
      secondStep,
      size,
      value: valueProp,
      ...restTriggerProps
    } = props;

    // Determine default format based on hideSecond
    const resolvedFormat =
      props.format ?? (hideSecond ? 'HH:mm' : defaultTimeFormat);

    const { getHour, getMinute, getSecond } = useCalendarContext();

    /**
     * Validate time value against step constraints.
     * Returns true if valid, false if the time doesn't match the step.
     */
    const validateTimeStep = useCallback(
      (isoDate: string): boolean => {
        const hour = getHour(isoDate);
        const minute = getMinute(isoDate);
        const second = getSecond(isoDate);

        if (!hideHour && hourStep && !isValidStep(hour, hourStep)) {
          return false;
        }
        if (!hideMinute && minuteStep && !isValidStep(minute, minuteStep)) {
          return false;
        }
        if (!hideSecond && secondStep && !isValidStep(second, secondStep)) {
          return false;
        }

        return true;
      },
      [
        getHour,
        getMinute,
        getSecond,
        hideHour,
        hideMinute,
        hideSecond,
        hourStep,
        minuteStep,
        secondStep,
      ],
    );

    const {
      onBlur: onBlurProp,
      onKeyDown: onKeyDownProp,
      onFocus: onFocusProp,
      ...restInputProp
    } = inputProps || {};

    /** Panel open control */
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly;
    const onPanelToggle = useCallback(
      (nextOpen: boolean) => {
        if (!preventOpen) {
          setOpen(nextOpen);

          if (onPanelToggleProp) {
            onPanelToggleProp(nextOpen);
          }
        }
      },
      [onPanelToggleProp, preventOpen],
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

        onPanelToggle(true);
      };
    }, [onPanelToggle, onFocusProp, readOnly]);

    /** Controlling input value and bind change handler */
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
      format: resolvedFormat,
      inputRef,
      value: valueProp,
    });

    /** Bind close control to handlers */
    const onPanelChange = (val?: DateType) => {
      if (val) {
        onChange(val);
        onChangeProp?.(val);
      }
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
          onPanelToggle(false);
        }
      },
      [internalValue, onPanelToggle, onChangeProp, onKeyDown, onKeyDownProp],
    );

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
      onFocus,
      onKeyDown: onKeyDownWithCloseControl,
      onBlur: onResolvedBlur,
    };

    /** Popper positioning */
    const anchorRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([ref, anchorRef]);
    const panelRef = useRef<HTMLDivElement>(null);

    /** Clear handler */
    const onClear = useCallback<MouseEventHandler<HTMLInputElement>>(() => {
      onChange(undefined);
      onChangeProp?.(undefined);
    }, [onChange, onChangeProp]);

    /** Blur, click away and key down close */
    const onClose = () => {
      onChange(valueProp);

      onPanelToggle(false);
    };

    const onChangeClose = () => {
      onChangeProp?.(internalValue);

      onPanelToggle(false);
    };

    usePickerDocumentEventClose({
      open,
      anchorRef,
      popperRef: panelRef,
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

      onPanelToggle(!open);
    };

    const suffixIcon = (
      <Icon
        aria-label="Open time picker"
        icon={ClockIcon}
        onClick={readOnly ? undefined : onIconClick}
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
          format={resolvedFormat}
          fullWidth={fullWidth}
          inputProps={resolvedInputProps}
          inputRef={inputRef}
          onChange={(e) => {
            onInputChange(e);
            onPanelChange(e.target.value);
            onPanelToggle(true);
          }}
          onClear={onClear}
          onFocus={() => onPanelToggle(true)}
          placeholder={placeholder}
          prefix={prefix}
          readOnly={readOnly}
          required={required}
          size={size}
          suffix={suffixIcon}
          validate={validateTimeStep}
          value={inputValue}
        />
        <TimePickerPanel
          ref={panelRef}
          anchor={anchorRef}
          fadeProps={fadeProps}
          hideHour={hideHour}
          hideMinute={hideMinute}
          hideSecond={hideSecond}
          hourStep={hourStep}
          minuteStep={minuteStep}
          onChange={onPanelChange}
          open={open}
          popperProps={popperProps}
          secondStep={secondStep}
          value={internalValue}
        />
      </>
    );
  },
);

export default TimePicker;
