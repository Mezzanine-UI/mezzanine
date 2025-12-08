import { ArrowRightIcon, CalendarIcon } from '@mezzanine-ui/icons';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import {
  ChangeEventHandler,
  forwardRef,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import TextField, { TextFieldProps } from '../TextField';
import Icon from '../Icon';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';

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
  onInputFromChange?: ChangeEventHandler;
  /**
   * Change handler for the 'to' input element.
   */
  onInputToChange?: ChangeEventHandler;
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
 */
const RangePickerTrigger = forwardRef<HTMLDivElement, RangePickerTriggerProps>(
  function DateRangePickerTrigger(props, ref) {
    const {
      className,
      clearable = true,
      disabled,
      inputFromPlaceholder,
      inputFromProps,
      inputFromRef,
      inputFromValue,
      inputToPlaceholder,
      inputToProps,
      inputToRef,
      inputToValue,
      onIconClick,
      onInputFromChange,
      onInputToChange,
      readOnly,
      required,
      suffix,
      ...restTextFieldProps
    } = props;

    const defaultSuffix = (
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
        <input
          {...inputFromProps}
          ref={inputFromRef}
          aria-disabled={disabled}
          aria-label="Start date"
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          className={cx(classes.inputMono, inputFromProps?.className)}
          disabled={disabled}
          onChange={onInputFromChange}
          placeholder={inputFromPlaceholder}
          readOnly={readOnly}
          required={required}
          value={inputFromValue}
        />
        <Icon
          icon={ArrowRightIcon}
          className={classes.arrowIcon}
          aria-hidden="true"
        />
        <input
          {...inputToProps}
          ref={inputToRef}
          aria-disabled={disabled}
          aria-label="End date"
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          className={cx(classes.inputMono, inputToProps?.className)}
          disabled={disabled}
          onChange={onInputToChange}
          placeholder={inputToPlaceholder}
          readOnly={readOnly}
          required={required}
          value={inputToValue}
        />
      </TextField>
    );
  },
);

export default RangePickerTrigger;
