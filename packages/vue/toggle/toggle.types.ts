import type { InputHTMLAttributes } from 'vue';
import type { ToggleSize } from '@mezzanine-ui/core/toggle';

/**
 * `defaultChecked` has no counterpart in Vue's `InputHTMLAttributes`, so
 * React's omit list is reproduced here without it; everything else it hides
 * from `inputProps` — the props this component owns — is hidden the same way.
 */
export interface ToggleProps {
  /**
   * Whether the toggle is checked.
   */
  checked?: boolean;
  /**
   * Whether the toggle is checked by default.
   * Only used for uncontrolled.
   */
  defaultChecked?: boolean;
  /**
   * Whether the toggle is disabled.
   * Inherited from the surrounding form control when not provided.
   * @default false
   */
  disabled?: boolean;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: Omit<
    InputHTMLAttributes,
    | 'aria-checked'
    | 'aria-disabled'
    | 'checked'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'type'
    | 'value'
  >;
  /**
   * The label text displayed beside the toggle.
   */
  label?: string;
  /**
   * The size of toggle.
   * @default 'main'
   */
  size?: ToggleSize;
  /**
   * Supporting text displayed below the label.
   */
  supportingText?: string;
}
