import type { VNodeChild } from 'vue';
import type { TextFieldProps } from '../text-field/text-field.types';
import type { FormattedInputProps } from './formatted-input.types';
import type { PickerInputProps } from './picker-trigger.types';

export interface RangePickerTriggerProps
  extends Omit<
    TextFieldProps,
    'active' | 'disabled' | 'placeholder' | 'readonly' | 'typing'
  > {
  /**
   * Whether the picker is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Error messages configuration for 'from' input
   */
  errorMessagesFrom?: FormattedInputProps['errorMessages'];
  /**
   * Error messages configuration for 'to' input
   */
  errorMessagesTo?: FormattedInputProps['errorMessages'];
  /**
   * The format pattern for the inputs (e.g., "YYYY-MM-DD")
   */
  format: string;
  /**
   * A pre-formatted date string to preview in the 'from' input when it is empty and not focused.
   */
  hoverFromValue?: string;
  /**
   * A pre-formatted date string to preview in the 'to' input when it is empty and not focused.
   */
  hoverToValue?: string;
  /**
   * Placeholder for the 'from' input element.
   */
  inputFromPlaceholder?: string;
  /**
   * Other input props you may provide to the 'from' input element.
   */
  inputFromProps?: PickerInputProps;
  /**
   * Value of the 'from' input element.
   */
  inputFromValue?: string;
  /**
   * Placeholder for the 'to' input element.
   */
  inputToPlaceholder?: string;
  /**
   * Other input props you may provide to the 'to' input element.
   */
  inputToProps?: PickerInputProps;
  /**
   * Value of the 'to' input element.
   */
  inputToValue?: string;
  /**
   * Whether the inputs are readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the inputs are required.
   * @default false
   */
  required?: boolean;
  /**
   * Custom suffix action icon element (e.g., calendar icon with click handler)
   */
  suffixActionIcon?: VNodeChild;
  /**
   * Custom validation function for 'from' input
   */
  validateFrom?: (isoDate: string) => boolean;
  /**
   * Custom validation function for 'to' input
   */
  validateTo?: (isoDate: string) => boolean;
}
