import { h } from 'vue';
import {
  messageClasses as classes,
  messageIcons,
} from '@mezzanine-ui/core/message';
import { createNotifier } from '../notifier/create-notifier';
import type { NotifierKey } from '../notifier/notifier.types';
import MznMessage from './message.vue';
import type {
  MessageConfigProps,
  MessageData,
  MessageShorthandMethod,
} from './message.types';

const notifier = createNotifier<MessageData, MessageConfigProps>({
  duration: 3000,
  maxCount: 4,
  render: (data) =>
    h(MznMessage, { ...data, key: undefined, reference: data.key }),
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

const { add, config, destroy, getConfig, remove } = notifier;

const shorthand =
  (
    severity: MessageData['severity'],
    icon?: MessageData['icon'],
    duration?: MessageData['duration'],
  ): MessageShorthandMethod =>
  (children, props) =>
    add({
      ...props,
      children,
      ...(icon ? { icon } : {}),
      severity,
      ...(duration !== undefined ? { duration } : {}),
    });

/**
 * 以命令式呼叫的訊息提示。
 *
 * 最多同時顯示 4 則，每則預設停留 3 秒；`loading` 不會自動關閉，可用同一個 key
 * 更新成其他狀態。
 *
 * @example
 * ```ts
 * import { message } from '@mezzanine-ui/vue/message';
 *
 * message.success('Saved!');
 * message.error('Something went wrong.');
 *
 * const key = message.loading('Uploading…');
 * message.success('Done!', { key });
 * ```
 *
 * @see MznMessage 單則訊息的呈現元件
 */
export const message = {
  add,
  config,
  destroy,
  getConfig,
  remove,
  error: shorthand('error', messageIcons.error),
  info: shorthand('info', messageIcons.info),
  loading: shorthand('loading', undefined, false),
  success: shorthand('success', messageIcons.success),
  warning: shorthand('warning', messageIcons.warning),
};

export type Message = typeof message;

export type { NotifierKey };
