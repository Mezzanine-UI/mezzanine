import { h } from 'vue';
import type { VNode } from 'vue';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';
import { createNotifier } from '../notifier/create-notifier';
import type { NotifierKey } from '../notifier/notifier.types';
import MznNotificationCenterContainer from './notification-center-container';
import MznNotificationCenter from './notification-center.vue';
import type {
  NotificationCenterShorthandProps,
  NotificationConfigProps,
  NotificationData,
} from './notification-center.types';

const notifier = createNotifier<NotificationData, NotificationConfigProps>({
  duration: false,
  render: (data) =>
    h(MznNotificationCenter, { ...data, key: undefined, reference: data.key }),
  renderContainer: (children) =>
    h(MznNotificationCenterContainer, {
      destroy: () => notifier.destroy(),
      items: children as VNode[],
    }),
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

const { add: addNotifier, config, destroy, getConfig, remove } = notifier;

const shorthand =
  (severity: NotificationData['severity']) =>
  (props?: NotificationCenterShorthandProps): NotifierKey =>
    addNotifier({ ...props, severity, type: 'notification' });

/**
 * 以命令式呼叫的通知中心。
 *
 * `add` 只受理 `type: 'notification'` 的浮動通知；`drawer` 的清單由
 * MznNotificationCenterDrawer 自己渲染，所以 `add` 會直接回一個未使用的 key。
 * 同時最多顯示三則，超過的收在「查看更多」後面。
 *
 * @example
 * ```ts
 * import { notificationCenter } from '@mezzanine-ui/vue/notification-center';
 *
 * notificationCenter.success({ title: '儲存成功', description: '資料已更新。' });
 *
 * const key = notificationCenter.add({ severity: 'info', title: '處理中…', type: 'notification' });
 * notificationCenter.remove(key);
 * ```
 *
 * @see MznNotificationCenter 單則通知的呈現元件
 * @see MznNotificationCenterDrawer 抽屜清單模式的容器
 */
export const notificationCenter = {
  add: (notif: NotificationData & { key?: NotifierKey }): NotifierKey => {
    if (notif.type === 'drawer') {
      return 'NOT_SET';
    }

    return addNotifier(notif);
  },
  config,
  destroy,
  getConfig,
  remove,
  error: shorthand('error'),
  info: shorthand('info'),
  success: shorthand('success'),
  warning: shorthand('warning'),
};

export type NotificationCenter = typeof notificationCenter;
