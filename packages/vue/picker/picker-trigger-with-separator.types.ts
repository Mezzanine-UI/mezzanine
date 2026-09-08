import type { TextFieldProps } from '../text-field/text-field.types';
import type { FormattedInputProps } from './formatted-input.types';
import type { PickerInputProps } from './picker-trigger.types';

export interface PickerTriggerWithSeparatorProps
  extends Omit<TextFieldProps, 'active' | 'disabled' | 'readonly' | 'typing'> {
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Error messages configuration for left input
   */
  errorMessagesLeft?: FormattedInputProps['errorMessages'];
  /**
   * Error messages configuration for right input
   */
  errorMessagesRight?: FormattedInputProps['errorMessages'];
  /**
   * The format pattern for the left input (e.g., "YYYY-MM-DD")
   */
  formatLeft: string;
  /**
   * The format pattern for the right input (e.g., "HH:mm:ss")
   */
  formatRight: string;
  /**
   * A pre-formatted date string to preview in the left input when it is empty and not focused.
   */
  hoverValueLeft?: string;
  /**
   * Other input props for left input element.
   */
  inputLeftProps?: PickerInputProps;
  /**
   * Other input props for right input element.
   */
  inputRightProps?: PickerInputProps;
  /**
   * Placeholder for the left input element.
   */
  placeholderLeft?: string;
  /**
   * Placeholder for the right input element.
   */
  placeholderRight?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * Custom validation function for left input.
   */
  validateLeft?: (isoDate: string) => boolean;
  /**
   * Custom validation function for right input.
   */
  validateRight?: (isoDate: string) => boolean;
  /**
   * The value of the left input element.
   */
  valueLeft?: string;
  /**
   * The value of the right input element.
   */
  valueRight?: string;
}
