import { forwardRef, MouseEventHandler } from 'react';
import {
  alertClasses as classes,
  alertIcons,
  AlertSeverity,
} from '@mezzanine-ui/core/alert';
import {
  TimesIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';

export interface AlertProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Close handler.
   */
  onClose?: MouseEventHandler;
  /**
   * The severity of alert.
   * @default success
   */
  severity?: AlertSeverity;
}

/**
 * The react component for `mezzanine` alert.
 * This component should always be full width of its parent.
 */
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const {
    className,
    children,
    onClose,
    severity = 'success',
    ...rest
  } = props;

  const targetIcon = alertIcons[severity];

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        classes.severity(severity),
        className,
      )}
      {...rest}
    >
      <Icon
        className={classes.icon}
        icon={targetIcon}
      />
      <p className={classes.message}>{children}</p>
      <Icon
        className={classes.closeIcon}
        icon={TimesIcon}
        onClick={onClose}
        role="button"
      />
    </div>
  );
});

export default Alert;
