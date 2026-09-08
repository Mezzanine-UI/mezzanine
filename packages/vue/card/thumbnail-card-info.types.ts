import type { DropdownOption } from '@mezzanine-ui/core/dropdown';

/**
 * Which action the info section renders.
 */
export type ThumbnailCardInfoType = 'action' | 'default' | 'overflow';

export interface ThumbnailCardInfoProps {
  /**
   * Label text for the action button (when type="action")
   */
  actionName?: string;
  /**
   * Whether the action is disabled
   */
  disabled?: boolean;
  /**
   * File extension string for the filetype icon (e.g., 'pdf', 'jpg', 'zip')
   */
  filetype?: string;
  /**
   * Dropdown options (when type="overflow")
   */
  options?: DropdownOption[];
  /**
   * Subtitle text shown in the info section
   */
  subtitle?: string;
  /**
   * Title text shown in the info section
   */
  title?: string;
  /**
   * Which action the info section renders.
   * @default 'default'
   */
  type?: ThumbnailCardInfoType;
}
