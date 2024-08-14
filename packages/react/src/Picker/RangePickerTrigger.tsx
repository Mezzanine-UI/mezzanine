import { ArrowRightIcon } from '@mezzanine-ui/icons';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import {
  ChangeEventHandler,
  forwardRef,
  MouseEventHandler,
  RefObject,
} from 'react';
import TextField, { TextFieldProps } from '../TextField';
import Icon from '../Icon';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';

export interface RangePickerTriggerProps
  extends Omit<
    TextFieldProps,
    'active' | 'children' | 'suffix' | 'defaultChecked' | 'placeholder'
  > {
  /**
   * Placeholder for the 'from' input element.
   */
  inputFromPlaceholder?: string;
  /**
   * React Ref for the 'from' input element.
   */
  inputFromRef?: RefObject<HTMLInputElement>;
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
  inputToRef?: RefObject<HTMLInputElement>;
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
      clearable,
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
      ...restTextFieldProps
    } = props;

    return (
      <TextField
        {...restTextFieldProps}
        ref={ref}
        active={!!inputFromValue || !!inputToValue}
        className={cx(classes.host, className)}
        clearable={!readOnly && clearable}
        disabled={disabled}
      >
        <input
          {...inputFromProps}
          ref={inputFromRef}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          disabled={disabled}
          onChange={onInputFromChange}
          placeholder={inputFromPlaceholder}
          readOnly={readOnly}
          required={required}
          value={inputFromValue}
        />
        <Icon icon={ArrowRightIcon} className={classes.arrowIcon} />
        <input
          {...inputToProps}
          ref={inputToRef}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
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
