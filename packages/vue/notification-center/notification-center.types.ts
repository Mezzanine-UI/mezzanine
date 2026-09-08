import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import type {
  NotificationSeverity,
  NotificationType,
} from '@mezzanine-ui/core/notification-center';
import type { ButtonProps } from '../button/button.types';
import type {
  NotifierConfig,
  NotifierData,
  NotifierKey,
} from '../notifier/notifier.types';
import type { SlideFrom } from '../transition/slide.types';
import type { TransitionEasing } from '../transition/transition.types';

/**
 * The transition callbacks a notification forwards to its own slide.
 *
 * React picks them off `SlideProps`, where they are props; in Vue they are
 * emits, so the ones a notification accepts as *data* are spelled out here in
 * their `onXxx` form — which is what a data object carries either way.
 */
export interface NotificationConfigProps
  extends Pick<NotifierConfig, 'duration'> {
  easing?: TransitionEasing;
  from?: SlideFrom;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  onExit?: (node: HTMLElement) => void;
  onExited?: (node: HTMLElement) => void;
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
   * If not provided, the event handler will fallback to a close function.
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
  reference?: NotifierKey;
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
  timeStamp?: number | string;
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

/** Props accepted by the severity shorthand methods such as `notificationCenter.success`. */
export type NotificationCenterShorthandProps = Omit<
  NotificationData,
  'severity'
>;

/**
 * The parity extractor looks for `<Component>Props` or `<Component>Data`;
 * React spells this one `NotificationData`, which matches neither, so the alias
 * is what lets the two contracts be compared at all.
 */
export type NotificationCenterData = NotificationData;
