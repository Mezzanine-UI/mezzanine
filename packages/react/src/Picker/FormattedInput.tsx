import { forwardRef, InputHTMLAttributes, useRef } from 'react';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { cx } from '../utils/cx';
import { useDateInputFormatter } from './useDateInputFormatter';
import { useComposeRefs } from '../hooks/useComposeRefs';
import {
  parseFormatSegments,
  isMaskSegmentFilled,
  findPreviousMaskSegment,
} from './formatUtils';

export interface FormattedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /**
   * The format pattern (e.g., "YYYY-MM-DD", "HH:mm:ss")
   */
  format: string;
  /**
   * The current value
   */
  value?: string;
  /**
   * Change handler receiving formatted value and raw digits
   */
  onChange?: (formattedValue: string, rawDigits: string) => void;
}

/**
 * Formatted input component with mixed-color placeholder
 * - Filled digits: neutral-solid (black)
 * - Unfilled positions: neutral-faint (gray)
 * - Separators: neutral-solid when displayed
 */
const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  function FormattedInput(props, ref) {
    const {
      className,
      disabled,
      format,
      value: externalValue,
      onChange,
      ...inputProps
    } = props;

    const internalInputRef = useRef<HTMLInputElement>(null);
    const composedRef = useComposeRefs([ref, internalInputRef]);

    const {
      value,
      handleChange,
      handleKeyDown,
      handleFocus,
      handleBlur,
      handleCompositionStart,
      handleCompositionEnd,
    } = useDateInputFormatter({
      format,
      value: externalValue,
      onChange,
      inputRef: internalInputRef,
    });

    // Parse format once
    const segments = useRef(parseFormatSegments(format)).current;

    // Render mixed-color display overlay
    const renderMixedColorDisplay = () => {
      const currentValue = value || '';
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
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        {renderMixedColorDisplay()}
      </div>
    );
  },
);

export default FormattedInput;
