'use client';

import { forwardRef, Ref, useContext, ChangeEventHandler, useRef } from 'react';
import {
  textareaClasses as classes,
  TextareaSize,
} from '@mezzanine-ui/core/textarea';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';
import { FormControlContext } from '../Form';
import TextField, { TextFieldProps } from '../TextField';
import { MezzanineConfig } from '../Provider/context';

export interface TextareaProps
  extends Omit<
    TextFieldProps,
    'active' | 'children' | 'onClear' | 'prefix' | 'suffix' | 'suffixActionIcon'
  > {
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
    | 'defaultValue'
    | 'disabled'
    | 'maxLength'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'rows'
    | 'value'
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
const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
  function Textarea(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const {
      className,
      clearable = false,
      defaultValue,
      disabled = disabledFromFormControl || false,
      error = severity === 'error' || false,
      fullWidth = fullWidthFromFormControl || false,
      maxLength,
      onChange: onChangeProp,
      placeholder,
      readOnly = false,
      required = requiredFromFormControl || false,
      rows,
      size = globalSize,
      textareaRef: textareaRefProp,
      textareaProps,
      value: valueProp,
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, onChange, onClear] = useInputWithClearControlValue({
      defaultValue,
      onChange: onChangeProp,
      ref: textareaRef,
      value: valueProp,
    });
    const composedTextareaRef = useComposeRefs([textareaRefProp, textareaRef]);
    const active = !!value;
    const currentLength = value.length;
    const upperLimit =
      typeof maxLength === 'number' && currentLength >= maxLength;

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
          ref={composedTextareaRef}
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
            {value.length}/{maxLength}
          </span>
        )}
      </TextField>
    );
  },
);

export default Textarea;
