'use client';

import {
  Children,
  FC,
  Fragment,
  isValidElement,
  Key,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { flip, offset } from '@floating-ui/react-dom';
import {
  DropdownOption,
} from '@mezzanine-ui/core/dropdown/dropdown';
import {
  notificationClasses as classes,
  notificationIcons,
  NotificationSeverity,
  NotificationType
} from '@mezzanine-ui/core/notification-center';
import { CloseIcon, DotVerticalIcon } from '@mezzanine-ui/icons';

import Badge from '../Badge';
import Button, { ButtonGroup, ButtonProps } from '../Button';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import {
  createNotifier,
  Notifier,
  NotifierConfig,
  NotifierData,
} from '../Notifier';
import Popper from '../Popper';
import { Slide, SlideProps } from '../Transition';
import Typography from '../Typography';
import { cx } from '../utils/cx';

export interface NotificationConfigProps
  extends Pick<NotifierConfig, 'duration'>,
  Pick<
    SlideProps,
    | 'onEnter'
    | 'onEntered'
    | 'onExit'
    | 'onExited'
    | 'easing'
  > {
  /**
   * Callback function when "View All" button is clicked.
   * This will be called after closing all notifications.
   */
  onViewAll?: VoidFunction;
  /**
   * The text of the "View All" button.
   * @default '查看更多'
   */
  viewAllButtonText?: string;
}

export interface NotificationData
  extends NotifierData,
  NotificationConfigProps {
  /**
   * The tips to be appended to the notification.
   * Only displayed when the type is 'drawer'.
   */
  appendTips?: string;
  /**
   * Other props of cancel button.
   */
  cancelButtonProps?: ButtonProps;
  /**
   * Cancel button text.
   */
  cancelButtonText?: string;
  /**
   * Other props of confirm button.
   */
  confirmButtonProps?: ButtonProps;
  /**
   * Confirm button text.
   */
  confirmButtonText?: string;
  /**
   * The description of notification.
   */
  description?: string;
  /**
   * The maximum number of notifications to be displayed.
   * Only displayed when the type is 'notification'.
   * @default 3
   */
  maxVisibleNotifications?: number;
  /**
   * The callback function when the badge is clicked.
   * Only displayed when the type is 'drawer'.
   */
  onBadgeClick?: VoidFunction;
  /**
   * The callback function when the badge is selected.
   * Only displayed when the type is 'drawer'.
   */
  onBadgeSelect?: (option: DropdownOption) => void;
  /**
   * Cancel button click event handler. <br />
   * If not provided, the event handler will fallback to a close function using `NotificationCenter.remove`.
   */
  onCancel?: VoidFunction;
  /**
   * Confirm button click event handler. <br />
   * If given, will render action button group.
   */
  onConfirm?: VoidFunction;
  /**
   * The options of the badge.
   * Only displayed when the type is 'drawer'.
   */
  options?: DropdownOption[];
  /**
   * The tips to be prepended to the notification.
   * Only displayed when the type is 'drawer'.
   */
  prependTips?: string;
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
   * The props of the badge.
   * Only displayed when the type is 'drawer'.
   */
  showBadge?: boolean;
  /**
   * The time stamp of notification on the drawer list.
   * @default new Date().toLocaleTimeString()
   */
  timeStamp?: string;
  /**
   * The locale of the time stamp.
   * @default 'zh-TW'
   */
  timeStampLocale?: string;
  /**
   * The title of notification.
   */
  title?: string;
  /**
   * The type of notification.
   * @default 'notification'
   */
  type?: NotificationType;
}

export interface NotificationCenter
  extends FC<NotificationData>,
  Notifier<NotificationData, NotificationConfigProps>,
  Record<
    NotificationSeverity,
    (props?: Omit<NotificationData, 'severity'>) => Key
  > { }

const DEFAULT_MAX_VISIBLE_NOTIFICATIONS = 3;

const NotificationCenterContainer: FC<PropsWithChildren> = ({ children }) => {
  const notificationItems = useMemo(
    () => Children.toArray(children),
    [children],
  );

  // Helper function to extract NotificationCenter component from Fragment or direct element
  const extractNotificationCenter = (
    child: ReactNode,
  ): React.ReactElement<NotificationData> | null => {
    if (!isValidElement(child)) {
      return null;
    }

    // If it's a Fragment, check its children
    if (child.type === Fragment) {
      const fragmentProps = child.props as { children?: ReactNode };
      const fragmentChildren = Children.toArray(fragmentProps.children);
      const notificationCenter = fragmentChildren.find((fragmentChild) =>
        isValidElement<NotificationData>(fragmentChild),
      ) as React.ReactElement<NotificationData> | undefined;

      return notificationCenter ?? null;
    }

    // If it's directly a NotificationCenter component
    if (isValidElement<NotificationData>(child)) {
      return child;
    }

    return null;
  };

  const maxVisibleNotifications = useMemo(() => {
    const firstNotification = notificationItems
      .map(extractNotificationCenter)
      .find((notification) => notification !== null);

    if (firstNotification) {
      return firstNotification.props.maxVisibleNotifications
        ?? DEFAULT_MAX_VISIBLE_NOTIFICATIONS;
    }

    return DEFAULT_MAX_VISIBLE_NOTIFICATIONS;
  }, [notificationItems]);
  const onViewAll = useMemo(() => {
    const firstNotification = notificationItems
      .map(extractNotificationCenter)
      .find((notification) => notification !== null);

    return firstNotification?.props.onViewAll;
  }, [notificationItems]);
  const viewAllButtonText = useMemo(() => {
    const firstNotification = notificationItems
      .map(extractNotificationCenter)
      .find((notification) => notification !== null);

    return firstNotification?.props.viewAllButtonText ?? '查看更多';
  }, [notificationItems]);
  const hasOverflow = notificationItems.length > maxVisibleNotifications;
  const visibleItems = useMemo(
    () => notificationItems.slice(0, maxVisibleNotifications),
    [notificationItems, maxVisibleNotifications],
  );

  const handleViewAll = () => {
    NotificationCenter.destroy();

    if (onViewAll) {
      onViewAll();
    }
  };

  if (!notificationItems.length) {
    return null;
  }

  return (
    <>
      {visibleItems}
      {
        hasOverflow
          ? (
            <div className={classes.viewAllButton}>
              <Button
                onClick={handleViewAll}
                size="main"
                variant="base-secondary"
                className={classes.viewAllButtonText}
              >
                {viewAllButtonText}
              </Button>
            </div>
          )
          : null
      }
    </>
  );
};

/**
 * The react component for `mezzanine` notification center.
 *
 * Use the API from the NotificationCenter instance such as `NotificationCenter.success` and `NotificationCenter.error`
 * to display a notification globally.
 */

const NotificationCenter: NotificationCenter = ((
  props: PropsWithChildren<NotificationData> & { reference: Key },
) => {
  const {
    type = 'notification',
    cancelButtonProps = {},
    cancelButtonText = 'Cancel',
    confirmButtonProps = {},
    confirmButtonText = 'Confirm',
    description,
    duration,
    onCancel: onCancelProp,
    onClose: onCloseProp,
    onConfirm: onConfirmProp,
    onExited: onExitedProp,
    reference,
    severity = 'info',
    title,
    timeStamp = new Date().toLocaleTimeString(),
    timeStampLocale = 'zh-TW',
    showBadge,
    onBadgeClick: onBadgeClickProp,
    options,
    onBadgeSelect: onBadgeSelectProp,
    prependTips,
    appendTips,
    ...restTransitionProps
  } = props;

  const targetIcon = notificationIcons[severity];

  const [openDropdown, setOpenDropdown] = useState(false);
  const [open, setOpen] = useState(true);
  const [timeStampAnchor, setTimeStampAnchor] = useState<HTMLElement | null>(null);
  const timeStampRef = useRef<HTMLElement>(null);

  const formattedTimeStamp = useMemo(() => {
    try {
      const timestampDate = new Date(timeStamp);

      // Check if the time stamp is a valid date
      if (isNaN(timestampDate.getTime())) {
        return timeStamp;
      }

      const now = Date.now();
      const diffInMs = timestampDate.getTime() - now;
      const diffInSeconds = Math.round(diffInMs / 1000);
      const diffInDays = Math.round(diffInSeconds / 86400);

      if (Math.abs(diffInDays) <= 7) {
        const rtf = new Intl.RelativeTimeFormat(timeStampLocale, { numeric: 'always' });

        const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
          { unit: 'day', seconds: 86400 },
          { unit: 'hour', seconds: 3600 },
          { unit: 'minute', seconds: 60 },
        ];

        for (const { unit, seconds } of units) {
          const value = Math.round(diffInSeconds / seconds);
          if (Math.abs(value) >= 1) {
            return rtf.format(value, unit);
          }
        }

        return 'now';
      }

      const hasTimeComponent = /:\d{2}/.test(timeStamp) || timeStamp.includes('T');

      if (hasTimeComponent) {
        const dateFormatter = new Intl.DateTimeFormat(timeStampLocale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return dateFormatter.format(timestampDate).replace(/\//g, '-');
      } else {
        const dateFormatter = new Intl.DateTimeFormat(timeStampLocale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        return dateFormatter.format(timestampDate).replace(/\//g, '-');
      }
    } catch {
      return timeStamp;
    }
  }, [timeStamp, timeStampLocale]);

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

  const onBadgeClick = useCallback(() => {
    if (onBadgeClickProp) {
      onBadgeClickProp();
    }

    if (options && options.length > 0) {
      setOpenDropdown(true);
    }
  }, [onBadgeClickProp, setOpenDropdown, options]);

  const onClose = () => {
    setOpen(false);

    if (onCloseProp) {
      onCloseProp(reference);
    }
  };

  const onConfirm = onConfirmProp
    ? () => {
      setOpen(false);

      onConfirmProp();
    }
    : undefined;

  const onCancel = onCancelProp
    ? () => {
      setOpen(false);

      onCancelProp();
    }
    : undefined;

  const onExited: SlideProps['onExited'] = (node: HTMLElement) => {
    if (onExitedProp) {
      onExitedProp(node);
    }

    NotificationCenter.remove(reference);
  };

  const onSelect = useCallback((option: DropdownOption) => {
    if (onBadgeSelectProp) {
      onBadgeSelectProp(option);
    }
  }, [onBadgeSelectProp]);

  const handleNotificationMouseEnter = () => {
    if (type === 'drawer') {
      setTimeout(() => {
        if (timeStampRef.current) {
          setTimeStampAnchor(timeStampRef.current);
        }
      }, 0);
    }
  };

  const handleNotificationMouseLeave = () => {
    if (type === 'drawer') {
      setTimeStampAnchor(null);
    }
  };

  const showConfirmButton = Boolean(confirmButtonText && onConfirmProp);
  const showCancelButton = Boolean(cancelButtonText && (onCancelProp || onCloseProp));
  const hideButtons = !(type === 'notification' && (showConfirmButton || showCancelButton));

  const notificationContent = (
    <div
      className={cx(
        classes.host,
        classes.severity(severity),
        classes.type(type),
      )}
      onMouseEnter={handleNotificationMouseEnter}
      onMouseLeave={handleNotificationMouseLeave}
    >
      {targetIcon
        ? (
          <div className={classes.iconContainer}>
            <Icon icon={targetIcon} className={classes.severityIcon} />
          </div>
        )
        : null
      }
      <div className={classes.body}>
        <div className={classes.bodyContent}>
          <h4 className={classes.title}>{title}</h4>
          <Typography className={classes.content}>
            {description}
          </Typography>
        </div>
        {!hideButtons && (
          <ButtonGroup className={classes.action}>
            {showConfirmButton
              ? (
                <Button
                  onClick={onConfirm}
                  size="minor"
                  {...confirmButtonProps}
                >
                  {confirmButtonText}
                </Button>
              )
              : <></>
            }
            {showCancelButton
              ? (
                <Button
                  onClick={onCancel || onClose}
                  size="minor"
                  variant="base-secondary"
                  {...cancelButtonProps}
                >
                  {cancelButtonText}
                </Button>
              )
              : <></>
            }
          </ButtonGroup>
        )}
        {
          type === 'drawer' && (
            <>
              <Popper
                anchor={timeStampAnchor}
                open={Boolean(timeStampAnchor)}
                arrow={{
                  className: classes.timeStampPopperArrow,
                  enabled: true,
                  padding: 0,
                }}
                style={{
                  zIndex: 'var(--mzn-z-index-popover)',
                }}
                options={{
                  placement: 'bottom',
                  middleware: [
                    offset({ mainAxis: 8 }),
                    flip(),
                  ],
                }}
              >
                <div className={classes.timeStampPopper}>
                  <Typography className={classes.timeStampText}>
                    {timeStamp}
                  </Typography>
                </div>
              </Popper>
              <Typography ref={timeStampRef} className={classes.timeStamp}>
                {formattedTimeStamp}
              </Typography>
            </>
          )
        }
      </div>
      {
        type === 'drawer'
          ? (
            <Dropdown
              open={openDropdown}
              onClose={() => setOpenDropdown(false)}
              onVisibilityChange={(open) => setOpenDropdown(open)}
              options={options ?? []}
              onSelect={onSelect}
              placement="bottom-end"
              zIndex={'var(--mzn-z-index-popover)'}
            >
              <Button variant="base-ghost" size="minor" onClick={onClose}>
                {
                  showBadge && <Badge variant="dot-error" />
                }
                <Icon
                  icon={DotVerticalIcon}
                  className={classes.closeIcon}
                  size={16}
                  onClick={onBadgeClick}
                />
              </Button>
            </Dropdown>
          )
          : (
            <Icon
              icon={CloseIcon}
              className={classes.closeIcon}
              size={16}
              onClick={onClose}
            />
          )
      }
    </div>
  );

  if (type === 'notification') {
    return (
      <>
        {prependTips && <Typography className={classes.prependTips}>{prependTips}</Typography>}
        <Slide
          in={open}
          appear
          onExited={onExited}
          {...restTransitionProps}
        >
          {notificationContent}
        </Slide>
        {appendTips && <Typography className={classes.appendTips}>{appendTips}</Typography>}
      </>
    );
  }

  return (
    <>
      {prependTips && <Typography className={classes.prependTips}>{prependTips}</Typography>}
      {notificationContent}
      {appendTips && <Typography className={classes.appendTips}>{appendTips}</Typography>}
    </>
  );
}) as NotificationCenter;

const { add: addNotifier, config, destroy, remove } = createNotifier<
  NotificationData,
  NotificationConfigProps
>({
  duration: false,
  render: (notif) => {
    const { key, ...restNotif } = notif;

    return (
      <NotificationCenter
        key={key}
        {...restNotif}
        reference={key}
      />
    );
  },
  renderContainer: (children) => (
    <NotificationCenterContainer>{children}</NotificationCenterContainer>
  ),
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

NotificationCenter.add = (notif) => {
  if (notif.type === 'drawer') {
    return 'NOT_SET';
  }
  return addNotifier(notif);
};
NotificationCenter.config = config;
NotificationCenter.destroy = destroy;
NotificationCenter.remove = remove;

(['success', 'warning', 'error', 'info'] as const).forEach((severity) => {
  NotificationCenter[severity] = (props) =>
    NotificationCenter.add({
      ...props,
      severity: severity || 'info',
      type: 'notification',
    });
});

export default NotificationCenter;
