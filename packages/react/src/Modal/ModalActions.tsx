import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { forwardRef, useContext } from 'react';
import ConfirmActions, { ConfirmActionsProps } from '../ConfirmActions';
import ModalFooter, { ModalFooterProps } from './ModalFooter';
import { ModalControlContext } from './ModalControl';

export interface ModalActionsProps
  extends
  ModalFooterProps,
  Pick<
  ConfirmActionsProps,
  | 'cancelButtonProps'
  | 'cancelText'
  | 'confirmButtonProps'
  | 'confirmText'
  | 'hideCancelButton'
  | 'hideConfirmButton'
  | 'onCancel'
  | 'onConfirm'
  > {}

/**
 * The react component for `mezzanine` modal actions.
 */
const ModalActions = forwardRef<HTMLDivElement, ModalActionsProps>(function ModalActions(props, ref) {
  const {
    cancelButtonProps,
    cancelText,
    children,
    confirmButtonProps,
    confirmText,
    hideCancelButton,
    hideConfirmButton,
    onCancel,
    onConfirm,
    ...rest
  } = props;
  const {
    danger,
    loading,
  } = useContext(ModalControlContext);

  return (
    <ModalFooter
      {...rest}
      ref={ref}
    >
      {children}
      <ConfirmActions
        cancelButtonProps={cancelButtonProps}
        cancelText={cancelText}
        className={classes.actions}
        confirmButtonProps={confirmButtonProps}
        confirmText={confirmText}
        danger={danger}
        hideCancelButton={hideCancelButton}
        hideConfirmButton={hideConfirmButton}
        loading={loading}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </ModalFooter>
  );
});

export default ModalActions;
