import type { Component } from 'vue';
import type { IconDefinition } from '@mezzanine-ui/icons';

/**
 * What a quick action card may be rendered as. React's list, with Vue's
 * `Component` standing in for `JSXElementConstructor`.
 */
export type QuickActionCardComponent = 'a' | 'button' | Component;

/**
 * QuickActionCard layout mode
 */
export type QuickActionCardMode = 'horizontal' | 'vertical';

/**
 * React's two members — icon without title, or title without icon — flattened
 * into one interface. What is lost is the compile-time guarantee that at least
 * one of the two is given; the runtime behaviour is unchanged.
 *
 * `component` is not here for the same reason it is absent from React's
 * compared contract: it comes from the polymorphic factory, so it travels as
 * an attribute.
 */
export interface QuickActionCardProps {
  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Icon to display. Required when there is no title.
   */
  icon?: IconDefinition;
  /**
   * Layout mode
   * @default 'horizontal'
   */
  mode?: QuickActionCardMode;
  /**
   * Whether the card is read-only (non-interactive)
   * @default false
   */
  readOnly?: boolean;
  /**
   * Card subtitle (optional)
   */
  subtitle?: string;
  /**
   * Card title. Required when there is no icon.
   */
  title?: string;
}
