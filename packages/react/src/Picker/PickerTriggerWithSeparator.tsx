import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import {
  FocusEventHandler,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useRef,
} from 'react';
import TextField, { TextFieldProps } from '../TextField';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import FormattedInput, { FormattedInputProps } from './FormattedInput';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface PickerTriggerWithSeparatorProps
  extends Omit<
    TextFieldProps,
    | 'active'
    | 'children'
    | 'defaultChecked'
    | 'disabled'
    | 'readonly'
    | 'typing'
  > {
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Error messages configuration for left input
   */
  errorMessagesLeft?: FormattedInputProps['errorMessages'];
  /**
   * Error messages configuration for right input
   */
  errorMessagesRight?: FormattedInputProps['errorMessages'];
  /**
   * The format pattern for the left input (e.g., "YYYY-MM-DD")
   */
  formatLeft: string;
  /**
   * The format pattern for the right input (e.g., "HH:mm:ss")
   */
  formatRight: string;
  /**
   * React ref for the left input element.
   */
  inputLeftRef?: RefObject<HTMLInputElement | null>;
  /**
   * React ref for the right input element.
   */
  inputRightRef?: RefObject<HTMLInputElement | null>;
  /**
   * Change handler for the left input element.
   * Called with ISO date string when value is complete and valid.
   */
  onChangeLeft?: (value: string, rawDigits: string) => void;
  /**
   * Change handler for the right input element.
   * Called with ISO date string when value is complete and valid.
   */
  onChangeRight?: (value: string, rawDigits: string) => void;
  /**
   * Focus handler for the left input element.
   */
  onFocusLeft?: FocusEventHandler<HTMLInputElement>;
  /**
   * Focus handler for the right input element.
   */
  onFocusRight?: FocusEventHandler<HTMLInputElement>;
  /**
   * Blur handler for the left input element.
   */
  onBlurLeft?: FocusEventHandler<HTMLInputElement>;
  /**
   * Blur handler for the right input element.
   */
  onBlurRight?: FocusEventHandler<HTMLInputElement>;
  /**
   * Callback when left input is completed (all mask positions filled with valid value).
   * Can be used to trigger auto-focus to right input.
   */
  onLeftComplete?: () => void;
  /**
   * Callback when right input is completed (all mask positions filled with valid value).
   */
  onRightComplete?: () => void;
  /**
   * Placeholder for the left input element.
   */
  placeholderLeft?: string;
  /**
   * Placeholder for the right input element.
   */
  placeholderRight?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * Custom suffix element.
   */
  suffix?: ReactNode;
  /**
   * Custom validation function for left input.
   */
  validateLeft?: (isoDate: string) => boolean;
  /**
   * Custom validation function for right input.
   */
  validateRight?: (isoDate: string) => boolean;
  /**
   * The value of the left input element.
   */
  valueLeft?: string;
  /**
   * The value of the right input element.
   */
  valueRight?: string;
  /**
   * Other input props for left input element.
   */
  inputLeftProps?: Omit<
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
   * Other input props for right input element.
   */
  inputRightProps?: Omit<
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
 * The react component for `mezzanine` picker trigger with separator.
 * This component contains two FormattedInput fields separated by a vertical line,
 * typically used for date-time pickers where left is date and right is time.
 */
const PickerTriggerWithSeparator = forwardRef<
  HTMLDivElement,
  PickerTriggerWithSeparatorProps
>(function PickerTriggerWithSeparator(props, ref) {
  const {
    className,
    clearable = true,
    disabled,
    errorMessagesLeft,
    errorMessagesRight,
    formatLeft,
    formatRight,
    inputLeftProps,
    inputLeftRef: inputLeftRefProp,
    inputRightProps,
    inputRightRef: inputRightRefProp,
    onBlurLeft,
    onBlurRight,
    onChangeLeft,
    onChangeRight,
    onFocusLeft,
    onFocusRight,
    onLeftComplete,
    onRightComplete,
    placeholderLeft,
    placeholderRight,
    readOnly,
    required,
    suffix,
    validateLeft,
    validateRight,
    valueLeft,
    valueRight,
    ...restTextFieldProps
  } = props;

  const internalLeftRef = useRef<HTMLInputElement>(null);
  const internalRightRef = useRef<HTMLInputElement>(null);

  const leftRef = useComposeRefs([
    internalLeftRef,
    inputLeftRefProp,
  ]) as unknown as RefObject<HTMLInputElement | null>;

  const rightRef = useComposeRefs([
    internalRightRef,
    inputRightRefProp,
  ]) as unknown as RefObject<HTMLInputElement | null>;

  // TextField requires disabled and readonly to be mutually exclusive
  let defaultTextFieldProps = {};

  if (disabled) {
    defaultTextFieldProps = { disabled: true as const };
  } else if (readOnly) {
    defaultTextFieldProps = { readonly: true as const };
  }

  /**
   * Handle left input change with auto-focus to right
   */
  const handleLeftChange = useCallback(
    (formattedValue: string, rawDigits: string) => {
      onChangeLeft?.(formattedValue, rawDigits);

      // If left value is complete, trigger callback and optionally focus right
      if (formattedValue && onLeftComplete) {
        onLeftComplete();
      }
    },
    [onChangeLeft, onLeftComplete],
  );

  /**
   * Handle right input change
   */
  const handleRightChange = useCallback(
    (formattedValue: string, rawDigits: string) => {
      onChangeRight?.(formattedValue, rawDigits);

      if (formattedValue && onRightComplete) {
        onRightComplete();
      }
    },
    [onChangeRight, onRightComplete],
  );

  /**
   * Handle left input focus
   */
  const handleLeftFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onFocusLeft?.(e);
    },
    [onFocusLeft],
  );

  /**
   * Handle right input focus
   */
  const handleRightFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onFocusRight?.(e);
    },
    [onFocusRight],
  );

  /**
   * Handle left input blur
   */
  const handleLeftBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onBlurLeft?.(e);
    },
    [onBlurLeft],
  );

  /**
   * Handle right input blur
   */
  const handleRightBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onBlurRight?.(e);
    },
    [onBlurRight],
  );

  return (
    <TextField
      {...restTextFieldProps}
      {...defaultTextFieldProps}
      ref={ref}
      className={cx(classes.host, className)}
      clearable={!readOnly && clearable}
      suffix={suffix}
    >
      <div className={classes.separatorInputs}>
        <div className={classes.separatorInput}>
          <FormattedInput
            {...inputLeftProps}
            ref={leftRef}
            aria-disabled={disabled}
            aria-label="Date input"
            aria-multiline={false}
            aria-readonly={readOnly}
            aria-required={required}
            disabled={disabled}
            errorMessages={errorMessagesLeft}
            format={formatLeft}
            onBlur={handleLeftBlur}
            onChange={handleLeftChange}
            onFocus={handleLeftFocus}
            placeholder={placeholderLeft}
            readOnly={readOnly}
            required={required}
            validate={validateLeft}
            value={valueLeft}
          />
        </div>
        <div className={classes.separator} />
        <div className={classes.separatorInput}>
          <FormattedInput
            {...inputRightProps}
            ref={rightRef}
            aria-disabled={disabled}
            aria-label="Time input"
            aria-multiline={false}
            aria-readonly={readOnly}
            aria-required={required}
            disabled={disabled}
            errorMessages={errorMessagesRight}
            format={formatRight}
            onBlur={handleRightBlur}
            onChange={handleRightChange}
            onFocus={handleRightFocus}
            placeholder={placeholderRight}
            readOnly={readOnly}
            required={required}
            validate={validateRight}
            value={valueRight}
          />
        </div>
      </div>
    </TextField>
  );
});

export default PickerTriggerWithSeparator;

export { PickerTriggerWithSeparator };
