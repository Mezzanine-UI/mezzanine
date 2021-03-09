import {
  forwardRef,
  ChangeEventHandler,
  Ref,
} from 'react';
import {
  textareaClasses as classes,
  TextareaSize,
} from '@mezzanine-ui/core/textarea';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import TextField, { TextFieldProps } from '../TextField';
import { useInputControl, useInputFormControl } from '../Input';

export interface TextareaProps extends Omit<TextFieldProps, 'active' | 'children' | 'onClear' | 'prefix' | 'suffix'> {
  /**
   * The default value of textarea.
   */
  defaultValue?: string;
  /**
   * The max length of textarea.
   */
  maxLength?: number;
  /**
   * The change event handler of textarea element.
   */
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  /**
   * The placeholder of textarea.
   */
  placeholder?: string;
  /**
   * Whether the textarea is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * The rows of textarea.
   */
  rows?: number;
  /**
   * The size of textarea.
   * @default 'medium'
   */
  size?: TextareaSize;
  /**
   * The react ref passed to textarea element.
   */
  textareaRef?: Ref<HTMLTextAreaElement>;
  /**
   * The other native props for textarea element.
   */
  textareaProps?: Omit<
  NativeElementPropsWithoutKeyAndRef<'textarea'>,
  | Exclude<keyof TextareaProps, 'className'>
  | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
  /**
   * The value of textarea.
   */
  value?: string;
}

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<HTMLDivElement, TextareaProps>(function Textarea(props, ref) {
  const {
    className,
    clearable = false,
    defaultValue,
    disabled: disabledProp = false,
    error: errorProp = false,
    fullWidth: fullWidthProp = false,
    maxLength,
    onChange: onChangeProp,
    placeholder,
    readOnly = false,
    required: requiredProp = false,
    rows,
    size = 'medium',
    textareaRef: textareaRefProp,
    textareaProps,
    value: valueProp,
  } = props;
  const {
    active,
    composedRef,
    onClear,
    onChange,
    value,
  } = useInputControl({
    ref: textareaRefProp,
    defaultValue,
    onChange: onChangeProp,
    value: valueProp,
  });
  const {
    disabled,
    error,
    fullWidth,
    required,
  } = useInputFormControl({
    disabled: disabledProp,
    error: errorProp,
    fullWidth: fullWidthProp,
    required: requiredProp,
  });
  const currentLength = value.length;
  const upperLimit = typeof maxLength === 'number' && currentLength >= maxLength;

  return (
    <TextField
      ref={ref}
      active={active}
      className={cx(
        classes.host,
        {
          [classes.upperLimit]: upperLimit,
        },
        className,
      )}
      clearable={clearable}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      onClear={onClear}
      size={size}
    >
      <textarea
        {...textareaProps}
        ref={composedRef}
        aria-disabled={disabled}
        aria-multiline
        aria-readonly={readOnly}
        aria-required={required}
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        rows={rows}
        value={value}
      />
      {typeof maxLength === 'number' && (
        <span className={classes.count}>
          {value.length}
          /
          {maxLength}
        </span>
      )}
    </TextField>
  );
});

export default Textarea;
