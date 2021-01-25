import {
  forwardRef,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import TextField from 'react/src/TextField';
import { cx } from '../../utils/cx';

export interface TextareaProps {
  className?: string;
  /**
   * The setting for clear textarea.
   * @default 'false'
   */
  clearable?: boolean;
  /**
   * The defaultValue of textarea.
   * @default ''
   */
  defaultValue?: string;
  /**
   * The setting for disable textarea.
   * @default 'false';
   */
  disabled?: boolean;
  /**
   * The error of textarea.
   * @default 'false'
   */
  error?: boolean;
  /**
   * The max length of textarea.
   */
  maxTextLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /**
   * The placeholder of textarea.
   * @default '';
   */
  placeholder?: string;
  /**
   * The size of textarea.
   * @default 'medium'
   */
  size?: InputSize;
  /**
   * The icon or text placed on the end of input.
   */
  suffix?: ReactNode;
  /**
   * The value of textarea.
   * @default ''
   */
  value?: string;
  readOnly?: boolean;
}

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      clearable = false,
      defaultValue = '',
      disabled = false,
      error = false,
      maxTextLength,
      onChange,
      placeholder = '',
      size = 'medium',
      suffix,
      value = '',
      readOnly = false,
    } = props;

    const [text, setText] = useState(defaultValue || '');
    const textLength = text.length;

    useEffect(() => {
      if (value && value !== defaultValue) {
        setText(value);
      }
    }, [defaultValue, value]);

    return (
      <TextField
        suffix={suffix}
        onClear={() => setText('')}
        disabled={disabled}
        error={error}
        size={size}
        multiple
        clearable={clearable && !!text}
      >
        <textarea
          ref={ref}
          value={text}
          readOnly={readOnly}
          onChange={(e) => {
            if (onChange) {
              onChange(e);
            }
            setText(e.target.value);
          }}
          className={cx(
            classes.multiple,
            classes.size(size),
            {
              [classes.error]: error,
            },
          )}
          placeholder={placeholder}
          disabled={disabled}
          aria-disabled={disabled}
          maxLength={maxTextLength}
        />
        {maxTextLength ? (
          <span className={cx(
            classes.counting,
            {
              [classes.disabled]: disabled,
              [classes.error]: error,
            },
          )}
          >
            {textLength}
            /
            {maxTextLength}
          </span>
        ) : null}
      </TextField>
    );
  },
);

export default Textarea;
