import { CalendarIcon } from '@mezzanine-ui/icons';
import { datePickerClasses as classes } from '@mezzanine-ui/core/date-picker';
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

export interface DatePickerTriggerProps
  extends
  Omit<TextFieldProps, 'active' | 'children' | 'suffix' | 'suffixActionIcon' | 'defualtChecked'> {
  /**
   * React ref for the input element.
   */
  inputRef?: RefObject<HTMLInputElement>;
  /**
   * Change handler for the input element.
   */
  onChange?: ChangeEventHandler;
  /**
   * Click Handler for the calendar icon.
   */
  onIconClick?: MouseEventHandler;
  /**
   * Placeholder for the input element.
   */
  placeholder?: string;
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
   * The value of the input element.
   */
  value?: string;
  /**
   * Other input props you may provide to input element.
   */
  inputProps?: Omit<
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
 * The react component for `mezzanine` date picker trigger.
 */
const DatePickerTrigger = forwardRef<HTMLDivElement, DatePickerTriggerProps>(
  function DatePickerTrigger(props, ref) {
    const {
      className,
      disabled,
      inputProps,
      inputRef,
      onChange,
      readOnly,
      required,
      onIconClick,
      placeholder,
      value,
      ...restTextFieldProps
    } = props;

    return (
      <TextField
        {...restTextFieldProps}
        ref={ref}
        active={!!value}
        className={cx(
          classes.host,
          className,
        )}
        disabled={disabled}
        suffixActionIcon={(
          <Icon
            icon={CalendarIcon}
            onClick={onIconClick}
          />
        )}
      >
        <input
          {...inputProps}
          ref={inputRef}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          value={value}
        />
      </TextField>
    );
  },
);

export default DatePickerTrigger;
