import type { UseDateInputFormatterProps } from './use-date-input-formatter';

export interface FormattedInputProps {
  /**
   * error messages for different validation scenarios
   * @default { enabled: true, invalidInput: 'Input value is not valid.', invalidPaste: 'Pasted content is not valid.' }
   */
  errorMessages?: {
    enabled?: boolean;
    invalidInput?: string;
    invalidPaste?: string;
  };
  /**
   * Format pattern (e.g., "YYYY-MM-DD", "HH:mm:ss")
   */
  format: string;
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
   * Custom validation function. Return true if valid, false to clear the value.
   * Called after format validation passes.
   */
  validate?: UseDateInputFormatterProps['validate'];
  /**
   * The current value
   */
  value?: string;
}
