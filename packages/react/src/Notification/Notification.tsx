import {
  notificationClasses as classes,
  notificationIcons,
  NotificationSeverity,
} from '@mezzanine-ui/core/notification';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  FC,
  Key,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import Button, { ButtonGroup } from '../Button';
import Icon from '../Icon';
import {
  createNotifier,
  NotifierData,
  Notifier,
  NotifierConfig,
} from '../Notifier';
import { SlideFade, SlideFadeProps } from '../Transition';
import { cx } from '../utils/cx';

export interface NotificationConfigProps
  extends
  Pick<NotifierConfig, 'duration'>,
  Pick<SlideFadeProps,
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited'
  | 'easing'
  | 'direction'
  > {}

export interface NotificationData extends NotifierData, NotificationConfigProps {
  /**
   * Cancel button text;
   */
  cancelText?: ReactNode;
  /**
   * Confirm button text;
   */
  confirmText?: ReactNode;
  /**
   * Cancel button click event handler. <br />
   * If not provided, the event handler will fallback to a close function using `Notification.remove`.
   */
  onCancel?: VoidFunction;
  /**
   * Confirm button click event handler. <br />
   * If given, will render action button group.
   */
  onConfirm?: VoidFunction;
  /**
   * If given, the message will be closed after the amount of time.
   * You can use `Message.config` to overwrite.
   * @default false
   */
  /**
   * The identifier of the notification.
   */
  reference?: Key;
  /**
   * The severity of the message.
   * @default info
   */
  severity?: NotificationSeverity;
  /**
   * The title of notification.
   */
  title?: ReactNode;
}

export interface Notification
  extends
  FC<NotificationData>,
  Notifier<NotificationData, NotificationConfigProps>,
  Record<
  NotificationSeverity,
  (
    props?: Omit<NotificationData, 'severity'>,
  ) => Key
  > {
}

/**
 * The react component for `mezzanine` notification.
 *
 * Use the API from the Notification instance such as `Notification.success` and `Notification.error`
 * to display a notification globally.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Notification: Notification = ((
  props: PropsWithChildren<NotificationData> & { reference: Key },
) => {
  const {
    cancelText,
    children,
    confirmText,
    direction = 'left',
    duration,
    onCancel: onCancelProp,
    onClose: onCloseProp,
    onConfirm: onConfirmProp,
    onExited: onExitedProp,
    reference,
    severity,
    title,
    ...restTransitionProps
  } = props;

  const targetIcon = severity ? notificationIcons[severity] : severity;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open && duration) {
      const timer = window.setTimeout(() => {
        setOpen(false);
      }, duration);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [open, duration]);

  const onClose = () => {
    setOpen(false);

    if (onCloseProp) {
      onCloseProp(reference);
    }
  };

  const onConfirm = onConfirmProp ? () => {
    setOpen(false);

    onConfirmProp();
  } : undefined;

  const onCancel = onCancelProp ? () => {
    setOpen(false);

    onCancelProp();
  } : undefined;

  const onExited: SlideFadeProps['onExited'] = (node) => {
    if (onExitedProp) {
      onExitedProp(node);
    }

    Notification.remove(reference);
  };

  return (
    <SlideFade
      in={open}
      appear
      onExited={onExited}
      direction={direction}
      {...restTransitionProps}
    >
      <div className={cx(
        classes.host,
        severity ? classes.severity(severity) : undefined,
      )}
      >
        {targetIcon ? (
          <div className={classes.iconContainer}>
            <Icon
              icon={targetIcon}
              className={classes.severityIcon}
            />
          </div>
        ) : null}
        <div className={classes.body}>
          <h4 className={classes.title}>
            {title}
          </h4>
          <div className={classes.content}>
            {children}
          </div>
          {onConfirm && !severity ? (
            <ButtonGroup className={classes.action}>
              <Button
                variant="contained"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
              <Button
                variant="outlined"
                onClick={onCancel || onClose}
              >
                {cancelText}
              </Button>
            </ButtonGroup>
          ) : null}
        </div>
        <Icon
          icon={TimesIcon}
          className={classes.closeIcon}
          onClick={onClose}
        />
      </div>
    </SlideFade>
  );
}) as Notification;

const {
  add,
  config,
  destroy,
  remove,
} = createNotifier<NotificationData, NotificationConfigProps>({
  duration: false,
  render: (notif) => <Notification {...notif} />,
  setRoot: (root) => {
    root.setAttribute('class', classes.root);
  },
});

Notification.add = add;
Notification.config = config;
Notification.destroy = destroy;
Notification.remove = remove;

(['success', 'warning', 'error', 'info'] as const).forEach((severity) => {
  Notification[severity] = (props) => Notification.add({
    ...props,
    severity,
  });
});

export default Notification;

