import {
  ChangeEventHandler,
  JSXElementConstructor,
  MouseEvent,
  ReactNode,
} from 'react';
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

/**
 * SingleThumbnailCard type discriminator
 */
export type SingleThumbnailCardType = 'default' | 'action' | 'overflow';

/**
 * Allowed component types for SingleThumbnailCard
 */
export type SingleThumbnailCardComponent =
  | 'div'
  | 'a'
  | JSXElementConstructor<any>;

/**
 * Common props shared across all SingleThumbnailCard types
 */
export interface SingleThumbnailCardPropsCommon {
  /**
   * Custom class name for the card
   */
  className?: string;
  /**
   * Single image element (img, Next.js Image, etc.)
   * Must be exactly one child element
   */
  children: ReactNode;
  /**
   * File extension string for the filetype icon (e.g., 'pdf', 'jpg', 'zip')
   * Used to determine the filetype badge color
   */
  filetype?: string;
  /**
   * Icon for the personal action button (e.g., favorite, bookmark)
   */
  personalActionIcon?: IconDefinition;
  /**
   * Icon shown when personal action is active
   */
  personalActionActiveIcon?: IconDefinition;
  /**
   * Whether the personal action is in active state
   */
  personalActionActive?: boolean;
  /**
   * Click handler for the personal action button
   */
  personalActionOnClick?: (
    event: MouseEvent<HTMLButtonElement>,
    active: boolean,
  ) => void;
  /**
   * Subtitle text shown in the info section
   */
  subtitle?: string;
  /**
   * Optional tag label shown on top of the thumbnail
   */
  tag?: string;
  /**
   * Title text shown in the info section
   */
  title: string;
}

/**
 * Props for SingleThumbnailCard with type="default" (no action in info)
 */
export interface SingleThumbnailCardDefaultProps
  extends SingleThumbnailCardPropsCommon {
  type?: 'default';
  // Explicitly disallow action-related props
  actionName?: never;
  onActionClick?: never;
  onOptionSelect?: never;
  options?: never;
}

/**
 * Props for SingleThumbnailCard with type="action" (Button in info action area)
 */
export interface SingleThumbnailCardActionProps
  extends SingleThumbnailCardPropsCommon {
  type: 'action';
  /**
   * Label text for the action button
   */
  actionName: string;
  /**
   * Click handler for the action button
   */
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  // Explicitly disallow other type props
  onOptionSelect?: never;
  options?: never;
}

/**
 * Props for SingleThumbnailCard with type="overflow" (Dropdown in info action area)
 */
export interface SingleThumbnailCardOverflowProps
  extends SingleThumbnailCardPropsCommon {
  type: 'overflow';
  /**
   * Callback when an option is selected
   */
  onOptionSelect?: (option: DropdownOption) => void;
  /**
   * Dropdown options
   */
  options: DropdownOption[];
  // Explicitly disallow other type props
  actionName?: never;
  onActionClick?: never;
}

/**
 * Union type for all SingleThumbnailCard props variants
 */
export type SingleThumbnailCardProps =
  | SingleThumbnailCardActionProps
  | SingleThumbnailCardDefaultProps
  | SingleThumbnailCardOverflowProps;

/**
 * Allowed component types for Thumbnail (child of FourThumbnailCard)
 */
export type ThumbnailComponent =
  | 'a'
  | 'button'
  | 'div'
  | JSXElementConstructor<any>;

/**
 * Base props for Thumbnail component
 */
export interface ThumbnailPropsBase {
  /**
   * Custom class name for the thumbnail
   */
  className?: string;
  /**
   * Image element (img, Next.js Image, etc.)
   */
  children: ReactNode;
  /**
   * Title text shown on hover overlay
   */
  title?: string;
}

/**
 * FourThumbnailCard type discriminator
 */
export type FourThumbnailCardType = 'default' | 'action' | 'overflow';

/**
 * Allowed component types for FourThumbnailCard
 */
export type FourThumbnailCardComponent =
  | 'div'
  | 'a'
  | JSXElementConstructor<any>;

/**
 * Common props shared across all FourThumbnailCard types
 */
export interface FourThumbnailCardPropsCommon {
  /**
   * Custom class name for the card
   */
  className?: string;
  /**
   * Thumbnail elements (1-4 Thumbnail components)
   * If less than 4, empty slots will be rendered
   */
  children: ReactNode;
  /**
   * File extension string for the filetype icon (e.g., 'pdf', 'jpg', 'zip')
   * Used to determine the filetype badge color
   */
  filetype?: string;
  /**
   * Icon for the personal action button (e.g., favorite, bookmark)
   */
  personalActionIcon?: IconDefinition;
  /**
   * Icon shown when personal action is active
   */
  personalActionActiveIcon?: IconDefinition;
  /**
   * Whether the personal action is in active state
   */
  personalActionActive?: boolean;
  /**
   * Click handler for the personal action button
   */
  personalActionOnClick?: (
    event: MouseEvent<HTMLButtonElement>,
    active: boolean,
  ) => void;
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
}

/**
 * Props for FourThumbnailCard with type="default" (no action in info)
 */
export interface FourThumbnailCardDefaultProps
  extends FourThumbnailCardPropsCommon {
  type?: 'default';
  // Explicitly disallow action-related props
  actionName?: never;
  onActionClick?: never;
  onOptionSelect?: never;
  options?: never;
}

/**
 * Props for FourThumbnailCard with type="action" (Button in info action area)
 */
export interface FourThumbnailCardActionProps
  extends FourThumbnailCardPropsCommon {
  type: 'action';
  /**
   * Label text for the action button
   */
  actionName: string;
  /**
   * Click handler for the action button
   */
  onActionClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  // Explicitly disallow other type props
  onOptionSelect?: never;
  options?: never;
}

/**
 * Props for FourThumbnailCard with type="overflow" (Dropdown in info action area)
 */
export interface FourThumbnailCardOverflowProps
  extends FourThumbnailCardPropsCommon {
  type: 'overflow';
  /**
   * Callback when an option is selected
   */
  onOptionSelect?: (option: DropdownOption) => void;
  /**
   * Dropdown options
   */
  options: DropdownOption[];
  // Explicitly disallow other type props
  actionName?: never;
  onActionClick?: never;
}

/**
 * Union type for all FourThumbnailCard props variants
 */
export type FourThumbnailCardProps =
  | FourThumbnailCardActionProps
  | FourThumbnailCardDefaultProps
  | FourThumbnailCardOverflowProps;
