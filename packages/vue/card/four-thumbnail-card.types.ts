import type { Component } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';

/**
 * What a four thumbnail card may be rendered as. React's list, with Vue's
 * `Component` standing in for `JSXElementConstructor`.
 */
export type FourThumbnailCardComponent = 'a' | 'div' | Component;

/**
 * FourThumbnailCard type discriminator
 */
export type FourThumbnailCardType = 'action' | 'default' | 'overflow';

/**
 * React's three members — one per `type`, each forbidding the other types'
 * props with `never` — flattened into one interface, since `defineProps`
 * resolves a union discriminated on a literal into something unusable.
 *
 * `component` is not here for the same reason it is absent from React's
 * compared contract: it comes from the polymorphic factory, so it travels as
 * an attribute.
 */
export interface FourThumbnailCardProps {
  /**
   * Label text for the action button. Only used by `type="action"`.
   */
  actionName?: string;
  /**
   * File extension string for the filetype icon (e.g., 'pdf', 'jpg', 'zip')
   * Used to determine the filetype badge color
   */
  filetype?: string;
  /**
   * Dropdown options. Only used by `type="overflow"`.
   */
  options?: DropdownOption[];
  /**
   * Whether the personal action is in active state
   * @default false
   */
  personalActionActive?: boolean;
  /**
   * Icon shown when personal action is active
   */
  personalActionActiveIcon?: IconDefinition;
  /**
   * Icon for the personal action button (e.g., favorite, bookmark)
   */
  personalActionIcon?: IconDefinition;
  /**
   * Click handler for the personal action button.
   *
   * A prop rather than an emit because React's name does not start with `on`,
   * so the contract counts it as an input on both sides.
   */
  personalActionOnClick?: (event: MouseEvent, active: boolean) => void;
  /**
   * Subtitle text shown in the info section
   */
  subtitle?: string;
  /**
   * Optional tag label shown on top of the thumbnail grid
   */
  tag?: string;
  /**
   * Title text shown in the info section
   */
  title: string;
  /**
   * Which action the info section renders.
   * @default 'default'
   */
  type?: FourThumbnailCardType;
}
