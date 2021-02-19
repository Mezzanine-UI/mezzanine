import React, {
  forwardRef,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { ExclamationCircleFilledIcon, IconDefinition } from '@mezzanine-ui/icons';
import { popConfirmClasses as classes } from '@mezzanine-ui/core/popconfirm';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import Button, { ButtonGroup, ButtonProps } from '../Button';
import Popover, { PopoverProps } from '../Popover';

export interface PopconfirmProps extends PopoverProps {
  /**
   * the cancel button props
   */
  cancelButtonProps?: ButtonProps;
  /**
   * the text of the Cancel button
   */
  cancelText?: string;
  /**
   * the confirm button props
   */
  confirmButtonProps?: ButtonProps;
  /**
   * the text of the confirm button
   */
  confirmText?: string;
  /**
   * Customize the icon on the popconfirm
   */
  icon?: IconDefinition;
  /**
   * A callback of cancel
   */
  onCancel?: MouseEventHandler;
  /**
   * A callback of confirmation
   */
  onConfirm?: MouseEventHandler;
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
      <ButtonGroup
        color="primary"
        size="small"
      >
        <Button
          variant="outlined"
          {...cancelButtonProps}
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          {...confirmButtonProps}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </ButtonGroup>
    </Popover>
  );
});

export default Popconfirm;
