import {
  messageClasses as classes,
  messageIcons,
  MessageSeverity,
} from '@mezzanine-ui/core/message';
import { FC, Key } from 'react';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import {
  createNotifier,
  Notifier,
  NotifierData,
} from '../Notifier';

export interface MessageData extends NotifierData {
  /**
   * If given, the message will be closed after the amount of time.
   * You can use `Message.config` to overwrite.
   * @default 3000
   */
  duration?: NotifierData['duration'];
  /**
   * The severity of the message.
   * @default info
   */
  severity?: MessageSeverity;
}

export interface Message
  extends
  FC<MessageData>,
  Notifier<MessageData>,
  Record<
  MessageSeverity,
  (
    message: MessageData['children'],
    props?: Omit<MessageData, 'children' | 'severity'>,
  ) => Key
  > {
}

/**
 * The react component for `mezzanine` message.
 *
 * Use the API from the Message instance such as `Message.success` and `Message.error`
 * to display a notification message globally.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Message: Message = ((props) => {
  const {
    children,
    severity = 'info',
  } = props;
  const icon = messageIcons[severity];

  return (
    <div
      className={cx(
        classes.host,
        classes.severity(severity),
      )}
    >
      <Icon
        className={classes.icon}
        icon={icon}
      />
      <span className={classes.content}>
        {children}
      </span>
    </div>
  );
}) as Message;

const {
  add,
  config,
  destroy,
  remove,
} = createNotifier<MessageData>({
  duration: 3000,
  render: (message) => <Message {...message} />,
  setRoot: (root) => {
    root.setAttribute('class', classes.root);
  },
});

Message.add = add;
Message.config = config;
Message.destroy = destroy;
Message.remove = remove;

(['success', 'warning', 'error', 'info'] as const).forEach((severity) => {
  Message[severity] = (message, props) => Message.add({
    ...props,
    children: message,
    severity,
  });
});

export default Message;
