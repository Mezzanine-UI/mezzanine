import {
  DetailedHTMLProps,
  HTMLAttributes,
  forwardRef,
  MouseEventHandler,
} from 'react';
import {
  alertClasses as classes,
  alertIcons,
  AlertSeverity,
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
        icon={targetIcon}
        color={severity}
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
