<script setup lang="ts">
import { computed, h, useSlots } from 'vue';
import type { FunctionalComponent, VNodeChild } from 'vue';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';
import { flattenChildren } from '../_internal/flatten-children';
import MznDrawer from '../drawer/drawer.vue';
import MznEmpty from '../empty/empty.vue';
import MznNotificationCenter from './notification-center.vue';
import type {
  NotificationCenterDrawerProps,
  NotificationDataForDrawer,
} from './notification-center-drawer.types';

/**
 * 通知中心的抽屜清單。
 *
 * 通知可以用 `notificationList` 交出去、由這個元件排序分組後渲染，也可以自己把
 * MznNotificationCenter 放進預設 slot。用 `notificationList` 時會依時間戳由新到
 * 舊排序，再分成今天／昨天／過去七天／更早四組，每組第一則帶上組名。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNotificationCenterDrawer } from '@mezzanine-ui/vue/notification-center';
 * <\/script>
 *
 * <template>
 *   <MznNotificationCenterDrawer
 *     :notification-list="list"
 *     :open="open"
 *     title="通知中心"
 *     @close="open = false"
 *   />
 * </template>
 * ```
 *
 * @see MznNotificationCenter 清單裡的單則通知
 */
const props = withDefaults(defineProps<NotificationCenterDrawerProps>(), {
  drawerSize: 'narrow',
  earlierLabel: undefined,
  emptyNotificationDescription: '當有新的系統通知時，將會顯示在這裡。',
  emptyNotificationTitle: '目前沒有新的通知',
  filterBarAllRadioLabel: undefined,
  filterBarCustomButtonLabel: undefined,
  filterBarDefaultValue: undefined,
  filterBarOnCustomButtonClick: undefined,
  filterBarOnRadioChange: undefined,
  filterBarOnSelect: undefined,
  filterBarOptions: undefined,
  filterBarReadRadioLabel: undefined,
  filterBarShow: undefined,
  filterBarShowUnreadButton: undefined,
  filterBarUnreadRadioLabel: undefined,
  filterBarValue: undefined,
  notificationList: undefined,
  open: undefined,
  past7DaysLabel: undefined,
  title: undefined,
  todayLabel: undefined,
  yesterdayLabel: undefined,
});

const emit = defineEmits<{
  /** Fired when the drawer asks to be closed. */
  close: [];
}>();

defineSlots<{
  /**
   * The notifications, when you want to render them yourself rather than hand
   * over a `notificationList`.
   */
  default?: () => unknown;
}>();

const slots = useSlots();

type TimeGroup = 'today' | 'yesterday' | 'past7Days' | 'earlier';

const DEFAULT_TIME_GROUP_LABELS: Record<TimeGroup, string> = {
  earlier: '更早',
  past7Days: '過去七天',
  today: '今天',
  yesterday: '昨天',
};

const TIME_GROUP_ORDER: TimeGroup[] = [
  'today',
  'yesterday',
  'past7Days',
  'earlier',
];

const isValidTime = (timestamp: number | string | undefined): boolean => {
  if (!timestamp) return false;

  return !Number.isNaN(new Date(timestamp).getTime());
};

const getValidTime = (timestamp: number | string | undefined): number =>
  isValidTime(timestamp) ? new Date(timestamp as number | string).getTime() : 0;

function getTimeGroup(
  timestamp: number | string | undefined,
  now: Date,
): TimeGroup {
  if (!isValidTime(timestamp)) return 'earlier';

  const notificationDate = new Date(timestamp as number | string);
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

  return diffInDays <= 7 ? 'past7Days' : 'earlier';
}

const isEmpty = computed((): boolean => {
  if (props.notificationList) return props.notificationList.length === 0;

  return flattenChildren(slots.default?.()).length === 0;
});

const timeGroupLabels = computed(
  (): Record<TimeGroup, string> => ({
    earlier: props.earlierLabel ?? DEFAULT_TIME_GROUP_LABELS.earlier,
    past7Days: props.past7DaysLabel ?? DEFAULT_TIME_GROUP_LABELS.past7Days,
    today: props.todayLabel ?? DEFAULT_TIME_GROUP_LABELS.today,
    yesterday: props.yesterdayLabel ?? DEFAULT_TIME_GROUP_LABELS.yesterday,
  }),
);

const notifications = computed((): VNodeChild => {
  if (isEmpty.value) {
    return h('div', { class: classes.emptyNotifications }, [
      h(MznEmpty, {
        description: props.emptyNotificationDescription,
        size: 'main',
        title: props.emptyNotificationTitle,
        type: 'notification',
      }),
    ]);
  }

  if (!props.notificationList) return slots.default?.();

  // Sort once by timestamp (newest first), then group while keeping the order.
  const sorted = [...props.notificationList].sort(
    (a, b) => getValidTime(b.timeStamp) - getValidTime(a.timeStamp),
  );
  const now = new Date();
  const grouped = sorted.reduce(
    (acc, notification) => {
      const group = getTimeGroup(notification.timeStamp, now);

      (acc[group] ??= []).push(notification);

      return acc;
    },
    {} as Record<TimeGroup, NotificationDataForDrawer[]>,
  );

  return TIME_GROUP_ORDER.flatMap((group) => {
    const groupNotifications = grouped[group];

    if (!groupNotifications?.length) return [];

    return groupNotifications.map((notification, index) => {
      const { key, ...rest } = notification;

      return h(MznNotificationCenter, {
        ...rest,
        key,
        prependTips: index === 0 ? timeGroupLabels.value[group] : undefined,
        reference: key,
        type: 'drawer',
      });
    });
  });
});

const Notifications: FunctionalComponent = () => notifications.value;
</script>

<template>
  <MznDrawer
    :class="classes.drawer"
    :filter-area-all-radio-label="filterBarAllRadioLabel"
    :filter-area-custom-button-label="filterBarCustomButtonLabel"
    :filter-area-default-value="filterBarDefaultValue"
    :filter-area-is-empty="isEmpty"
    :filter-area-on-custom-button-click="filterBarOnCustomButtonClick"
    :filter-area-on-radio-change="filterBarOnRadioChange"
    :filter-area-on-select="filterBarOnSelect"
    :filter-area-options="filterBarOptions"
    :filter-area-read-radio-label="filterBarReadRadioLabel"
    :filter-area-show="filterBarShow"
    :filter-area-show-unread-button="filterBarShowUnreadButton"
    :filter-area-unread-radio-label="filterBarUnreadRadioLabel"
    :filter-area-value="filterBarValue"
    :header-title="title"
    :is-header-display="Boolean(title)"
    :open="open"
    :size="drawerSize"
    @close="emit('close')"
  >
    <div :class="classes.notificationsContainer"><Notifications /></div>
  </MznDrawer>
</template>
