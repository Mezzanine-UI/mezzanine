import type { DrawerSize } from '@mezzanine-ui/core/drawer';
import type { DrawerProps } from '../drawer/drawer.types';
import type { NotifierKey } from '../notifier/notifier.types';
import type { NotificationData } from './notification-center.types';

export type NotificationDataForDrawer = NotificationData & {
  key: NotifierKey;
  type: 'drawer';
};

export interface NotificationCenterDrawerProps
  extends Pick<DrawerProps, 'open'> {
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
   * The description of the empty notification.
   */
  emptyNotificationDescription?: string;
  /**
   * The title of the empty notification.
   */
  emptyNotificationTitle?: string;
  /**
   * Label for the "all" filter option in the filter bar.
   */
  filterBarAllRadioLabel?: DrawerProps['filterAreaAllRadioLabel'];
  /**
   * Label for the custom action button in the filter bar.
   */
  filterBarCustomButtonLabel?: DrawerProps['filterAreaCustomButtonLabel'];
  /**
   * Default selected filter value in the filter bar.
   */
  filterBarDefaultValue?: DrawerProps['filterAreaDefaultValue'];
  /**
   * Callback fired when the custom action button is clicked.
   */
  filterBarOnCustomButtonClick?: DrawerProps['filterAreaOnCustomButtonClick'];
  /**
   * Callback fired when the filter option changes.
   */
  filterBarOnRadioChange?: DrawerProps['filterAreaOnRadioChange'];
  /**
   * Callback fired when a filter bar dropdown option is selected.
   * Only used when `filterBarOptions` is non-empty.
   */
  filterBarOnSelect?: DrawerProps['filterAreaOnSelect'];
  /**
   * Options for the filter bar dropdown.
   * When non-empty, the right-side filter area button is replaced by a dropdown
   * triggered by a `DotHorizontalIcon` icon button.
   */
  filterBarOptions?: DrawerProps['filterAreaOptions'];
  /**
   * Label for the "read" filter option in the filter bar.
   */
  filterBarReadRadioLabel?: DrawerProps['filterAreaReadRadioLabel'];
  /**
   * Whether to show the filter bar.
   */
  filterBarShow?: DrawerProps['filterAreaShow'];
  /**
   * Whether to show the "unread only" shortcut button.
   */
  filterBarShowUnreadButton?: DrawerProps['filterAreaShowUnreadButton'];
  /**
   * Label for the "unread" filter option in the filter bar.
   */
  filterBarUnreadRadioLabel?: DrawerProps['filterAreaUnreadRadioLabel'];
  /**
   * Controlled selected filter value in the filter bar.
   */
  filterBarValue?: DrawerProps['filterAreaValue'];
  /**
   * The list of notifications to render.
   * Use this when you want to pass notification data and let the component
   * render them; otherwise put the notifications in the default slot.
   * Each notification must have `key` and `type: 'drawer'`.
   */
  notificationList?: NotificationDataForDrawer[];
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
}
