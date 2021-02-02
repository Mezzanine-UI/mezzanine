import {
  DetailedHTMLProps,
  HTMLAttributes,
  forwardRef,
  MouseEventHandler,
} from 'react';
import {
  alertClasses as classes,
  alertIcons,
  AlertStatus,
} from '@mezzanine-ui/core/alert';
import {
  TimesIcon,
} from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Typography from '../Typography';
import { cx } from '../utils/cx';

export interface AlertProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Close handler.
   */
  onClose?: MouseEventHandler;
  /**
   * Alert status.
   * @default success
   */
  status?: AlertStatus;
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
    status = 'success',
    ...rest
  } = props;

  const targetIcon = alertIcons[status];

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        classes.status(status),
        className,
      )}
      {...rest}
    >
      <Icon
        icon={targetIcon}
        color={status}
        className={classes.icon}
      />
      <Typography
        component="p"
        variant="body1"
        className={classes.message}
      >
        {children}
      </Typography>
      <Icon
        icon={TimesIcon}
        onClick={onClose}
        className={classes.closeIcon}
        role="button"
      />
    </div>
  );
});

export default Alert;
