import {
  MessageStatus,
  messageClasses as classes,
  messageIcons,
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
   * Status of the message, controlls the styles.
   * @default info
   */
  status?: MessageStatus;
}

export interface Message
  extends
  FC<MessageData>,
  Notifier<MessageData>,
  Record<
  MessageStatus,
  (
    message: MessageData['children'],
    props?: Omit<MessageData, 'children' | 'status'>,
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
    status = 'info',
  } = props;
  const icon = messageIcons[status];

  return (
    <div
      className={cx(
        classes.host,
        classes.status(status),
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

(['success', 'warning', 'error', 'info'] as const).forEach((status) => {
  Message[status] = (message, props) => Message.add({
    ...props,
    children: message,
    status,
  });
});

export default Message;
