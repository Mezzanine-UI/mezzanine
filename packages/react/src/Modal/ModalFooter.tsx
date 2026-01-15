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
  modalFooterActionsButtonLayout?: 'fill' | 'fixed';
  /**
   * Text to display as annotation on the left side.
   * Only used when modalFooterAuxiliaryContentType is 'annotation'.
   */
  modalFooterAnnotation?: ReactNode;
  /**
   * Props for the auxiliary content button.
   * Only used when modalFooterAuxiliaryContentType is 'button'.
   */
  modalFooterAuxiliaryContentButtonProps?: ButtonProps;
  /**
   * Text for the auxiliary content button.
   * Only used when modalFooterAuxiliaryContentType is 'button'.
   */
  modalFooterAuxiliaryContentButtonText?: ReactNode;
  /**
   * Whether the auxiliary content control (checkbox/toggle) is checked.
   * Only used when modalFooterAuxiliaryContentType is 'checkbox' or 'toggle'.
   */
  modalFooterAuxiliaryContentChecked?: boolean;
  /**
   * Label text for the auxiliary content control (checkbox/toggle).
   * Only used when modalFooterAuxiliaryContentType is 'checkbox' or 'toggle'.
   */
  modalFooterAuxiliaryContentLabel?: string;
  /**
   * Change handler for auxiliary content control (checkbox/toggle).
   * Only used when modalFooterAuxiliaryContentType is 'checkbox' or 'toggle'.
   */
  modalFooterAuxiliaryContentOnChange?: (checked: boolean) => void;
  /**
   * Click handler for the auxiliary content button.
   * Only used when modalFooterAuxiliaryContentType is 'button'.
   */
  modalFooterAuxiliaryContentOnClick?: ButtonProps['onClick'];
  /**
   * Type of auxiliary content to show on the left side of the footer.
   * - 'annotation': Display text annotation
   * - 'button': Display a button
   * - 'checkbox': Display a checkbox control
   * - 'toggle': Display a toggle control
   * - 'password': Display password-specific controls (remember me + forgot password)
   * @default undefined (no auxiliary content)
   */
  modalFooterAuxiliaryContentType?: 'annotation' | 'button' | 'checkbox' | 'toggle' | 'password';
  /**
   * Additional props for the cancel button.
   */
  modalFooterCancelButtonProps?: ButtonProps;
  /**
   * Text content of the cancel button.
   */
  modalFooterCancelText?: ReactNode;
  /**
   * Additional props for the confirm button.
   */
  modalFooterConfirmButtonProps?: ButtonProps;
  /**
   * Text content of the confirm button.
   */
  modalFooterConfirmText?: ReactNode;
  /**
   * Whether confirm button is loading and cancel button is disabled.
   */
  modalFooterLoading?: boolean;
  /**
   * Click handler for the cancel button.
   */
  modalFooterOnCancel?: ButtonProps['onClick'];
  /**
   * Click handler for the confirm button.
   */
  modalFooterOnConfirm?: ButtonProps['onClick'];
  /**
   * Props for the password auxiliary button.
   * Only used when modalFooterAuxiliaryContentType is 'password'.
   */
  modalFooterPasswordButtonProps?: ButtonProps;
  /**
   * Text for the password auxiliary button (e.g., "Forgot password?").
   * Only used when modalFooterAuxiliaryContentType is 'password'.
   */
  modalFooterPasswordButtonText?: ReactNode;
  /**
   * Whether the password checkbox is checked (e.g., "Remember me").
   * Only used when modalFooterAuxiliaryContentType is 'password'.
   */
  modalFooterPasswordChecked?: boolean;
  /**
   * Label for the password checkbox (e.g., "Remember me").
   * Only used when modalFooterAuxiliaryContentType is 'password'.
   */
  modalFooterPasswordCheckedLabel?: string;
  /**
   * Change handler for the password checkbox.
   * Only used when modalFooterAuxiliaryContentType is 'password'.
   */
  modalFooterPasswordCheckedOnChange?: (checked: boolean) => void;
  /**
   * Click handler for the password auxiliary button.
   * Only used when modalFooterAuxiliaryContentType is 'password'.
   */
  modalFooterPasswordOnClick?: ButtonProps['onClick'];
  /**
   * Whether to show the cancel button.
   * @default true
   */
  modalFooterShowCancelButton?: boolean;
}

/**
 * The react component for `mezzanine` modal footer.
 */
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter(props, ref) {
    const {
      children,
      className,
      modalFooterActionsButtonLayout = 'fixed',
      modalFooterAnnotation,
      modalFooterAuxiliaryContentButtonProps,
      modalFooterAuxiliaryContentButtonText,
      modalFooterAuxiliaryContentChecked,
      modalFooterAuxiliaryContentLabel,
      modalFooterAuxiliaryContentOnChange,
      modalFooterAuxiliaryContentOnClick,
      modalFooterAuxiliaryContentType,
      modalFooterCancelButtonProps,
      modalFooterCancelText,
      modalFooterConfirmButtonProps,
      modalFooterConfirmText,
      modalFooterLoading,
      modalFooterOnCancel,
      modalFooterOnConfirm,
      modalFooterPasswordButtonProps,
      modalFooterPasswordButtonText,
      modalFooterPasswordChecked,
      modalFooterPasswordCheckedLabel,
      modalFooterPasswordCheckedOnChange,
      modalFooterPasswordOnClick,
      modalFooterShowCancelButton = true,
      ...rest
    } = props;

    const { disabled: cancelButtonDisabled = modalFooterLoading } =
      modalFooterCancelButtonProps || {};

    const isActionsButtonFillLayout =
      modalFooterActionsButtonLayout === 'fill' && !modalFooterAuxiliaryContentType;

    return (
      <div {...rest} ref={ref} className={cx(classes.modalFooter, {
        [classes.modalFooter + '--password-mode']: modalFooterAuxiliaryContentType === 'password',
        [classes.modalFooter + '--with-auxiliary-content']: !!modalFooterAuxiliaryContentType && modalFooterAuxiliaryContentType !== 'password',
      }, className)}>
        {modalFooterAuxiliaryContentType === 'password' && (
          <div className={classes.modalFooterPasswordContainer}>
            <Checkbox
              checked={modalFooterPasswordChecked}
              label={modalFooterPasswordCheckedLabel}
              onChange={(e) => modalFooterPasswordCheckedOnChange?.(e.target.checked)}
            />
            <Button
              variant="base-text-link"
              {...modalFooterPasswordButtonProps}
              onClick={modalFooterPasswordOnClick}
            >
              {modalFooterPasswordButtonText}
            </Button>
          </div>
        )}
        {modalFooterAuxiliaryContentType && modalFooterAuxiliaryContentType !== 'password' && (
          <div className={classes.modalFooterAuxiliaryContentContainer}>
            {modalFooterAuxiliaryContentType === 'annotation' && (
              <Typography variant="caption" color="text-neutral">{modalFooterAnnotation}</Typography>
            )}
            {modalFooterAuxiliaryContentType === 'button' && (
              <Button
                variant="base-text-link"
                {...modalFooterAuxiliaryContentButtonProps}
                onClick={modalFooterAuxiliaryContentOnClick}
              >
                {modalFooterAuxiliaryContentButtonText}
              </Button>
            )}
            {modalFooterAuxiliaryContentType === 'checkbox' && (
              <Checkbox
                checked={modalFooterAuxiliaryContentChecked}
                label={modalFooterAuxiliaryContentLabel}
                onChange={(e) => modalFooterAuxiliaryContentOnChange?.(e.target.checked)}
              />
            )}
            {modalFooterAuxiliaryContentType === 'toggle' && (
              <Toggle
                checked={modalFooterAuxiliaryContentChecked}
                label={modalFooterAuxiliaryContentLabel}
                onChange={(e) => modalFooterAuxiliaryContentOnChange?.(e.target.checked)}
              />
            )}
          </div>
        )}
        <ButtonGroup className={cx(classes.modalFooterActionsButtonContainer, {
          [classes.modalFooterActionsButtonContainer + '--fill-layout']: isActionsButtonFillLayout,
        })}>
          {modalFooterShowCancelButton && (
            <Button
              variant="base-secondary"
              {...modalFooterCancelButtonProps}
              disabled={cancelButtonDisabled}
              onClick={modalFooterOnCancel}
              className={classes.modalFooterActionsButton}
            >
              {modalFooterCancelText}
            </Button>
          )}
          <Button
            variant="base-primary"
            {...modalFooterConfirmButtonProps}
            loading={modalFooterLoading}
            onClick={modalFooterOnConfirm}
            className={classes.modalFooterActionsButton}
          >
            {modalFooterConfirmText}
          </Button>
        </ButtonGroup>
        {children}
      </div>
    );
  },
);

export default ModalFooter;
