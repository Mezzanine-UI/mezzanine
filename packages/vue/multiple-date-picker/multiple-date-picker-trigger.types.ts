import type { DateType } from '@mezzanine-ui/core/calendar';
import type { TextFieldProps } from '../text-field/text-field.types';

export interface DateValue {
  date: DateType;
  id: string;
  name: string;
}

export interface MultipleDatePickerTriggerProps
  extends Omit<TextFieldProps, 'active' | 'disabled' | 'readonly' | 'typing'> {
  /**
   * Whether the panel is currently open (for styling)
   * @default false
   */
  active?: boolean;
  /**
   * Whether the trigger is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Overflow strategy for tags display
   * @default 'counter'
   */
  overflowStrategy?: 'counter' | 'wrap';
  /**
   * Placeholder text when no dates are selected
   */
  placeholder?: string;
  /**
   * Whether the trigger is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * The selected date values for display
   */
  value?: DateValue[];
}
