import {
  forwardRef,
  useState,
  useEffect,
  Ref,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { TimesIcon } from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Icon from '../../Icon';

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
   * The value of textarea.
   * @default ''
   */
  textareaRef?: Ref<HTMLTextAreaElement>;
  value?: string;
}

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      className,
      clearable = false,
      defaultValue = '',
      disabled = false,
      error = false,
      maxTextLength,
      onChange,
      placeholder = '',
      size = 'medium',
      value = '',
      textareaRef,
    } = props;

    const [text, setText] = useState(defaultValue || '');
    const textLength = text.length;

    useEffect(() => {
      if (value && value !== defaultValue) {
        setText(value);
      }
    }, [defaultValue, value]);

    return (
      <div
        ref={ref}
        className={cx(classes.host,
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
          ref={textareaRef}
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
