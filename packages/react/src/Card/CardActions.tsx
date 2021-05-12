import { forwardRef, ReactNode, CSSProperties } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { ButtonProps } from '../Button';
import ConfirmActions from '../ConfirmActions';

export interface CardActionsProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  children?: ReactNode;
  /**
   * Content of cancel button.
   */
  cancelText?: string,
  /**
   * Content of confirm button.
   */
  confirmText?: string,
  /**
   * Inline style to apply to the card actions.
   */
  style?: CSSProperties;
  /**
   * The action bottom
   */
  otherActions?: ReactNode;
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
 * The react component for `mezzanine` card.
 */
const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(props, ref) {
  const {
    className,
    children,
    otherActions,
    cancelText,
    confirmText,
    onCancel,
    onConfirm,
    ...rest
  } = props;

  return (
    otherActions || confirmText || cancelText ? (
      <div
        ref={ref}
        className={classes.actions}
        {...rest}
      >
        { otherActions || (<div />) }
        <ConfirmActions
          cancelText={cancelText}
          confirmText={confirmText}
          hideCancelButton={!cancelText}
          hideConfirmButton={!confirmText}
        />
      </div>
    ) : null
  );
});

export default CardActions;
