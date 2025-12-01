import { forwardRef, InputHTMLAttributes, useRef } from 'react';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { cx } from '../utils/cx';
import { useDateInputFormatter } from './useDateInputFormatter';
import { useComposeRefs } from '../hooks/useComposeRefs';

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
      format,
      value: externalValue,
      onChange,
      ...inputProps
    } = props;

    const internalInputRef = useRef<HTMLInputElement>(null);
    const composedRef = useComposeRefs([ref, internalInputRef]);

    const { value, handleChange, handleKeyDown, handleFocus, handleBlur } =
      useDateInputFormatter({
        format,
        value: externalValue,
        onChange,
        inputRef: internalInputRef,
      });

    // Render mixed-color display overlay
    const renderMixedColorDisplay = () => {
      const currentValue = value || '';
      const filledLength = currentValue.replace(/[^0-9]/g, '').length;

      const segments: Array<{ text: string; filled: boolean }> = [];
      let digitCount = 0;

      for (let i = 0; i < format.length; i++) {
        const char = format[i];
        const isSeparator = !['Y', 'M', 'D', 'H', 'm', 's', 'S'].includes(char);

        if (isSeparator) {
          // Separator characters
          segments.push({
            text: char,
            filled: digitCount > 0 && digitCount <= filledLength,
          });
        } else {
          // Format character (Y, M, D, H, m, s, S)
          digitCount++;
          const actualChar = currentValue[i] || char;
          segments.push({
            text: actualChar,
            filled: digitCount <= filledLength,
          });
        }
      }

      return (
        <div className={classes.formattedInputDisplay}>
          {segments.map((segment, index) => (
            <span
              key={index}
              className={cx(
                classes.formattedInputSegment,
                segment.filled && classes.formattedInputSegmentFilled,
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
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {renderMixedColorDisplay()}
      </div>
    );
  },
);

export default FormattedInput;
