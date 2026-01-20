import { forwardRef, ReactNode } from 'react';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Button, { ButtonProps } from '../Button/Button';
import ButtonGroup from '../Button/ButtonGroup';
import Checkbox from '../Checkbox/Checkbox';
import Toggle from '../Toggle/Toggle';
import Typography from '../Typography';

export interface ModalFooterProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Layout of action buttons.
   * - 'fixed': Buttons maintain fixed width
   * - 'fill': Buttons expand to fill available space equally
   * @default 'fixed'
   */
  actionsButtonLayout?: 'fill' | 'fixed';
  /**
   * Text to display as annotation on the left side.
   * Only used when auxiliaryContentType is 'annotation'.
   */
  annotation?: ReactNode;
  /**
   * Props for the auxiliary content button.
   * Only used when auxiliaryContentType is 'button'.
   */
  auxiliaryContentButtonProps?: ButtonProps;
  /**
   * Text for the auxiliary content button.
   * Only used when auxiliaryContentType is 'button'.
   */
  auxiliaryContentButtonText?: ReactNode;
  /**
   * Whether the auxiliary content control (checkbox/toggle) is checked.
   * Only used when auxiliaryContentType is 'checkbox' or 'toggle'.
   */
  auxiliaryContentChecked?: boolean;
  /**
   * Label text for the auxiliary content control (checkbox/toggle).
   * Only used when auxiliaryContentType is 'checkbox' or 'toggle'.
   */
  auxiliaryContentLabel?: string;
  /**
   * Change handler for auxiliary content control (checkbox/toggle).
   * Only used when auxiliaryContentType is 'checkbox' or 'toggle'.
   */
  auxiliaryContentOnChange?: (checked: boolean) => void;
  /**
   * Click handler for the auxiliary content button.
   * Only used when auxiliaryContentType is 'button'.
   */
  auxiliaryContentOnClick?: ButtonProps['onClick'];
  /**
   * Type of auxiliary content to show on the left side of the footer.
   * - 'annotation': Display text annotation
   * - 'button': Display a button
   * - 'checkbox': Display a checkbox control
   * - 'toggle': Display a toggle control
   * - 'password': Display password-specific controls (remember me + forgot password)
   * @default undefined (no auxiliary content)
   */
  auxiliaryContentType?:
    | 'annotation'
    | 'button'
    | 'checkbox'
    | 'toggle'
    | 'password';
  /**
   * Additional props for the cancel button.
   */
  cancelButtonProps?: ButtonProps;
  /**
   * Text content of the cancel button.
   */
  cancelText?: ReactNode;
  /**
   * Additional props for the confirm button.
   */
  confirmButtonProps?: ButtonProps;
  /**
   * Text content of the confirm button.
   */
  confirmText?: ReactNode;
  /**
   * Whether confirm button is loading and cancel button is disabled.
   */
  loading?: boolean;
  /**
   * Click handler for the cancel button.
   */
  onCancel?: ButtonProps['onClick'];
  /**
   * Click handler for the confirm button.
   */
  onConfirm?: ButtonProps['onClick'];
  /**
   * Props for the password auxiliary button.
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordButtonProps?: ButtonProps;
  /**
   * Text for the password auxiliary button (e.g., "Forgot password?").
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordButtonText?: ReactNode;
  /**
   * Whether the password checkbox is checked (e.g., "Remember me").
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordChecked?: boolean;
  /**
   * Label for the password checkbox (e.g., "Remember me").
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordCheckedLabel?: string;
  /**
   * Change handler for the password checkbox.
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordCheckedOnChange?: (checked: boolean) => void;
  /**
   * Click handler for the password auxiliary button.
   * Only used when auxiliaryContentType is 'password'.
   */
  passwordOnClick?: ButtonProps['onClick'];
  /**
   * Whether to show the cancel button.
   * @default true
   */
  showCancelButton?: boolean;
}

/**
 * The react component for `mezzanine` modal footer.
 */
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter(props, ref) {
    const {
      children,
      className,
      actionsButtonLayout = 'fixed',
      annotation,
      auxiliaryContentButtonProps,
      auxiliaryContentButtonText,
      auxiliaryContentChecked,
      auxiliaryContentLabel,
      auxiliaryContentOnChange,
      auxiliaryContentOnClick,
      auxiliaryContentType,
      cancelButtonProps,
      cancelText,
      confirmButtonProps,
      confirmText,
      loading,
      onCancel,
      onConfirm,
      passwordButtonProps,
      passwordButtonText,
      passwordChecked,
      passwordCheckedLabel,
      passwordCheckedOnChange,
      passwordOnClick,
      showCancelButton = true,
      ...rest
    } = props;

    const { disabled: cancelButtonDisabled = loading } =
      cancelButtonProps || {};

    const isActionsButtonFillLayout =
      actionsButtonLayout === 'fill' && !auxiliaryContentType;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.modalFooter,
          {
            [classes.modalFooter + '--password-mode']:
              auxiliaryContentType === 'password',
            [classes.modalFooter + '--with-auxiliary-content']:
              !!auxiliaryContentType && auxiliaryContentType !== 'password',
          },
          className,
        )}
      >
        {auxiliaryContentType === 'password' && (
          <div className={classes.modalFooterPasswordContainer}>
            <Checkbox
              checked={passwordChecked}
              label={passwordCheckedLabel}
              onChange={(e) => passwordCheckedOnChange?.(e.target.checked)}
            />
            <Button
              variant="base-text-link"
              {...passwordButtonProps}
              onClick={passwordOnClick}
            >
              {passwordButtonText}
            </Button>
          </div>
        )}
        {auxiliaryContentType && auxiliaryContentType !== 'password' && (
          <div className={classes.modalFooterAuxiliaryContentContainer}>
            {auxiliaryContentType === 'annotation' && (
              <Typography variant="caption" color="text-neutral">
                {annotation}
              </Typography>
            )}
            {auxiliaryContentType === 'button' && (
              <Button
                variant="base-text-link"
                {...auxiliaryContentButtonProps}
                onClick={auxiliaryContentOnClick}
              >
                {auxiliaryContentButtonText}
              </Button>
            )}
            {auxiliaryContentType === 'checkbox' && (
              <Checkbox
                checked={auxiliaryContentChecked}
                label={auxiliaryContentLabel}
                onChange={(e) => auxiliaryContentOnChange?.(e.target.checked)}
              />
            )}
            {auxiliaryContentType === 'toggle' && (
              <Toggle
                checked={auxiliaryContentChecked}
                label={auxiliaryContentLabel}
                onChange={(e) => auxiliaryContentOnChange?.(e.target.checked)}
              />
            )}
          </div>
        )}
        <ButtonGroup
          className={cx(classes.modalFooterActionsButtonContainer, {
            [classes.modalFooterActionsButtonContainer + '--fill-layout']:
              isActionsButtonFillLayout,
          })}
        >
          {showCancelButton && (
            <Button
              variant="base-secondary"
              {...cancelButtonProps}
              disabled={cancelButtonDisabled}
              onClick={onCancel}
              className={classes.modalFooterActionsButton}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="base-primary"
            {...confirmButtonProps}
            loading={loading}
            onClick={onConfirm}
            className={classes.modalFooterActionsButton}
          >
            {confirmText}
          </Button>
        </ButtonGroup>
        {children}
      </div>
    );
  },
);

export default ModalFooter;
