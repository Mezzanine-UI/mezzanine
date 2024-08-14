import { forwardRef, ReactNode } from 'react';
import Button, { ButtonGroup, ButtonGroupProps, ButtonProps } from '../Button';

export interface ConfirmActionsProps
  extends Omit<ButtonGroupProps, 'children'> {
  /**
   * Other props of cancel button.
   */
  cancelButtonProps?: ButtonProps;
  /**
   * Content of cancel button.
   */
  cancelText?: ReactNode;
  /**
   * Other props of confirm button.
   */
  confirmButtonProps?: ButtonProps;
  /**
   * Content of confirm button.
   */
  confirmText?: ReactNode;
  /**
   * Whether to hide cancel button.
   */
  hideCancelButton?: boolean;
  /**
   * Whether to hide confirm button.
   */
  hideConfirmButton?: boolean;
  /**
   * Indicate whether confirm button loading and cancel button disabled.
   */
  loading?: boolean;
  /**
   * Click handler for cancel button.
   */
  onCancel?: ButtonProps['onClick'];
  /**
   * Click handler for confirm button.
   */
  onConfirm?: ButtonProps['onClick'];
}

/**
 * The react component for `mezzanine` confirm actions.
 */
const ConfirmActions = forwardRef<HTMLDivElement, ConfirmActionsProps>(
  function ConfirmActions(props, ref) {
    const {
      cancelButtonProps,
      cancelText,
      confirmButtonProps,
      confirmText,
      hideCancelButton,
      hideConfirmButton,
      loading,
      onCancel,
      onConfirm,
      ...rest
    } = props;

    const { disabled: cancelButtonDisabled = loading } =
      cancelButtonProps || {};

    return (
      <ButtonGroup {...rest} ref={ref}>
        {!hideCancelButton && (
          <Button
            variant="outlined"
            {...cancelButtonProps}
            disabled={cancelButtonDisabled}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        )}
        {!hideConfirmButton && (
          <Button
            variant="contained"
            {...confirmButtonProps}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        )}
      </ButtonGroup>
    );
  },
);

export default ConfirmActions;
