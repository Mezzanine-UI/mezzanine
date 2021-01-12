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
  /**
   * Maximum length of the textarea .
   * @default 'false';
   */
  maxLength?: number;
}

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref:any) {
  const {
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

  const [text, setText] = useState(defaultValue || '');

  const handleChange = useCallback(({
    target,
  }) => {
    setText(target.value);
  }, []);

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
        className={classes.host}
        {...rest}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
      />
      {maxLength ? (
        <span className={classes.counting}>123</span>
      ) : null}
    </div>
  );
});

export default Textarea;
