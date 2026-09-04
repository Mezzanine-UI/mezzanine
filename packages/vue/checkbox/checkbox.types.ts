import type { InputHTMLAttributes } from 'vue';
import type { CheckboxMode, CheckboxSize } from '@mezzanine-ui/core/checkbox';
import type { BaseInputProps } from '../input/input.types';

/**
 * The editable input described as data, the way `MznCheckbox` takes it.
 *
 * React's `editableInput` is `Omit<BaseInputProps, 'variant'>`, and React's
 * input props carry `onChange`. Vue's `change` is an emit, so — as
 * `DropdownActionConfig` does — the handler is spelled the way `v-bind` hands
 * a listener to a component.
 */
export type CheckboxEditableInput = Omit<BaseInputProps, 'variant'> & {
  /** Change handler for the editable input. */
  onChange?: (event: Event) => void;
};

export interface CheckboxPropsBase {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;
  /**
   * Whether the checkbox is checked by default.
   * Only used for uncontrolled.
   */
  defaultChecked?: boolean;
  /**
   * The description text displayed below the label.
   */
  description?: string;
  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the checkbox is in indeterminate state.
   * @default false
   */
  indeterminate?: boolean;
  /**
   * The label text displayed beside the checkbox.
   */
  label?: string;
  /**
   * The mode of checkbox.
   * @default 'main'
   */
  mode?: CheckboxMode;
  /**
   * Visual severity: `info` for hint state, `error` for error state.
   */
  severity?: 'info' | 'error';
}

/**
 * The input props a checkbox forwards, minus everything it drives itself.
 */
export type CheckboxInputElementProps = Omit<
  InputHTMLAttributes,
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'onChange'
  | 'placeholder'
  | 'type'
  | 'value'
  | `aria-${'disabled' | 'checked'}`
> & {
  /**
   * The id attribute can be provided via inputProps, but it's recommended to use the `id` prop directly.
   * If both are provided, the `id` prop takes precedence.
   */
  id?: string;
  /**
   * The name attribute can be provided via inputProps, but it's recommended to use the `name` prop directly.
   * If both are provided, the `name` prop takes precedence.
   */
  name?: string;
};

export interface CheckboxProps extends CheckboxPropsBase {
  /**
   * Configuration for editable input that appears when checkbox is checked.
   * When `withEditInput` is `true` and this prop is not provided, default values will be used.
   *
   * Default values when not provided:
   * - `name`: `{checkboxName}_input` or `{checkboxId}_input`
   * - `id`: `{checkboxId}_input`
   * - `placeholder`: "Please enter..."
   */
  editableInput?: CheckboxEditableInput;
  /**
   * The id of input element.
   */
  id?: string;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: CheckboxInputElementProps;
  /**
   * The name attribute of the input element.
   */
  name?: string;
  /**
   * The size of checkbox.
   * When mode is 'chip', size can be 'main' | 'sub' | 'minor'.
   * When mode is 'default', size can be 'main' | 'sub'.
   * @default 'main'
   */
  size?: CheckboxSize<NonNullable<CheckboxPropsBase['mode']>>;
  /**
   * The value of checkbox. Used when checkbox is inside a CheckboxGroup.
   */
  value?: string;
  /**
   * Whether to show an editable input when checkbox is checked.
   * When `true`, an Input component will be displayed after the checkbox when checked.
   * If `editableInput` is not provided, default values will be used (name, id, placeholder).
   */
  withEditInput?: boolean;
}
