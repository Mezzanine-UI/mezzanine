import type { DropdownStatus } from '@mezzanine-ui/core/dropdown/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface DropdownStatusProps {
  /**
   * The icon of the dropdown empty status.
   */
  emptyIcon?: IconDefinition;
  /**
   * The text of the dropdown empty status.
   */
  emptyText?: string;
  /**
   * The text of the dropdown loading status.
   */
  loadingText?: string;
  /**
   * The status of the dropdown.
   * @default 'loading'
   */
  status: DropdownStatus;
}
