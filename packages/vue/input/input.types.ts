import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { InputHTMLAttributes } from 'vue';
import type { PopperPlacement } from '../popper/popper.types';
import type { TextFieldProps } from '../text-field/text-field.types';
import type { ActionButtonProps } from './action-button.types';
import type { PasswordStrengthIndicatorProps } from './password-strength-indicator.types';
import type { SelectButtonProps } from './select-button.types';

/**
 * Base props shared by all Input variants
 */
export interface InputBaseProps extends Omit<TextFieldProps, 'clearable'> {
  /**
   * The default value of input.
   */
  defaultValue?: string;
  /**
   * Formatter function to transform the value for display.
   * Common use cases: measure formatting (1000 → "1,000"), phone numbers, etc.
   * Default to formatting number with commas for "measure" variant.
   */
  formatter?: (value: string) => string;
  /**
   * The id of input element.
   */
  id?: string;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
    InputHTMLAttributes,
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'value'
    | 'type'
    | 'id'
    | 'name'
    | `aria-${'disabled' | 'multiline' | 'readonly'}`
  >;
  /**
   * The input type of input element.
   * @default 'text'
   */
  inputType?: string;
  /**
   * The name of input element.
   */
  name?: string;
  /**
   * Parser function to extract the raw value from formatted display value.
   * Should reverse the formatter transformation.
   * Default to removing commas for "measure" formatting.
   */
  parser?: (value: string) => string;
  /**
   * The placeholder of input.
   */
  placeholder?: string;
  /**
   * The value of input.
   */
  value?: string;
}

/**
 * The eight variants React expresses as a discriminated union, flattened into
 * one interface.
 *
 * Vue's `defineProps` resolves a union whose members discriminate on a literal
 * down to something unusable — the same limitation TextField's props document —
 * so every variant's props live here as optional. The prop names, their types
 * and the runtime behaviour are unchanged; what is lost is the compile-time
 * guarantee that, say, `showSpinner` cannot be passed to a `password` input.
 */
export interface InputProps extends InputBaseProps {
  /**
   * The action button props. Only used by `variant="action"`.
   */
  actionButton?: ActionButtonProps & {
    position: 'prefix' | 'suffix';
  };
  /**
   * Whether to show the clear button.
   * @default false
   */
  clearable?: boolean;
  /**
   * The max height of the dropdown. Only used by `variant="select"`.
   */
  dropdownMaxHeight?: number | string;
  /**
   * The placement of the dropdown. Only used by `variant="select"`.
   */
  dropdownPlacement?: PopperPlacement;
  /**
   * The width of the dropdown. Only used by `variant="select"`.
   */
  dropdownWidth?: number | string;
  /**
   * The maximum value. Only used by the numeric variants.
   */
  max?: number;
  /**
   * The minimum value. Only used by the numeric variants.
   */
  min?: number;
  /**
   * The options of the dropdown. Only used by `variant="select"`.
   */
  options?: DropdownOption[];
  /**
   * The props for password strength indicator.
   * Only used by `variant="password"` with `showPasswordStrengthIndicator`.
   */
  passwordStrengthIndicator?: PasswordStrengthIndicatorProps;
  /**
   * The select button props. Only used by `variant="select"`.
   */
  selectButton?: SelectButtonProps & {
    position: 'prefix' | 'suffix' | 'both';
  };
  /**
   * The selected value of the dropdown. Only used by `variant="select"`.
   */
  selectedValue?: string;
  /**
   * Whether to show password strength indicator.
   * Only used by `variant="password"`.
   */
  showPasswordStrengthIndicator?: boolean;
  /**
   * Whether to show spinner buttons.
   * Only used by `variant="measure"`.
   * @default false
   */
  showSpinner?: boolean;
  /**
   * The step value. Only used by the numeric variants.
   * @default 1
   */
  step?: number;
  /**
   * The type of input.
   * @default 'base'
   */
  variant?:
    | 'action'
    | 'affix'
    | 'base'
    | 'measure'
    | 'number'
    | 'password'
    | 'search'
    | 'select';
}

/** The props a `variant="base"` input accepts. */
export type BaseInputProps = InputProps;
