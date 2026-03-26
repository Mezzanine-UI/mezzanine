'use client';

import {
  Children,
  cloneElement,
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
  type CSSProperties,
  type ReactNode,
} from 'react';

import { flip, offset } from '@floating-ui/react-dom';
import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import {
  notificationClasses as classes,
  notificationIcons,
  NotificationSeverity,
  NotificationType,
} from '@mezzanine-ui/core/notification-center';
import { CloseIcon, DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

import Badge from '../Badge';
import Button, { ButtonGroup, ButtonProps } from '../Button';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import { createNotifier, NotifierConfig, NotifierData } from '../Notifier';
import Popper from '../Popper';
import Transition, {
  type SlideProps,
  type TransitionState,
} from '../Transition';
import { reflow } from '../Transition/reflow';
import { useSetNodeTransition } from '../Transition/useSetNodeTransition';
import Typography from '../Typography';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { cx } from '../utils/cx';

export interface NotificationConfigProps
  extends Pick<NotifierConfig, 'duration'>,
    Pick<
      SlideProps,
      'easing' | 'from' | 'onEnter' | 'onEntered' | 'onExit' | 'onExited'
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
  timeStamp?: string | number;
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

/** Props accepted by NotificationCenter severity shorthand methods such as `NotificationCenter.success`. */
export type NotificationCenterShorthandProps = Omit<
  NotificationData,
  'severity'
>;

/** Static severity shorthand methods attached to the {@link NotificationCenter} component. */
export interface NotificationCenterSeverityMethods {
  /** Display an error notification. */
  error: (props?: NotificationCenterShorthandProps) => Key;
  /** Display an informational notification. */
  info: (props?: NotificationCenterShorthandProps) => Key;
  /** Display a success notification. */
  success: (props?: NotificationCenterShorthandProps) => Key;
  /** Display a warning notification. */
  warning: (props?: NotificationCenterShorthandProps) => Key;
}

const DEFAULT_MAX_VISIBLE_NOTIFICATIONS = 3;

const NOTIFICATION_SLIDE_FADE_DURATION = {
  enter: MOTION_DURATION.slow,
  exit: MOTION_DURATION.moderate,
};

const NOTIFICATION_SLIDE_FADE_EASING = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.exit,
};

function getNotificationSlideFadeStyle(
  state: TransitionState,
  inProp: boolean,
  from: 'right' | 'top',
): CSSProperties {
  if (state === 'entering' || state === 'entered') {
    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    };
  }

  const style: CSSProperties =
    state === 'exiting'
      ? {
          opacity: 0,
          transform: 'translate3d(0, 0, 0)',
        }
      : {
          opacity: 0,
          transform: {
            top: 'translate3d(0, -100%, 0)',
            right: 'translate3d(100%, 0, 0)',
          }[from],
        };

  if (state === 'exited' && !inProp) {
    style.visibility = 'hidden';
  }

  return style;
}

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
      return (
        firstNotification.props.maxVisibleNotifications ??
        DEFAULT_MAX_VISIBLE_NOTIFICATIONS
      );
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
      {hasOverflow ? (
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
      ) : null}
    </>
  );
};

/** @internal Underlying React element rendered by the NotificationCenter notifier. */
const NotificationCenterFC: FC<PropsWithChildren<NotificationData>> = (
  props,
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
    from = 'top',
    ...restTransitionProps
  } = props;

  const targetIcon = notificationIcons[severity];

  const [openDropdown, setOpenDropdown] = useState(false);
  const [open, setOpen] = useState(true);
  const [timeStampAnchor, setTimeStampAnchor] = useState<HTMLElement | null>(
    null,
  );
  const timeStampRef = useRef<HTMLElement>(null);
  const notificationSlideFadeNodeRef = useRef<HTMLElement>(null);

  const slideFadeResolvedDuration = NOTIFICATION_SLIDE_FADE_DURATION;
  const slideFadeEasing =
    restTransitionProps.easing ?? NOTIFICATION_SLIDE_FADE_EASING;
  const slideFadeDelay = 0;

  const [setSlideTransition, resetSlideTransition] = useSetNodeTransition(
    {
      delay: slideFadeDelay,
      duration: slideFadeResolvedDuration,
      easing: slideFadeEasing,
      properties: ['transform'],
    },
    undefined,
  );
  const [setFadeTransition, resetFadeTransition] = useSetNodeTransition(
    {
      delay: slideFadeDelay,
      duration: slideFadeResolvedDuration,
      easing: slideFadeEasing,
      properties: ['opacity'],
    },
    undefined,
  );
  const notificationSlideFadeComposedRef = useComposeRefs([
    notificationSlideFadeNodeRef,
  ]);

  const isToday = useMemo(() => {
    try {
      const timestampDate = new Date(timeStamp);

      // Check if the time stamp is a valid date
      if (Number.isNaN(timestampDate.getTime())) {
        return false;
      }

      const now = new Date();
      const nowStartOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const timestampStartOfDay = new Date(
        timestampDate.getFullYear(),
        timestampDate.getMonth(),
        timestampDate.getDate(),
      );

      return timestampStartOfDay.getTime() === nowStartOfDay.getTime();
    } catch {
      return false;
    }
  }, [timeStamp]);

  const formattedTimeStamp = useMemo(() => {
    try {
      const timestampDate = new Date(timeStamp);
      const timeStampText =
        typeof timeStamp === 'string' ? timeStamp : String(timeStamp);

      // Check if the time stamp is a valid date
      if (Number.isNaN(timestampDate.getTime())) {
        return timeStampText;
      }

      const now = Date.now();
      const nowDate = new Date(now);
      const nowStartOfDay = new Date(
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
      );
      const timestampStartOfDay = new Date(
        timestampDate.getFullYear(),
        timestampDate.getMonth(),
        timestampDate.getDate(),
      );
      const isToday = nowStartOfDay.getTime() === timestampStartOfDay.getTime();

      // Only show relative time if the timestamp is today
      if (isToday) {
        const diffInMs = timestampDate.getTime() - now;
        const diffInSeconds = Math.round(diffInMs / 1000);
        const rtf = new Intl.RelativeTimeFormat(timeStampLocale, {
          numeric: 'always',
        });

        const units: Array<{
          unit: Intl.RelativeTimeFormatUnit;
          seconds: number;
        }> = [
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

      const hasTimeComponent =
        /:\d{2}/.test(timeStampText) || timeStampText.includes('T');

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
      return typeof timeStamp === 'string' ? timeStamp : String(timeStamp);
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

    if (onCloseProp && reference !== undefined) {
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

    if (reference) {
      NotificationCenter.remove(reference);
    }
  };

  const onSelect = useCallback(
    (option: DropdownOption) => {
      if (onBadgeSelectProp) {
        onBadgeSelectProp(option);
      }
    },
    [onBadgeSelectProp],
  );

  const handleNotificationMouseEnter = () => {
    if (type === 'drawer' && isToday) {
      setTimeout(() => {
        if (timeStampRef.current) {
          setTimeStampAnchor(timeStampRef.current);
        }
      }, 0);
    }
  };

  const handleNotificationMouseLeave = () => {
    if (type === 'drawer' && isToday) {
      setTimeStampAnchor(null);
    }
  };

  const showConfirmButton = Boolean(confirmButtonText && onConfirmProp);
  const showCancelButton = Boolean(
    cancelButtonText && (onCancelProp || onCloseProp),
  );
  const hideButtons = !(
    type === 'notification' &&
    (showConfirmButton || showCancelButton)
  );

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
      {targetIcon ? (
        <div className={classes.iconContainer}>
          <Icon icon={targetIcon} className={classes.severityIcon} size={32} />
        </div>
      ) : null}
      <div className={classes.body}>
        <div className={classes.bodyContent}>
          <h4 className={classes.title}>{title}</h4>
          <Typography className={classes.content}>{description}</Typography>
        </div>
        {!hideButtons && (
          <ButtonGroup className={classes.action}>
            {showCancelButton ? (
              <Button
                onClick={onCancel || onClose}
                size="minor"
                variant="base-secondary"
                {...cancelButtonProps}
              >
                {cancelButtonText}
              </Button>
            ) : (
              <></>
            )}
            {showConfirmButton ? (
              <Button onClick={onConfirm} size="minor" {...confirmButtonProps}>
                {confirmButtonText}
              </Button>
            ) : (
              <></>
            )}
          </ButtonGroup>
        )}
        {type === 'drawer' && (
          <>
            {isToday && (
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
                  middleware: [offset({ mainAxis: 8 }), flip()],
                }}
              >
                <div className={classes.timeStampPopper}>
                  <Typography className={classes.timeStampText}>
                    {timeStamp}
                  </Typography>
                </div>
              </Popper>
            )}
            <Typography
              className={classes.timeStamp}
              ref={timeStampRef}
              variant="label-secondary"
            >
              {formattedTimeStamp}
            </Typography>
          </>
        )}
      </div>
      {type === 'drawer' ? (
        <Dropdown
          open={openDropdown}
          onClose={() => setOpenDropdown(false)}
          onVisibilityChange={(open) => setOpenDropdown(open)}
          options={options ?? []}
          onSelect={onSelect}
          placement="bottom-end"
          zIndex={'var(--mzn-z-index-popover)'}
        >
          <Button
            variant="base-ghost"
            onClick={onClose}
            className={classes.dotIconButton}
          >
            {showBadge && <Badge variant="dot-error" />}
            <Icon
              icon={DotHorizontalIcon}
              className={classes.closeIcon}
              size={16}
              onClick={onBadgeClick}
            />
          </Button>
        </Dropdown>
      ) : (
        <Icon
          icon={CloseIcon}
          className={classes.closeIcon}
          size={16}
          onClick={onClose}
        />
      )}
    </div>
  );

  if (type === 'notification') {
    return (
      <Transition
        {...restTransitionProps}
        appear
        duration={slideFadeResolvedDuration}
        in={open}
        nodeRef={notificationSlideFadeNodeRef}
        onEnter={(node, isAppearing) => {
          setSlideTransition(node, 'enter');
          reflow(node);
          restTransitionProps.onEnter?.(node, isAppearing);
        }}
        onEntered={(node, isAppearing) => {
          resetSlideTransition(node);
          restTransitionProps.onEntered?.(node, isAppearing);
        }}
        onExited={(node) => {
          resetFadeTransition(node);
          onExited(node);
        }}
        onExit={(node) => {
          setFadeTransition(node, 'exit');
          restTransitionProps.onExit?.(node);
        }}
      >
        {(state) =>
          cloneElement(notificationContent, {
            ref: notificationSlideFadeComposedRef,
            style: {
              ...getNotificationSlideFadeStyle(state, open, from),
              ...notificationContent.props.style,
            },
          })
        }
      </Transition>
    );
  }

  return (
    <>
      {prependTips && (
        <Typography className={classes.prependTips}>{prependTips}</Typography>
      )}
      {notificationContent}
      {appendTips && (
        <Typography className={classes.appendTips}>{appendTips}</Typography>
      )}
    </>
  );
};

const {
  add: addNotifier,
  config,
  destroy,
  remove,
} = createNotifier<NotificationData, NotificationConfigProps>({
  duration: false,
  render: (notif) => {
    const { key, ...restNotif } = notif;

    return <NotificationCenterFC key={key} {...restNotif} reference={key} />;
  },
  renderContainer: (children) => (
    <NotificationCenterContainer>{children}</NotificationCenterContainer>
  ),
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

/**
 * 通知中心元件，支援即時提示（`notification`）與抽屜清單（`drawer`）兩種呈現模式。
 *
 * 以 `<NotificationCenter type="notification" />` 宣告式渲染單筆浮動通知；
 * 或使用靜態方法 `NotificationCenter.add()`、`.success()`、`.error()` 等命令式 API
 * 觸發通知，並可透過回傳的 key 呼叫 `remove()` 收回。
 * `type: 'drawer'` 模式下，請搭配 `NotificationCenterDrawer` 以清單方式顯示。
 *
 * @example
 * ```tsx
 * import NotificationCenter from '@mezzanine-ui/react/NotificationCenter';
 *
 * // 宣告式：嵌入畫面中的通知
 * <NotificationCenter
 *   reference="notify-1"
 *   severity="success"
 *   title="儲存成功"
 *   type="notification"
 * />
 *
 * // 命令式：觸發浮動通知
 * NotificationCenter.success({ title: '儲存成功', description: '資料已更新。' });
 * NotificationCenter.error({ title: '操作失敗', description: '請稍後再試。' });
 *
 * // 手動控制生命週期
 * const key = NotificationCenter.add({ severity: 'info', title: '處理中…', type: 'notification' });
 * NotificationCenter.remove(key);
 * ```
 *
 * @see {@link NotificationData} 所有可用的通知設定項
 * @see {@link NotificationCenterDrawer} 抽屜清單模式的容器元件
 */
const NotificationCenter = Object.assign(NotificationCenterFC, {
  add: (notif: NotificationData & { key?: Key }) => {
    if (notif.type === 'drawer') {
      return 'NOT_SET' as Key;
    }

    return addNotifier(notif);
  },
  config,
  destroy,
  remove,
  error: (props?: NotificationCenterShorthandProps) =>
    addNotifier({ ...props, severity: 'error', type: 'notification' }),
  info: (props?: NotificationCenterShorthandProps) =>
    addNotifier({ ...props, severity: 'info', type: 'notification' }),
  success: (props?: NotificationCenterShorthandProps) =>
    addNotifier({ ...props, severity: 'success', type: 'notification' }),
  warning: (props?: NotificationCenterShorthandProps) =>
    addNotifier({ ...props, severity: 'warning', type: 'notification' }),
});

/** Full type of the {@link NotificationCenter} component including all static notification API methods. */
export type NotificationCenterType = typeof NotificationCenter;

export default NotificationCenter;
