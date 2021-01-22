import {
  TextareaHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { TimesIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';

export interface TextareaProps
  extends DetailedHTMLProps <Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value | defaultValue'>,
  HTMLTextAreaElement> {
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: InputSize;
  /**
   * The error of textarea.
   * @default 'false'
   */
  error?: boolean;
  /**
   * The value of textarea.
   * @default ''
   */
  value?: string;
  /**
   * The defaultValue of textarea.
   * @default ''
   */
  defaultValue?: string;
  /**
   * The button for clear textarea.
   * @default 'false'
   */
  clearable?: boolean;
  /**
   * The max length of textarea.
   */
  maxTextLength?: number;
}

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref:any) {
    const {
      onChange,
      maxTextLength,
      value = '',
      defaultValue = '',
      error = false,
      clearable = false,
      children,
      className,
      disabled = false,
      size = 'medium',
      placeholder = '',
      ...rest
    } = props;

    const [text, setText] = useState(defaultValue || '');
    const textLength = text.length;

    useEffect(() => {
      if (value && value !== defaultValue) {
        setText(value);
      }
    }, [defaultValue, ref, value]);

    return (
      <div className={cx(classes.host,
        classes.multiple,
        {
          [classes.icon('end')]: clearable,
          [classes.disabled]: disabled,
          [classes.error]: error,
        },
        classes.size(size),
        className)}
      >
        <textarea
          ref={ref}
          value={text}
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
          {...rest}
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
        {clearable && text ? (
          <button
            onClick={() => setText('')}
            className={cx(
              classes.decoratorHost,
              classes.multiple,
              {
                [classes.error]: error,
                [classes.icon('end')]: clearable,
                [classes.clearButton]: clearable,
              },
            )}
            type="button"
          >
            <Icon icon={TimesIcon} />
          </button>
        ) : null}
      </div>
    );
  },
);

export default Textarea;
