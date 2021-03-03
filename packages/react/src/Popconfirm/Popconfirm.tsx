import { forwardRef, ReactNode } from 'react';
import { ExclamationCircleFilledIcon, IconDefinition } from '@mezzanine-ui/icons';
import { popConfirmClasses as classes } from '@mezzanine-ui/core/popconfirm';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import Popover, { PopoverProps } from '../Popover';
import ConfirmActions, { ConfirmActionsProps } from '../ConfirmActions';

export interface PopconfirmProps
  extends
  PopoverProps,
  Pick<
  ConfirmActionsProps,
  | 'cancelButtonProps'
  | 'cancelText'
  | 'confirmButtonProps'
  | 'confirmText'
  | 'onCancel'
  | 'onConfirm'
  > {
  /**
   * Customize the icon on the popconfirm
   */
  icon?: IconDefinition;
  /**
   * the title of the confirmation box
   */
  title?: ReactNode;
}

const Popconfirm = forwardRef<HTMLDivElement, PopconfirmProps>(function Popconfirm(props, ref) {
  const {
    className,
    container,
    cancelButtonProps,
    cancelText,
    confirmButtonProps,
    confirmText,
    icon = ExclamationCircleFilledIcon,
    onCancel,
    onConfirm,
    title,
    ...rest
  } = props;

  return (
    <Popover
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
      title={(
        <>
          <Icon color="primary" icon={icon} />
          {title}
        </>
      )}
    >
      <ConfirmActions
        cancelButtonProps={cancelButtonProps}
        cancelText={cancelText}
        confirmButtonProps={confirmButtonProps}
        confirmText={confirmText}
        onCancel={onCancel}
        onConfirm={onConfirm}
        size="small"
      />
    </Popover>
  );
});

export default Popconfirm;
