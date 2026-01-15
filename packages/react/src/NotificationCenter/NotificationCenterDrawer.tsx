import { useMemo, type ChangeEventHandler, type ComponentProps, type Key, type ReactElement } from "react";

import { DrawerSize } from "@mezzanine-ui/core/drawer";
import { notificationClasses as classes } from '@mezzanine-ui/core/notification';

import { NotificationIcon, type IconDefinition } from "@mezzanine-ui/icons";

import Button from "../Button";
import Drawer, { type DrawerProps } from "../Drawer";
import Icon from "../Icon";
import Radio from "../Radio/Radio";
import RadioGroup from "../Radio/RadioGroup";
import Typography from "../Typography";
import NotificationCenter, { type NotificationData } from "./NotificationCenter";

type NotificationDataForDrawer = NotificationData & {
  reference: Key;
  type: 'drawer';
};

type NotificationCenterDrawerPropsBase = Pick<DrawerProps, 'open' | 'onClose'> & {
  /**
   * The title of the drawer.
   */
  title?: string;
  /**
   * Controls whether to display the toolbar.
   * @default true
   */
  showToolbar?: boolean;
  /**
   * The label of the all radio.
   */
  allRadioLabel?: string;
  /**
   * The label of the read radio.
   */
  readRadioLabel?: string;
  /**
   * The label of the unread radio.
   */
  unreadRadioLabel?: string;
  /**
   * The label of the custom radio.
   */
  customRadioLabel?: string;
  /**
   * The default value of the radio group.
   */
  defaultValue?: string;
  /**
   * The value of the radio group.
   */
  value?: string;
  /**
   * The size of the drawer.
   * @default 'narrow'
   */
  drawerSize?: DrawerSize;
  /**
   * The icon of the empty notification.
   */
  emptyNotificationIcon?: IconDefinition;
  /**
   * The title of the empty notification.
   */
  emptyNotificationTitle?: string;
  /**
   * Controls whether to display the unread button.
   * @default false
   */
  showUnreadButton?: boolean;
  /**
   * The callback function when the radio group value changes.
   */
  onRadioChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The callback function when the custom button is clicked.
   */
  onCustomButtonClick?: VoidFunction;
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
     * Each notification must have `reference` and `type: 'drawer'`.
     */
    notificationList: NotificationDataForDrawer[];
    children?: never;
  });

const NotificationCenterDrawer = (props: NotificationCenterDrawerProps) => {
  const {
    children,
    notificationList,
    title,
    showToolbar = true,
    allRadioLabel = '全部',
    readRadioLabel = '已讀',
    unreadRadioLabel = '未讀',
    customRadioLabel = '全部已讀',
    drawerSize = 'narrow',
    showUnreadButton = false,
    emptyNotificationIcon = NotificationIcon,
    emptyNotificationTitle = '目前沒有新的通知',
    defaultValue,
    value,
    onRadioChange,
    onCustomButtonClick,
    open,
    onClose,
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
          <Typography>
            {emptyNotificationTitle}
          </Typography>
        </div>
      );
    };

    if (isEmpty) {
      return renderEmptyNotifications();
    }

    // Check if notificationList is provided
    if (notificationList) {
      return notificationList.map((notification) => (
        <NotificationCenter
          key={notification.reference}
          {...notification}
        />
      ));
    }

    // Return children (can be single element or array)
    return Array.isArray(children) ? children : children;
  }, [isEmpty, notificationList, children, emptyNotificationIcon, emptyNotificationTitle]);

  const renderToolbar = () => {
    if (!showToolbar) {
      return null;
    }

    const radios = [];

    if (allRadioLabel) {
      radios.push(
        <Radio
          key="all"
          type="segment"
          value="all"
        >
          {allRadioLabel}
        </Radio>
      );
    }

    if (readRadioLabel) {
      radios.push(
        <Radio
          key="read"
          type="segment"
          value="read"
        >
          {readRadioLabel}
        </Radio>
      );
    }

    if (unreadRadioLabel && showUnreadButton) {
      radios.push(
        <Radio
          key="unread"
          type="segment"
          value="unread"
        >
          {unreadRadioLabel}
        </Radio>
      );
    }

    if (radios.length === 0) {
      return null;
    }

    const RadioGroupComponent = (
      <RadioGroup
        type="segment"
        size="minor"
        defaultValue={defaultValue ?? 'all'}
        value={value}
        onChange={onRadioChange}
      >
        {radios}
      </RadioGroup>
    );

    return (
      <div className={classes.toolbar}>
        {RadioGroupComponent}
        <Button
          key="custom"
          type="button"
          variant="base-ghost"
          size="minor"
          onClick={onCustomButtonClick}
          disabled={isEmpty}
        >
          {customRadioLabel}
        </Button>
      </div>
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      headerTitle={title}
      isHeaderDisplay={Boolean(title)}
      size={drawerSize}
      className={classes.drawer}
      {...restDrawerProps}
    >
      {renderToolbar()}
      {renderNotifications}
    </Drawer>
  );
};

export default NotificationCenterDrawer;
