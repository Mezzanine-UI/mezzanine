import type { IconDefinition } from '@mezzanine-ui/icons';

export interface TabItemProps {
  /**
   * Whether the tab item is active.
   * Controlled by `<MznTab />`.
   */
  active?: boolean;
  /**
   * The badge count to display on the tab item.
   */
  badgeCount?: number;
  /**
   * Whether the tab item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the tab item is in error state.
   * @default false
   */
  error?: boolean;
  /**
   * The icon to display on the tab item.
   */
  icon?: IconDefinition;
}
