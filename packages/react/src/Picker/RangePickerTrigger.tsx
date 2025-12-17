import { CalendarIcon, LongTailArrowRightIcon } from '@mezzanine-ui/icons';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import {
  FocusEventHandler,
  forwardRef,
  MouseEventHandler,
  ReactNode,
  RefObject,
  useCallback,
  useRef,
} from 'react';
import TextField, { TextFieldProps } from '../TextField';
import Icon from '../Icon';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import FormattedInput, { FormattedInputProps } from './FormattedInput';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface RangePickerTriggerProps
  extends Omit<
    TextFieldProps,
    | 'active'
    | 'children'
    | 'defaultChecked'
    | 'disabled'
    | 'placeholder'
    | 'readonly'
    | 'typing'
  > {
  /**
   * Whether the picker is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Error messages configuration for 'from' input
   */
  errorMessagesFrom?: FormattedInputProps['errorMessages'];
  /**
   * Error messages configuration for 'to' input
   */
  errorMessagesTo?: FormattedInputProps['errorMessages'];
  /**
   * The format pattern for the inputs (e.g., "YYYY-MM-DD")
   */
  format: string;
  /**
   * Placeholder for the 'from' input element.
   */
  inputFromPlaceholder?: string;
  /**
   * React Ref for the 'from' input element.
   */
  inputFromRef?: RefObject<HTMLInputElement | null>;
  /**
   * Value of the 'from' input element.
   */
  inputFromValue?: string;
  /**
   * Placeholder for the 'to' input element.
   */
  inputToPlaceholder?: string;
  /**
   * React Ref for the 'to' input element.
   */
  inputToRef?: RefObject<HTMLInputElement | null>;
  /**
   * Value of the 'to' input element.
   */
  inputToValue?: string;
  /**
   * Click Handler for the calendar icon.
   */
  onIconClick?: MouseEventHandler;
  /**
   * Change handler for the 'from' input element.
   */
  onInputFromChange?: (formatted: string, rawDigits: string) => void;
  /**
   * Change handler for the 'to' input element.
   */
  onInputToChange?: (formatted: string, rawDigits: string) => void;
  /**
   * Focus handler for the 'from' input element.
   */
  onFromFocus?: FocusEventHandler<HTMLInputElement>;
  /**
   * Blur handler for the 'from' input element.
   */
  onFromBlur?: FocusEventHandler<HTMLInputElement>;
  /**
   * Focus handler for the 'to' input element.
   */
  onToFocus?: FocusEventHandler<HTMLInputElement>;
  /**
   * Blur handler for the 'to' input element.
   */
  onToBlur?: FocusEventHandler<HTMLInputElement>;
  /**
   * Whether the inputs are readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the inputs are required.
   * @default false
   */
  required?: boolean;
  /**
   * Custom suffix element. If not provided, defaults to CalendarIcon.
   */
  suffix?: ReactNode;
  /**
   * Custom suffix action icon element (e.g., calendar icon with click handler)
   */
  suffixActionIcon?: ReactNode;
  /**
   * Custom validation function for 'from' input
   */
  validateFrom?: (isoDate: string) => boolean;
  /**
   * Custom validation function for 'to' input
   */
  validateTo?: (isoDate: string) => boolean;
  /**
   * Other input props you may provide to the 'from' input element.
   */
  inputFromProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'value'
    | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
  /**
   * Other input props you may provide to the 'to' input element.
   */
  inputToProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'value'
    | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
}

/**
 * The react component for `mezzanine` date range picker trigger.
 * Uses FormattedInput for both from and to inputs to support the new input mode.
 */
const RangePickerTrigger = forwardRef<HTMLDivElement, RangePickerTriggerProps>(
  function RangePickerTrigger(props, ref) {
    const {
      className,
      clearable = true,
      disabled,
      errorMessagesFrom,
      errorMessagesTo,
      format,
      inputFromPlaceholder,
      inputFromProps,
      inputFromRef: inputFromRefProp,
      inputFromValue,
      inputToPlaceholder,
      inputToProps,
      inputToRef: inputToRefProp,
      inputToValue,
      onFromBlur,
      onFromFocus,
      onIconClick,
      onInputFromChange,
      onInputToChange,
      onToBlur,
      onToFocus,
      readOnly,
      required,
      suffix,
      suffixActionIcon,
      validateFrom,
      validateTo,
      ...restTextFieldProps
    } = props;

    const internalFromRef = useRef<HTMLInputElement>(null);
    const internalToRef = useRef<HTMLInputElement>(null);

    const fromRef = useComposeRefs([
      internalFromRef,
      inputFromRefProp,
    ]) as unknown as RefObject<HTMLInputElement | null>;

    const toRef = useComposeRefs([
      internalToRef,
      inputToRefProp,
    ]) as unknown as RefObject<HTMLInputElement | null>;

    const defaultSuffix = suffixActionIcon ?? (
      <Icon
        icon={CalendarIcon}
        onClick={onIconClick}
        aria-label="Open calendar"
      />
    );

    // TextField requires disabled and readonly to be mutually exclusive
    let defaultTextFieldProps = {};

    if (disabled) {
      defaultTextFieldProps = { disabled: true as const };
    } else if (readOnly) {
      defaultTextFieldProps = { readonly: true as const };
    }

    /**
     * Handle from input change
     */
    const handleFromChange = useCallback(
      (formattedValue: string, rawDigits: string) => {
        onInputFromChange?.(formattedValue, rawDigits);
      },
      [onInputFromChange],
    );

    /**
     * Handle to input change
     */
    const handleToChange = useCallback(
      (formattedValue: string, rawDigits: string) => {
        onInputToChange?.(formattedValue, rawDigits);
      },
      [onInputToChange],
    );

    /**
     * Handle from input focus
     */
    const handleFromFocus: FocusEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onFromFocus?.(e);
      },
      [onFromFocus],
    );

    /**
     * Handle to input focus
     */
    const handleToFocus: FocusEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onToFocus?.(e);
      },
      [onToFocus],
    );

    /**
     * Handle from input blur
     */
    const handleFromBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onFromBlur?.(e);
      },
      [onFromBlur],
    );

    /**
     * Handle to input blur
     */
    const handleToBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onToBlur?.(e);
      },
      [onToBlur],
    );

    return (
      <TextField
        {...restTextFieldProps}
        {...defaultTextFieldProps}
        ref={ref}
        active={!!inputFromValue || !!inputToValue}
        className={cx(classes.host, className)}
        clearable={!readOnly && clearable}
        suffix={suffix ?? defaultSuffix}
      >
        <FormattedInput
          {...inputFromProps}
          ref={fromRef}
          aria-disabled={disabled}
          aria-label="Start date"
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          disabled={disabled}
          errorMessages={errorMessagesFrom}
          format={format}
          onBlur={handleFromBlur}
          onChange={handleFromChange}
          onFocus={handleFromFocus}
          placeholder={inputFromPlaceholder}
          readOnly={readOnly}
          required={required}
          validate={validateFrom}
          value={inputFromValue}
        />
        <Icon
          icon={LongTailArrowRightIcon}
          className={classes.arrowIcon}
          aria-hidden="true"
        />
        <FormattedInput
          {...inputToProps}
          ref={toRef}
          aria-disabled={disabled}
          aria-label="End date"
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          disabled={disabled}
          errorMessages={errorMessagesTo}
          format={format}
          onBlur={handleToBlur}
          onChange={handleToChange}
          onFocus={handleToFocus}
          placeholder={inputToPlaceholder}
          readOnly={readOnly}
          required={required}
          validate={validateTo}
          value={inputToValue}
        />
      </TextField>
    );
  },
);

export default RangePickerTrigger;
