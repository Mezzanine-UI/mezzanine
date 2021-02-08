import {
  forwardRef,
  ChangeEventHandler,
  Ref,
  DetailedHTMLProps,
  TextareaHTMLAttributes,
} from 'react';
import {
  textareaClasses as classes,
  TextareaSize,
} from '@mezzanine-ui/core/textarea';
import { cx } from '../utils/cx';
import TextField, { TextFieldProps } from '../TextField';
import Typography from '../Typography';
import { useInputControl } from '../Input';

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
   */
  readOnly?: boolean;
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
  DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
  | keyof TextareaProps
  | `aria-${'disabled' | 'multiline' | 'readonly'}`
  | 'ref'
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
    disabled = false,
    error = false,
    fullWidth = false,
    maxLength,
    onChange: onChangeProp,
    placeholder = '',
    readOnly = false,
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
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        value={value}
      />
      {typeof maxLength === 'number' && (
        <Typography
          className={classes.count}
          component="span"
          variant="caption"
        >
          {value.length}
          /
          {maxLength}
        </Typography>
      )}
    </TextField>
  );
});

export default Textarea;
