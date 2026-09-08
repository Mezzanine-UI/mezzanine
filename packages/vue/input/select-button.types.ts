import type { InputSize } from '@mezzanine-ui/core/input';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import type { PopperPlacement } from '../popper/popper.types';

export interface SelectButtonProps {
  /**
   * Whether clicking an option should automatically close the dropdown.
   * @default true
   */
  closeOnSelect?: boolean;
  /**
   * Whether the select button is disabled.
   */
  disabled?: boolean;
  /**
   * The max height of the dropdown.
   */
  dropdownMaxHeight?: number | string;
  /**
   * The placement of the dropdown.
   */
  dropdownPlacement?: PopperPlacement;
  /**
   * The custom width of the dropdown.
   */
  dropdownWidth?: number | string;
  /**
   * The options of the dropdown.
   */
  options?: DropdownOption[];
  /**
   * The size of select button.
   * @default 'main'
   */
  size?: InputSize;
  /**
   * The value of select button.
   */
  value?: string;
}
