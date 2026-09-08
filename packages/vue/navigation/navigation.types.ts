import type { Component } from 'vue';

export interface NavigationProps {
  /**
   * Current active key.
   */
  activatedPath?: string[];
  /**
   * Navigation display type.
   * @default false (expanded)
   */
  collapsed?: boolean;
  /**
   * When true, href must match the current pathname exactly to be activated.
   * When false (default), any href that is a prefix of the current pathname will be activated.
   * @default false
   */
  exactActivatedMatch?: boolean;
  /**
   * Whether to show search input
   */
  filter?: boolean;
  /**
   * Custom component for rendering navigation options which have an href prop.
   */
  optionsAnchorComponent?: Component | string;
}
