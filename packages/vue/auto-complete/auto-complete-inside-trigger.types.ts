import type { InputProps } from '../input/input.types';
import type { SelectTriggerInputProps } from '../select/select-trigger.types';

export interface AutoCompleteInsideTriggerProps {
  /**
   * Whether the trigger should render as active (focused/open).
   */
  active: boolean;
  /**
   * Whether to show the clear icon.
   */
  clearable: boolean;
  /**
   * Disabled state for the input.
   */
  disabled: boolean;
  /**
   * Error state for the input.
   */
  error: boolean;
  /**
   * Input placeholder text.
   */
  placeholder?: string;
  /**
   * Props forwarded to the underlying input element.
   */
  resolvedInputProps: SelectTriggerInputProps;
  /**
   * Input variant sizing.
   */
  size?: InputProps['size'];
  /**
   * Input display value (usually the current search text).
   */
  value: string;
}
