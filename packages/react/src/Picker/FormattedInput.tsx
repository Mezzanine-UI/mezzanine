import { forwardRef, InputHTMLAttributes, useRef } from 'react';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { cx } from '../utils/cx';
import { useDateInputFormatter } from './useDateInputFormatter';
import { useComposeRefs } from '../hooks/useComposeRefs';
import {
  parseFormatSegments,
  isMaskSegmentFilled,
  findPreviousMaskSegment,
  getTemplateWithoutBrackets,
} from './formatUtils';

export interface FormattedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /**
   * The format pattern (e.g., "YYYY-MM-DD", "HH:mm:ss")
   */
  format: string;
  /**
   * Placeholder to show when not focused and value is empty
   */
  placeholder?: string;
  /**
   * The current value
   */
  value?: string;
  /**
   * Change handler receiving formatted value and raw digits
   */
  onChange?: (formattedValue: string, rawDigits: string) => void;
  /**
   * Custom validation function. Return true if valid, false to reject the value.
   */
  validate?: (isoDate: string) => boolean;
}

/**
 * Formatted input component with mixed-color placeholder
 */
const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  function FormattedInput(props, ref) {
    const {
      className,
      disabled,
      format,
      placeholder,
      validate,
      value: externalValue,
      onChange,
      onFocus,
      onBlur,
      ...inputProps
    } = props;

    const internalInputRef = useRef<HTMLInputElement>(null);
    const composedRef = useComposeRefs([ref, internalInputRef]);

    const {
      value,
      focused,
      handleKeyDown,
      handleFocus,
      handleBlur,
      handlePaste,
    } = useDateInputFormatter({
      format,
      value: externalValue,
      onChange,
      inputRef: internalInputRef,
      onFocus,
      onBlur,
      validate,
    });

    const segments = useRef(parseFormatSegments(format)).current;

    const renderMixedColorDisplay = () => {
      const currentValue = value || '';

      // Show placeholder when no value
      if (currentValue === getTemplateWithoutBrackets(format) && placeholder) {
        return null;
      }

      // Show format mask when focused or has value
      const displaySegments: Array<{ text: string; filled: boolean }> = [];

      for (const segment of segments) {
        if (segment.type === 'mask') {
          // Render each character of the mask segment
          for (let i = segment.start; i < segment.end; i++) {
            displaySegments.push({
              text: currentValue[i] || segment.text[i - segment.start],
              filled: /\d/.test(currentValue[i]),
            });
          }
        } else {
          // Separator or literal - show as filled if previous mask segment is filled
          const prevMask = findPreviousMaskSegment(segments, segment.start);
          const isFilled = prevMask
            ? isMaskSegmentFilled(currentValue, prevMask)
            : false;

          displaySegments.push({
            text: segment.text,
            filled: isFilled,
          });
        }
      }

      return (
        <div aria-hidden="true" className={classes.formattedInputDisplay}>
          {displaySegments.map((segment, index) => (
            <span
              key={index}
              className={cx(
                classes.formattedInputSegment,
                segment.filled && classes.formattedInputSegmentFilled,
                disabled && classes.formattedInputSegmentDisabled,
              )}
            >
              {segment.text}
            </span>
          ))}
        </div>
      );
    };

    const renderPlaceholder = () => {
      if (value === getTemplateWithoutBrackets(format)) {
        if (focused) return getTemplateWithoutBrackets(format);

        return placeholder;
      }

      return undefined;
    };

    return (
      <div className={classes.formattedInput}>
        <input
          {...inputProps}
          ref={composedRef}
          className={cx(
            classes.inputMono,
            classes.formattedInputHidden,
            className,
          )}
          disabled={disabled}
          type="text"
          value={value === getTemplateWithoutBrackets(format) ? '' : value}
          placeholder={renderPlaceholder()}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
        />
        {renderMixedColorDisplay()}
      </div>
    );
  },
);

export default FormattedInput;
