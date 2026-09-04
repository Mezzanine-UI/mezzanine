import type { InputSize } from '@mezzanine-ui/core/input';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface ActionButtonProps {
  /**
   * Whether the action button is disabled.
   */
  disabled?: boolean;
  /**
   * The icon of action button.
   * @default CopyIcon
   */
  icon?: IconDefinition;
  /**
   * The label of action button.
   * @default 'Copy'
   */
  label?: string;
  /**
   * The size of action button.
   * @default 'main'
   */
  size?: InputSize;
}
