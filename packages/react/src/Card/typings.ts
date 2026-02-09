import { ChangeEventHandler, JSXElementConstructor, ReactNode } from 'react';
import { IconDefinition } from '@mezzanine-ui/icons';
import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { ToggleSize } from '@mezzanine-ui/core/toggle';

/**
 * Allowed component types for BaseCard
 */
export type BaseCardComponent = 'div' | 'a' | JSXElementConstructor<any>;

/**
 * Action button variant options (limited to text-link variants)
 */
export type BaseCardActionVariant = 'base-text-link' | 'destructive-text-link';

/**
 * BaseCard type discriminator
 */
export type BaseCardType = 'default' | 'action' | 'overflow' | 'toggle';

/**
 * Common props shared across all BaseCard types
 */
export interface BaseCardPropsCommon {
  /**
   * Custom class name for the card
   */
  className?: string;
  /**
   * Content to render in the card content area
   */
  children?: ReactNode;
  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;
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
   * Card header description
   */
  description?: string;
}

/**
 * Props for BaseCard with type="default" (no action in header)
 */
export interface BaseCardDefaultProps extends BaseCardPropsCommon {
  type?: 'default';
  // Explicitly disallow action-related props
  actionName?: never;
  actionVariant?: never;
  onActionClick?: never;
  options?: never;
  onOptionSelect?: never;
  checked?: never;
  defaultChecked?: never;
  onToggleChange?: never;
  toggleSize?: never;
  toggleLabel?: never;
  toggleSupportingText?: never;
}

/**
 * Props for BaseCard with type="action" (Button in header action area)
 */
export interface BaseCardActionProps extends BaseCardPropsCommon {
  type: 'action';
  /**
   * Label text for the action button
   */
  actionName: string;
  /**
   * Variant for the action button (limited to text-link variants)
   * @default 'base-text-link'
   */
  actionVariant?: BaseCardActionVariant;
  /**
   * Click handler for the action button
   */
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // Explicitly disallow other type props
  options?: never;
  onOptionSelect?: never;
  checked?: never;
  defaultChecked?: never;
  onToggleChange?: never;
  toggleSize?: never;
  toggleLabel?: never;
  toggleSupportingText?: never;
}

/**
 * Props for BaseCard with type="overflow" (Dropdown in header action area)
 */
export interface BaseCardOverflowProps extends BaseCardPropsCommon {
  type: 'overflow';
  /**
   * Dropdown options
   */
  options: DropdownOption[];
  /**
   * Callback when an option is selected
   */
  onOptionSelect?: (option: DropdownOption) => void;
  // Explicitly disallow other type props
  actionName?: never;
  actionVariant?: never;
  onActionClick?: never;
  checked?: never;
  defaultChecked?: never;
  onToggleChange?: never;
  toggleSize?: never;
  toggleLabel?: never;
  toggleSupportingText?: never;
}

/**
 * Props for BaseCard with type="toggle" (Toggle in header action area)
 */
export interface BaseCardToggleProps extends BaseCardPropsCommon {
  type: 'toggle';
  /**
   * Whether the toggle is checked (controlled)
   */
  checked?: boolean;
  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;
  /**
   * Callback when toggle state changes
   */
  onToggleChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Size of the toggle
   */
  toggleSize?: ToggleSize;
  /**
   * Label for the toggle
   */
  toggleLabel?: string;
  /**
   * Supporting text for the toggle
   */
  toggleSupportingText?: string;
  // Explicitly disallow other type props
  actionName?: never;
  actionVariant?: never;
  onActionClick?: never;
  options?: never;
  onOptionSelect?: never;
}

/**
 * Union type for all BaseCard props variants
 */
export type BaseCardProps =
  | BaseCardDefaultProps
  | BaseCardActionProps
  | BaseCardOverflowProps
  | BaseCardToggleProps;

/**
 * Allowed component types for QuickActionCard
 */
export type QuickActionCardComponent =
  | 'button'
  | 'a'
  | JSXElementConstructor<any>;

/**
 * QuickActionCard layout mode
 */
export type QuickActionCardMode = 'horizontal' | 'vertical';

/**
 * Common props shared across all QuickActionCard variants
 */
export interface QuickActionCardPropsCommon {
  /**
   * Custom class name for the card
   */
  className?: string;
  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;
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
   * Layout mode
   * @default 'horizontal'
   */
  mode?: QuickActionCardMode;
}

/**
 * Props for QuickActionCard with icon only (no title)
 */
export interface QuickActionCardWithIconProps
  extends QuickActionCardPropsCommon {
  /**
   * Icon to display (required when no title)
   */
  icon: IconDefinition;
  /**
   * Card title (optional when icon is provided)
   */
  title?: string;
}

/**
 * Props for QuickActionCard with title only (no icon)
 */
export interface QuickActionCardWithTitleProps
  extends QuickActionCardPropsCommon {
  /**
   * Icon to display (optional when title is provided)
   */
  icon?: IconDefinition;
  /**
   * Card title (required when no icon)
   */
  title: string;
}

/**
 * Union type for QuickActionCard props - requires either icon or title (or both)
 */
export type QuickActionCardProps =
  | QuickActionCardWithIconProps
  | QuickActionCardWithTitleProps;
