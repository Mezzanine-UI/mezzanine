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
  extends Omit<
      TimePickerPanelProps,
      'anchor' | 'onChange' | 'onCancel' | 'onConfirm' | 'open' | 'value'
    >,
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
    const {
      defaultTimeFormat,
      formatToString,
      getNow,
      getHour,
      getMinute,
      getSecond,
      locale,
      setHour,
      setMinute,
      setSecond,
    } = useCalendarContext();
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

    /**
     * Compute rounded current time respecting step and hide settings.
     * Mirrors the original onThisMoment logic from TimePanel.
     */
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

    /**
     * Pending value: the time being adjusted in the panel before confirmation.
     * Not committed to internalValue until the user clicks Ok.
     */
    const [pendingValue, setPendingValue] = useState<DateType | undefined>(
      undefined,
    );

    /** Open panel and initialize pendingValue */
    const openPanelWithInit = useCallback(() => {
      const initValue = internalValue ?? computeCurrentTime();

      setPendingValue(initValue);
      onPanelToggle(true);
    }, [internalValue, computeCurrentTime, onPanelToggle]);

    /** Panel column selection → update pending only, do not commit */
    const onPanelChange = useCallback((val?: DateType) => {
      if (val) setPendingValue(val);
    }, []);

    /** Ok: commit pendingValue → update input + notify parent → close */
    const onConfirm = useCallback(() => {
      if (pendingValue) {
        onChange(pendingValue);
        onChangeProp?.(pendingValue);
      }

      setPendingValue(undefined);
      onPanelToggle(false);
    }, [pendingValue, onChange, onChangeProp, onPanelToggle]);

    /** Cancel / close: discard pendingValue → close without committing */
    const onCancel = useCallback(() => {
      setPendingValue(undefined);
      onPanelToggle(false);
    }, [onPanelToggle]);

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

        openPanelWithInit();
      };
    }, [openPanelWithInit, onFocusProp, readOnly]);

    const onKeyDownWithCloseControl = useCallback<
      KeyboardEventHandler<HTMLInputElement>
    >(
      (event) => {
        onKeyDown(event);

        if (onKeyDownProp) {
          onKeyDownProp(event);
        }

        if (event.key === 'Enter') {
          onConfirm();
        }
      },
      [onConfirm, onKeyDown, onKeyDownProp],
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

    /** Click away → cancel (do not commit) */
    usePickerDocumentEventClose({
      open,
      anchorRef,
      popperRef: panelRef,
      lastElementRefInFlow: inputRef,
      onClose: onCancel,
      onChangeClose: onCancel,
    });

    /** Icon */
    const onIconClick: MouseEventHandler<HTMLElement> = (e) => {
      e.stopPropagation();

      if (open) {
        onCancel();
      } else {
        openPanelWithInit();
      }
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
          hoverValue={
            open && !inputValue && pendingValue
              ? (formatToString(locale, pendingValue, resolvedFormat) ??
                undefined)
              : undefined
          }
          onChange={(e) => {
            const val = e.target.value as DateType;

            onInputChange(e); // Update inputValue display
            onChange(val); // Commit to internalValue
            onChangeProp?.(val); // Notify parent immediately
            onPanelChange(val); // Keep panel pendingValue in sync
          }}
          onClear={onClear}
          onFocus={() => openPanelWithInit()}
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
          onCancel={onCancel}
          onConfirm={onConfirm}
          open={open}
          popperProps={popperProps}
          secondStep={secondStep}
          value={pendingValue}
        />
      </>
    );
  },
);

export default TimePicker;
