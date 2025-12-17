import { forwardRef, ReactNode } from 'react';
import { cardActionsClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { ButtonProps } from '../Button';
import ConfirmActions, { ConfirmActionsProps } from '../ConfirmActions';

export interface CardActionsProps extends ConfirmActionsProps {
  /**
   * Content of cancel button. not render if value is empty.
   */
  cancelText?: string;
  /**
   * Content of confirm button. not render if value is empty.
   */
  confirmText?: string;
  /**
   * Click handler for cancel button.
   */
  onCancel?: ButtonProps['onClick'];
  /**
   * Click handler for confirm button.
   */
  onConfirm?: ButtonProps['onClick'];
  /**
   * Indicate whether confirm button loading and cancel button disabled.
   */
  loading?: boolean;
  /**
   * The action bottom on the left. not render if value is empty.
   */
  otherActions?: ReactNode;
}
/**
 * The react component for `mezzanine` cardActions.
 */
const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions(props, ref) {
    const {
      cancelText,
      cancelButtonProps,
      className,
      confirmText,
      confirmButtonProps,
      hideCancelButton,
      hideConfirmButton,
      loading,
      onCancel,
      onConfirm,
      otherActions,
      ...rest
    } = props;

    return (
      <div ref={ref} className={cx(classes.host, className)} {...rest}>
        {otherActions || <div />}
        <ConfirmActions
          cancelText={cancelText}
          confirmText={confirmText}
          cancelButtonProps={cancelButtonProps}
          confirmButtonProps={confirmButtonProps}
          hideCancelButton={hideCancelButton || !cancelText}
          hideConfirmButton={hideConfirmButton || !confirmText}
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    );
  },
);

export default CardActions;
