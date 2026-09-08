import type { DropdownProps } from '../dropdown/dropdown.types';
import type { PopperPlacement } from '../popper/popper.types';

export interface NavigationUserMenuProps extends Omit<DropdownProps, 'type'> {
  /**
   * Accessible name for the trigger button.
   * Defaults to the content when that is plain text — the user name is hidden
   * while the navigation is collapsed, which would otherwise leave the button
   * with only an avatar and no accessible name.
   */
  'aria-label'?: string;
  /**
   * Where the menu opens while the navigation is collapsed.
   * @default 'right-end'
   */
  collapsedPlacement?: PopperPlacement;
  /**
   * The avatar image; a user icon stands in when it is missing or fails.
   */
  imgSrc?: string;
}
