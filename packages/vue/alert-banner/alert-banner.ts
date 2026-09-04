import { h } from 'vue';
import {
  alertBannerGroupClasses,
  alertBannerIcons,
} from '@mezzanine-ui/core/alert-banner';
import type { AlertBannerSeverity } from '@mezzanine-ui/core/alert-banner';
import { createNotifier } from '../notifier/create-notifier';
import type { NotifierKey } from '../notifier/notifier.types';
import MznPortal from '../portal/portal.vue';
import MznAlertBanner from './alert-banner.vue';
import type {
  AlertBannerConfigProps,
  AlertBannerData,
} from './alert-banner.types';

type AlertBannerInternalData = AlertBannerData &
  Required<Pick<AlertBannerData, 'createdAt'>>;

type AlertBannerNotifier = AlertBannerInternalData & { key: NotifierKey };

function getPriority(severity: AlertBannerData['severity']): number {
  if (severity === 'info') {
    return 1;
  }

  return 0;
}

/** Info sinks below the rest; within a priority, the newest comes first. */
function sortAlertNotifiers(
  notifiers: AlertBannerNotifier[],
): AlertBannerNotifier[] {
  return [...notifiers].sort((a, b) => {
    const priorityDiff = getPriority(a.severity) - getPriority(b.severity);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    if (a.createdAt !== b.createdAt) {
      return b.createdAt - a.createdAt;
    }

    return 0;
  });
}

const notifier = createNotifier<
  AlertBannerInternalData,
  AlertBannerConfigProps
>({
  maxCount: undefined,
  render: ({
    createdAt: _createdAt,
    key,
    onClose,
    reference: _reference,
    ...rest
  }) =>
    h(MznAlertBanner, {
      ...rest,
      disablePortal: true,
      onClose: () => {
        onClose?.();
        notifier.remove(key);
      },
    }),
  // Every banner shares one portal and one group container, rather than each
  // portalling itself — which is what the alert layer stacks.
  renderContainer: (children) =>
    h(MznPortal, { layer: 'alert' }, () => [
      h('div', { class: alertBannerGroupClasses.host }, children),
    ]),
  sortBeforeUpdate: sortAlertNotifiers,
});

type AlertBannerShorthandProps = Omit<
  AlertBannerData,
  'message' | 'severity' | 'icon'
> & { key?: NotifierKey };

const shorthand =
  (severity: AlertBannerSeverity) =>
  (
    message: AlertBannerData['message'],
    props?: AlertBannerShorthandProps,
  ): NotifierKey =>
    alertBanner.add({
      ...props,
      icon: alertBannerIcons[severity],
      message,
      severity,
    });

/**
 * 以命令式呼叫的頁面層級警示橫幅。
 *
 * 所有橫幅共用同一個 alert layer 的群組容器；`info` 會排在其他嚴重程度之後，
 * 同一級別則新的在前。
 *
 * @example
 * ```ts
 * import { alertBanner } from '@mezzanine-ui/vue/alert-banner';
 *
 * alertBanner.error('操作失敗，請稍後再試');
 * alertBanner.info('資料已更新', { closable: true });
 * ```
 *
 * @see MznAlertBanner 單一橫幅的呈現元件
 */
export const alertBanner = {
  add: (data: AlertBannerData): NotifierKey =>
    notifier.add({
      ...data,
      createdAt: data.createdAt ?? Date.now(),
    }),
  config: notifier.config,
  destroy: notifier.destroy,
  getConfig: notifier.getConfig,
  remove: notifier.remove,
  error: shorthand('error'),
  info: shorthand('info'),
  warning: shorthand('warning'),
};

export type AlertBanner = typeof alertBanner;
