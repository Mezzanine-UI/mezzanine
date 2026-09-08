import type { Component } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { ToggleSize } from '@mezzanine-ui/core/toggle';

/**
 * What a base card may be rendered as. React's list, with Vue's `Component`
 * standing in for `JSXElementConstructor`.
 */
export type BaseCardComponent = 'a' | 'div' | Component;

/**
 * Action button variant options (limited to text-link variants)
 */
export type BaseCardActionVariant = 'base-text-link' | 'destructive-text-link';

/**
 * BaseCard type discriminator
 */
export type BaseCardType = 'action' | 'default' | 'overflow' | 'toggle';

/**
 * React's four members — one per `type`, each forbidding the other types'
 * props with `never` — flattened into one interface, since `defineProps`
 * resolves a union discriminated on a literal into something unusable. The
 * names, the types and the runtime behaviour are unchanged; what is lost is
 * the compile-time guarantee that a `toggle` card cannot also carry
 * `actionName`.
 *
 * `component` is not here for the same reason it is absent from React's
 * compared contract: it comes from the polymorphic factory rather than from
 * `BaseCardProps`, so it travels as an attribute.
 */
export interface BaseCardProps {
  /**
   * Label text for the action button. Only used by `type="action"`.
   */
  actionName?: string;
  /**
   * Variant for the action button (limited to text-link variants).
   * @default 'base-text-link'
   */
  actionVariant?: BaseCardActionVariant;
  /**
   * Whether the toggle is checked (controlled). Only used by `type="toggle"`.
   */
  checked?: boolean;
  /**
   * Default checked state (uncontrolled). Only used by `type="toggle"`.
   */
  defaultChecked?: boolean;
  /**
   * Card header description
   */
  description?: string;
  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Dropdown options. Only used by `type="overflow"`.
   */
  options?: DropdownOption[];
  /**
   * Whether the card is read-only (non-interactive)
   * @default false
   */
  readOnly?: boolean;
  /**
   * Card header title
   */
  title?: string;
  /**
   * Label for the toggle. Only used by `type="toggle"`.
   */
  toggleLabel?: string;
  /**
   * Size of the toggle. Only used by `type="toggle"`.
   */
  toggleSize?: ToggleSize;
  /**
   * Supporting text for the toggle. Only used by `type="toggle"`.
   */
  toggleSupportingText?: string;
  /**
   * Which header action the card renders.
   * @default 'default'
   */
  type?: BaseCardType;
}
