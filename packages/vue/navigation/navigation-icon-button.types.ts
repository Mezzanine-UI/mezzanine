import type { IconDefinition } from '@mezzanine-ui/icons';

export interface NavigationIconButtonProps {
  /**
   * Accessible name for the button.
   *
   * This component renders an icon and nothing else — it takes no content — so
   * there is no visible text for assistive technology to fall back on. Without
   * `aria-label` the button has no accessible name at all and axe reports a
   * critical `button-name`.
   */
  'aria-label'?: string;
  /**
   * Whether the button is in an active state.
   */
  active?: boolean;
  /**
   * The icon to be displayed.
   */
  icon: IconDefinition;
}
