'use client';

import {
  dropdownClasses as classes
} from "@mezzanine-ui/core/dropdown/dropdown";
import { CloseIcon } from "@mezzanine-ui/icons";

import Button, { ButtonProps } from "../Button";

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
   * Click handler for cancel button.
   */
  onCancel?: () => void;
  /**
   * Click handler for clear button.
   */
  onClear?: () => void;
  /**
   * Click handler for confirm button.
   */
  onConfirm?: () => void;
  /**
   * Click handler for custom action button.
   */
  onClick?: () => void;
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

const actionButtonSize = 'minor';

export default function DropdownAction(props: DropdownActionProps) {
  const {
    showActions = false,
    showTopBar,
    customActionButtonProps,
    cancelText,
    confirmText,
    actionText,
    clearText,
    onCancel,
    onConfirm,
    onClick,
    onClear,
  } = props;

  const cancelLabel = cancelText || 'Cancel';
  const confirmLabel = confirmText || 'Confirm';
  const actionLabel = actionText || 'Custom Action';
  const clearLabel = clearText || 'Clear Options';

  const hasAnyEvent = Boolean(onCancel || onConfirm || onClick || onClear);
  const isClearMode = Boolean(onClear && !onClick);
  const isCustomMode = Boolean(onClick && !onClear);
  const isDefaultMode = !isClearMode && !isCustomMode;
  const hasCancel = Boolean(onCancel && isDefaultMode);
  const hasConfirm = Boolean(onConfirm && isDefaultMode);

  return (
    <>
      {
        showActions && hasAnyEvent && (
          <div className={classes.action}>
            {
              showTopBar && <i className={classes.actionTopBar} />
            }
            <div className={classes.actionTools}>
              {
                hasCancel && (
                  <Button
                    variant="base-ghost"
                    size={actionButtonSize}
                    onClick={onCancel}
                  >
                    {cancelLabel}
                  </Button>
                )
              }
              {
                hasConfirm && (
                  <Button
                    size={actionButtonSize}
                    style={hasCancel ? undefined : { marginLeft: 'auto' }}
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                )
              }
              {
                isCustomMode && (
                  <Button
                    size={actionButtonSize}
                    variant="base-ghost"
                    {...customActionButtonProps}
                    onClick={onClick}
                  >
                    {actionLabel}
                  </Button>
                )
              }
              {
                isClearMode && (
                  <Button
                    size={actionButtonSize}
                    variant="base-ghost"
                    icon={{
                      position: 'leading',
                      src: CloseIcon,
                    }}
                    onClick={onClear}
                  >
                    {clearLabel}
                  </Button>
                )
              }
            </div>
          </div>
        )
      }
    </>
  );
}