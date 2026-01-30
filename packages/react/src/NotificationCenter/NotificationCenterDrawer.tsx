'use client';

import { useMemo, type ComponentProps, type Key, type ReactElement } from 'react';

import { DrawerSize } from '@mezzanine-ui/core/drawer';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';

import { NotificationIcon, type IconDefinition } from '@mezzanine-ui/icons';

import Drawer, { type DrawerProps } from '../Drawer';
import Icon from '../Icon';
import Typography from '../Typography';
import NotificationCenter, { type NotificationData } from './NotificationCenter';

type NotificationDataForDrawer = NotificationData & {
  key: Key;
  type: 'drawer';
};

type NotificationCenterDrawerPropsBase = Pick<
  DrawerProps,
  | 'controlBarAllRadioLabel'
  | 'controlBarCustomButtonLabel'
  | 'controlBarDefaultValue'
  | 'controlBarOnCustomButtonClick'
  | 'controlBarOnRadioChange'
  | 'controlBarReadRadioLabel'
  | 'controlBarShow'
  | 'controlBarShowUnreadButton'
  | 'controlBarUnreadRadioLabel'
  | 'controlBarValue'
  | 'onClose'
  | 'open'
  | 'renderControlBar'
> & {
  /**
   * The size of the drawer.
   * @default 'narrow'
   */
  drawerSize?: DrawerSize;
  /**
   * The label of the "earlier" time group.
   * @default '更早'
   */
  earlierLabel?: string;
  /**
   * The icon of the empty notification.
   */
  emptyNotificationIcon?: IconDefinition;
  /**
   * The title of the empty notification.
   */
  emptyNotificationTitle?: string;
  /**
   * The label for the "past 7 days" time group.
   * @default '過去七天'
   */
  past7DaysLabel?: string;
  /**
   * The title of the drawer.
   */
  title?: string;
  /**
   * The label for the "today" time group.
   * @default '今天'
   */
  todayLabel?: string;
  /**
   * The label for the "yesterday" time group.
   * @default '昨天'
   */
  yesterdayLabel?: string;
};

export type NotificationCenterDrawerProps =
  | (NotificationCenterDrawerPropsBase & {
      /**
       * The children of the drawer.
       * Use this when you want to manually render NotificationCenter components.
       * Can be a single NotificationCenter element or an array of them.
       */
      children:
        | ReactElement<ComponentProps<typeof NotificationCenter>>
        | ReactElement<ComponentProps<typeof NotificationCenter>>[];
      notificationList?: never;
    })
  | (NotificationCenterDrawerPropsBase & {
      /**
       * The list of notifications to render.
       * Use this when you want to pass notification data and let the component render them.
       * Each notification must have `key` and `type: 'drawer'`.
       */
      notificationList: NotificationDataForDrawer[];
      children?: never;
    });

const isValidTime = (timestamp: string | number | undefined): boolean => {
  if (!timestamp) return false;

  const date = new Date(timestamp);

  return !Number.isNaN(date.getTime());
};

const getValidTime = (timestamp: string | number | undefined): number => {
  if (!isValidTime(timestamp)) return 0;

  const date = new Date(timestamp as string | number);

  return date.getTime();
};

type TimeGroup = 'today' | 'yesterday' | 'past7Days' | 'earlier';

const DEFAULT_TIME_GROUP_LABELS: Record<TimeGroup, string> = {
  today: '今天',
  yesterday: '昨天',
  past7Days: '過去七天',
  earlier: '更早',
};

const TIME_GROUP_ORDER: TimeGroup[] = [
  'today',
  'yesterday',
  'past7Days',
  'earlier',
];

const getTimeGroup = (
  timestamp: string | number | undefined,
  now: Date,
): TimeGroup => {
  if (!isValidTime(timestamp)) return 'earlier';

  const notificationDate = new Date(timestamp as string | number);
  const nowStartOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const notificationStartOfDay = new Date(
    notificationDate.getFullYear(),
    notificationDate.getMonth(),
    notificationDate.getDate(),
  );

  // Today: same calendar day
  if (notificationStartOfDay.getTime() === nowStartOfDay.getTime()) {
    return 'today';
  }

  // Yesterday: previous calendar day
  const yesterdayStartOfDay = new Date(nowStartOfDay);
  yesterdayStartOfDay.setDate(yesterdayStartOfDay.getDate() - 1);
  if (notificationStartOfDay.getTime() === yesterdayStartOfDay.getTime()) {
    return 'yesterday';
  }

  // Past 7 days: within 7 days but not today or yesterday
  const diffInDays =
    (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffInDays <= 7) {
    return 'past7Days';
  }

  // Earlier: more than 7 days ago
  return 'earlier';
};

const NotificationCenterDrawer = (props: NotificationCenterDrawerProps) => {
  const {
    children,
    controlBarAllRadioLabel,
    controlBarCustomButtonLabel,
    controlBarDefaultValue,
    controlBarOnCustomButtonClick,
    controlBarOnRadioChange,
    controlBarReadRadioLabel,
    controlBarShow,
    controlBarShowUnreadButton,
    controlBarUnreadRadioLabel,
    controlBarValue,
    drawerSize = 'narrow',
    earlierLabel,
    emptyNotificationIcon = NotificationIcon,
    emptyNotificationTitle = '目前沒有新的通知',
    notificationList,
    onClose,
    open,
    past7DaysLabel,
    renderControlBar,
    title,
    todayLabel,
    yesterdayLabel,
    ...restDrawerProps
  } = props;

  const isEmpty = useMemo(() => {
    if (notificationList) {
      return notificationList.length === 0;
    }

    if (Array.isArray(children)) {
      return children.length === 0;
    }

    return !children;
  }, [notificationList, children]);

  const renderNotifications = useMemo(() => {
    const renderEmptyNotifications = () => {
      return (
        <div className={classes.emptyNotifications}>
          <Icon icon={emptyNotificationIcon} size={28} />
          <Typography>{emptyNotificationTitle}</Typography>
        </div>
      );
    };

    if (isEmpty) {
      return renderEmptyNotifications();
    }

    // Check if notificationList is provided
    if (notificationList) {
      // Sort once by timestamp (newest first), then group while maintaining order
      const sorted = [...notificationList].sort((a, b) => {
        const aTime = getValidTime(a.timeStamp);
        const bTime = getValidTime(b.timeStamp);
        return bTime - aTime;
      });

      // Group sorted notifications
      const now = new Date();
      const grouped = sorted.reduce(
        (acc, notification) => {
          const group = getTimeGroup(notification.timeStamp, now);
          (acc[group] ??= []).push(notification);
          return acc;
        },
        {} as Record<TimeGroup, typeof notificationList>,
      );

      // Get time group labels from props or use defaults
      const timeGroupLabels: Record<TimeGroup, string> = {
        earlier: earlierLabel ?? DEFAULT_TIME_GROUP_LABELS.earlier,
        past7Days: past7DaysLabel ?? DEFAULT_TIME_GROUP_LABELS.past7Days,
        today: todayLabel ?? DEFAULT_TIME_GROUP_LABELS.today,
        yesterday: yesterdayLabel ?? DEFAULT_TIME_GROUP_LABELS.yesterday,
      };

      // Render notifications with prependTips for first item in each group
      return TIME_GROUP_ORDER.flatMap((group) => {
        const notifications = grouped[group];
        if (!notifications?.length) {
          return [];
        }

        return notifications.map((notification, index) => {
          const { key, ...restNotification } = notification;

          return (
            <NotificationCenter
              key={key}
              {...restNotification}
              prependTips={index === 0 ? timeGroupLabels[group] : undefined}
              reference={key}
              type="drawer"
            />
          );
        });
      });
    }

    // Return children (can be single element or array)
    return Array.isArray(children) ? children : children;
  }, [
    isEmpty,
    notificationList,
    children,
    emptyNotificationIcon,
    emptyNotificationTitle,
    earlierLabel,
    past7DaysLabel,
    todayLabel,
    yesterdayLabel,
  ]);

  return (
    <Drawer
      className={classes.drawer}
      controlBarAllRadioLabel={controlBarAllRadioLabel}
      controlBarClassName={classes.toolbar}
      controlBarCustomButtonLabel={controlBarCustomButtonLabel}
      controlBarDefaultValue={controlBarDefaultValue}
      controlBarIsEmpty={isEmpty}
      controlBarOnCustomButtonClick={controlBarOnCustomButtonClick}
      controlBarOnRadioChange={controlBarOnRadioChange}
      controlBarReadRadioLabel={controlBarReadRadioLabel}
      controlBarShow={controlBarShow}
      controlBarShowUnreadButton={controlBarShowUnreadButton}
      controlBarUnreadRadioLabel={controlBarUnreadRadioLabel}
      controlBarValue={controlBarValue}
      headerTitle={title}
      isHeaderDisplay={Boolean(title)}
      onClose={onClose}
      open={open}
      renderControlBar={renderControlBar}
      size={drawerSize}
      {...restDrawerProps}
    >
      {renderNotifications}
    </Drawer>
  );
};

export default NotificationCenterDrawer;
