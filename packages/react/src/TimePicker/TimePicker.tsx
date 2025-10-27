'use client';

import { DateType } from '@mezzanine-ui/core/calendar';
import { ClockIcon } from '@mezzanine-ui/icons';
import {
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCalendarContext } from '../Calendar';
import { FormControlContext } from '../Form';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import {
  PickerTrigger,
  PickerTriggerProps,
  usePickerDocumentEventClose,
  usePickerValue,
} from '../Picker';
import TimePickerPanel, { TimePickerPanelProps } from './TimePickerPanel';

export interface TimePickerProps
  extends Omit<TimePickerPanelProps, 'onConfirm'>,
    Omit<
      PickerTriggerProps,
      | 'anchor'
      | 'defaultValue'
      | 'inputRef'
      | 'onChange'
      | 'onClear'
      | 'onClick'
      | 'onIconClick'
      | 'onKeyDown'
      | 'open'
      | 'suffixActionIcon'
      | 'value'
    > {
  /**
   * Default value for time picker.
   */
  defaultValue?: DateType;
  /**
   * The format for displaying time.
   */
  format?: string;
  /**
   * A function that fires when panel toggled. Receive open status in boolean format as props.
   */
  onPanelToggle?: (open: boolean) => void;
}

/**
 * The react component for `mezzanine` time picker.
 * Notice that any component related to time-picker should be used along with `CalendarContext`.
 */
const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  function TimePicker(props, ref) {
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const { defaultTimeFormat } = useCalendarContext();
    const {
      className,
      clearable = true,
      confirmText,
      defaultValue,
      disabled = disabledFromFormControl,
      error = severity === 'error' || false,
      format = defaultTimeFormat,
      fullWidth = fullWidthFromFormControl,
      hideHour,
      hideMinute,
      hideSecond,
      hourPrefix,
      hourStep,
      inputProps,
      minutePrefix,
      minuteStep,
      onChange: onChangeProp,
      onPanelToggle: onPanelToggleProp,
      placeholder,
      popperProps,
      prefix,
      readOnly,
      required = requiredFromFormControl,
      secondPrefix,
      secondStep,
      size: sizeProp,
      value: valueProp,
    } = props;
    const {
      onBlur: onBlurProp,
      onKeyDown: onKeyDownProp,
      onFocus: onFocusProp,
      size: inputSize = format.length + 2,
      ...restInputProp
    } = inputProps || {};

    const formats = useMemo(() => [format], [format]);

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

    const onFocus = useCallback<FocusEventHandler<HTMLInputElement>>(
      (event) => {
        if (onFocusProp) {
          onFocusProp(event);
        }

        onPanelToggle(true);
      },
      [onFocusProp, onPanelToggle],
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
      format,
      formats,
      inputRef,
      value: valueProp,
    });

    /** Panel confirm handler */
    const onConfirm = useCallback(() => {
      if (onChangeProp) {
        onChangeProp(internalValue);
      }

      onPanelToggle(false);
    }, [internalValue, onChangeProp, onPanelToggle]);

    /** Bind input props */
    const onResolvedKeyDown = useCallback<
      KeyboardEventHandler<HTMLInputElement>
    >(
      (event) => {
        if (onKeyDownProp) {
          onKeyDownProp(event);
        }

        onKeyDown(event);

        if (event.key === 'Enter') {
          onConfirm();
        }
      },
      [onConfirm, onKeyDown, onKeyDownProp],
    );

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
      onKeyDown: onResolvedKeyDown,
      onBlur: onResolvedBlur,
    };

    /** Popper positioning */
    const anchorRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([anchorRef, ref]);

    /** Blur, click away and key down close */
    const onClose = () => {
      onChange(valueProp);

      onPanelToggle(false);
    };

    usePickerDocumentEventClose({
      open,
      anchorRef,
      popperRef: panelRef,
      lastElementRefInFlow: inputRef,
      onClose,
      onChangeClose: onClose,
    });

    /** Bind on change to on clear */
    const onClear: PickerTriggerProps['onClear'] = () => {
      onChange(undefined);

      onChangeProp?.(undefined);
    };

    /** Icon */
    const onIconClick: MouseEventHandler<HTMLElement> = (e) => {
      e.stopPropagation();

      if (open) {
        onChange(valueProp);
      }

      onPanelToggle(!open);
    };

    const suffixActionIcon = <Icon icon={ClockIcon} onClick={onIconClick} />;

    return (
      <>
        <PickerTrigger
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
          size={sizeProp}
          suffixActionIcon={suffixActionIcon}
          value={inputValue}
        />
        <TimePickerPanel
          ref={panelRef}
          anchor={anchorRef}
          confirmText={confirmText}
          hideHour={hideHour}
          hideMinute={hideMinute}
          hideSecond={hideSecond}
          hourPrefix={hourPrefix}
          hourStep={hourStep}
          minutePrefix={minutePrefix}
          minuteStep={minuteStep}
          onChange={onChange}
          onConfirm={onConfirm}
          open={open}
          popperProps={popperProps}
          secondPrefix={secondPrefix}
          secondStep={secondStep}
          value={internalValue}
        />
      </>
    );
  },
);

export default TimePicker;
