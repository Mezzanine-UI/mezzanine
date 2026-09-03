import type { IconDefinition } from '@mezzanine-ui/icons';
import type {
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import type { PopperPlacement } from '../popper/popper.types';

export interface ButtonProps {
  /**
   * If true, button will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, disable the tooltip for icon-only buttons.
   * Only applies when iconType is 'icon-only'.
   * @default false
   */
  disabledTooltip?: boolean;
  /**
   * The icon to display.
   */
  icon?: IconDefinition;
  /**
   * The type of the icon relative to the text.
   */
  iconType?: ButtonIconType;
  /**
   * If true, show loading state with spinner icon.
   * @default false
   */
  loading?: boolean;
  /**
   * The size of button.
   * @default 'main'
   */
  size?: ButtonSize;
  /**
   * The position of the tooltip.
   * Only applies when iconType is 'icon-only'.
   * @default 'bottom'
   */
  tooltipPosition?: PopperPlacement;
  /**
   * The variant of button.
   * @default 'base-primary'
   */
  variant?: ButtonVariant;
}
