import type { ButtonProps } from '../button/button.types';

export interface DropdownActionProps {
  /**
   * The text of the custom action button.
   */
  actionText?: string;
  /**
   * The text of the cancel button.
   */
  cancelText?: string;
  /**
   * The text of the clear button.
   */
  clearText?: string;
  /**
   * The text of the confirm button.
   */
  confirmText?: string;
  /**
   * The custom action button props of the dropdown.
   */
  customActionButtonProps?: ButtonProps;
  /**
   * Whether to show the actions.
   * @default false
   */
  showActions?: boolean;
  /**
   * If true, display a bar at the top of the dropdown action area.
   * @default false
   */
  showTopBar?: boolean;
}

/**
 * The action row described as data, the way `MznDropdownItem` takes it.
 *
 * React passes its `DropdownActionProps` — handlers included — straight into
 * `<DropdownAction {...actionConfig} />`. Vue's handlers are emits, so the
 * object form spells them the way `v-bind` hands a listener to a component.
 */
export type DropdownActionConfig = DropdownActionProps & {
  /** Click handler for cancel button. */
  onCancel?: () => void;
  /** Click handler for clear button. */
  onClear?: () => void;
  /** Click handler for custom action button. */
  onClick?: () => void;
  /** Click handler for confirm button. */
  onConfirm?: () => void;
};
