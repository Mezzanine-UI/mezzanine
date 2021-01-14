import {
  TextareaHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  textareaClasses as classes,
  TextareaSize,
} from '@mezzanine-ui/core/textarea';
import { cx } from '../utils/cx';

export interface TextareaProps
  extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  /**
   * The size of textarea.
   * @default 'medium'
   */
  size?: TextareaSize;
  /**
   * The error of textarea.
   * @default 'false';
   */
  error?: boolean;
}

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<TextareaHTMLAttributes<HTMLTextAreaElement>, TextareaProps>(
  function Textarea(props, ref:any) {
    const {
      onChange,
      maxLength,
      value,
      defaultValue,
      error = false,
      children,
      className,
      disabled = false,
      size = 'medium',
      placeholder = '',
      ...rest
    } = props;

    const [text, setText] = useState<any>(defaultValue || '');
    const textLength = text.length;

    const handleChange = useCallback((e) => {
      if (onChange) {
        onChange(e);
      }
      setText(e.target.value);
    }, [onChange]);

    useEffect(() => {
      if (value && value !== defaultValue) {
        setText(value);
      }
    }, [defaultValue, ref, value]);

    return (
      <div className={cx(classes.wrapper,
        {
          [classes.disabled]: disabled,
          [classes.error]: error,
        },
        classes.size(size))}
      >
        <textarea
          ref={ref}
          value={text}
          onChange={handleChange}
          className={cx(classes.host, classes.size(size))}
          {...rest}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
        {maxLength ? (
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
            {maxLength}
          </span>
        ) : null}
      </div>
    );
  },
);

export default Textarea;
