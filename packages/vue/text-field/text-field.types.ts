import type { TextFieldSize } from '@mezzanine-ui/core/text-field';

/**
 * Padding info handed to the default slot.
 */
export interface TextFieldPaddingInfo {
  /**
   * ClassName that applies the same padding as TextField's current size.
   * Use this when you want to move padding from TextField to input/textarea.
   */
  paddingClassName: string;
}

/**
 * Base props shared by all TextField variants
 */
export interface TextFieldBaseProps {
  /**
   * Whether the field is active (focused/opened/expanded).
   * @default false
   */
  active?: boolean;
  /**
   * Whether to show the clear button.
   * @default false
   */
  clearable?: boolean;
  /**
   * Whether the field is in error state.
   * @default false
   */
  error?: boolean;
  /**
   * Force clear button visibility logic to ignore input value check.
   * @default false
   */
  forceShowClearable?: boolean;
  /**
   * Whether the field should take the full width of its container.
   * @default true
   */
  fullWidth?: boolean;
  /**
   * Whether to hide the suffix when the clear button is visible.
   * @default false
   */
  hideSuffixWhenClearable?: boolean;
  /**
   * The size of field.
   * @default 'main'
   */
  size?: TextFieldSize;
  /**
   * Whether the field is in warning state.
   * @default false
   */
  warning?: boolean;
}

/**
 * Interactive state. `typing`, `disabled` and `readonly` are mutually
 * exclusive, and React expresses that as a discriminated union.
 *
 * Vue cannot: `defineProps` resolves a union whose members discriminate with
 * `never` down to `never` for the whole props object, whether it is written as
 * an intersection, a union of intersections, or interfaces extending a base —
 * all three were tried. The prop set, their types and the runtime behaviour are
 * unchanged; only the compile-time guarantee that the three cannot be combined
 * is lost, and combining them is already handled at runtime the same way React
 * handles it (`disabled` and `readonly` force `typing` to false).
 */
export interface TextFieldProps extends TextFieldBaseProps {
  /**
   * Whether the field is disabled.
   * Mutually exclusive with `readonly` and `typing`.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the field is readonly.
   * Mutually exclusive with `disabled` and `typing`.
   * @default false
   */
  readonly?: boolean;
  /**
   * Whether the user is currently typing.
   * If not provided, will be auto-detected.
   * Mutually exclusive with `disabled` and `readonly`.
   */
  typing?: boolean;
}
