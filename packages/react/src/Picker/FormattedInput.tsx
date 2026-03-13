import { forwardRef, InputHTMLAttributes, useRef } from 'react';
import { pickerClasses as classes } from '@mezzanine-ui/core/picker';
import { cx } from '../utils/cx';
import {
  useDateInputFormatter,
  type UseDateInputFormatterProps,
} from './useDateInputFormatter';
import { useComposeRefs } from '../hooks/useComposeRefs';
import {
  parseFormatSegments,
  isMaskSegmentFilled,
  findPreviousMaskSegment,
  getTemplateWithoutBrackets,
} from './formatUtils';

export interface FormattedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>,
    Pick<
      UseDateInputFormatterProps,
      'errorMessages' | 'validate' | 'format' | 'onChange' | 'onPasteIsoValue'
    > {
  /**
   * A pre-formatted date string to preview when the input is empty and not focused.
   * Used to show calendar hover preview in placeholder color.
   */
  hoverValue?: string;
  /**
   * Placeholder to show when not focused and value is empty
   */
  placeholder?: string;
  /**
   * The current value
   */
  value?: string;
}

/**
 * Formatted input component with mixed-color placeholder
 */
const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  function FormattedInput(props, ref) {
    const {
      className,
      disabled,
      errorMessages = {
        enabled: true,
        invalidInput: 'Input value is not valid.',
        invalidPaste: 'Pasted content is not valid.',
      },
      format,
      hoverValue,
      placeholder,
      validate,
      value: externalValue,
      onChange,
      onFocus,
      onBlur,
      onPasteIsoValue,
      ...inputProps
    } = props;

    const internalInputRef = useRef<HTMLInputElement>(null);
    const composedRef = useComposeRefs([ref, internalInputRef]);

    const {
      value,
      focused,
      isComplete,
      handleKeyDown,
      handleFocus,
      handleBlur,
      handlePaste,
    } = useDateInputFormatter({
      errorMessages,
      format,
      value: externalValue,
      onChange,
      inputRef: internalInputRef,
      onFocus,
      onBlur,
      validate,
      onPasteIsoValue,
    });

    const segments = useRef(parseFormatSegments(format)).current;

    const renderMixedColorDisplay = () => {
      const template = getTemplateWithoutBrackets(format);
      const isTemplate = value === template;
      const isHoverPreview = isTemplate && !!hoverValue;
      const currentValue = isHoverPreview ? hoverValue : value || '';

      // Show native placeholder when no value and no hover preview
      if (isTemplate && !isHoverPreview && placeholder) {
        return null;
      }

      const displaySegments: Array<{ text: string; filled: boolean }> = [];

      for (const segment of segments) {
        if (segment.type === 'mask') {
          for (let i = segment.start; i < segment.end; i++) {
            displaySegments.push({
              text: currentValue[i] || segment.text[i - segment.start],
              filled: isHoverPreview ? false : /\d/.test(currentValue[i]),
            });
          }
        } else {
          const prevMask = findPreviousMaskSegment(segments, segment.start);
          const isFilled = isHoverPreview
            ? false
            : prevMask
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
                segment.filled &&
                  (isComplete
                    ? classes.formattedInputSegmentFilled
                    : classes.formattedInputSegmentFilling),
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
        // Suppress native placeholder when hover preview is active
        if (hoverValue) return undefined;

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
