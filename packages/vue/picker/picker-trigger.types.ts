import type { InputHTMLAttributes } from 'vue';
import type { TextFieldProps } from '../text-field/text-field.types';
import type { FormattedInputProps } from './formatted-input.types';

/**
 * The input props a picker trigger forwards, minus everything it drives
 * itself. Mirrors React's omit list from `NativeElementPropsWithoutKeyAndRef<'input'>`.
 */
export type PickerInputProps = Omit<
  InputHTMLAttributes,
  | 'defaultValue'
  | 'disabled'
  | 'onChange'
  | 'placeholder'
  | 'readOnly'
  | 'required'
  | 'value'
  | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
>;

export interface PickerTriggerProps
  extends Omit<TextFieldProps, 'active' | 'disabled' | 'readonly' | 'typing'>,
    Pick<
      FormattedInputProps,
      'errorMessages' | 'hoverValue' | 'validate' | 'format'
    > {
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Other input props you may provide to input element.
   */
  inputProps?: PickerInputProps;
  /**
   * Placeholder for the input element.
   */
  placeholder?: string;
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
   * The value of the input element.
   */
  value?: string;
}
