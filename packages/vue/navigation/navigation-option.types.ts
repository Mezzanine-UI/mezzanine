import type { Component } from 'vue';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface NavigationOptionProps {
  /**
   * Whether the item is active.
   */
  active?: boolean;
  /**
   * Custom component to render, it should support `href` and `onClick` props if provided.
   */
  anchorComponent?: Component | string;
  /**
   * Open menu as default
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Href of the item.
   */
  href?: string;
  /**
   * Icon of the item.
   */
  icon?: IconDefinition;
  /**
   * Unique ID of the item.
   */
  id?: string;
  /**
   * Set display title for sub-menu item.
   */
  title: string;
}
