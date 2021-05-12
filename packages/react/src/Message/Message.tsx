import {
  messageClasses as classes,
  messageIcons,
  MessageSeverity,
} from '@mezzanine-ui/core/message';
import React, {
  FC, Key, useEffect, useState,
} from 'react';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import {
  createNotifier,
  Notifier,
  NotifierData,
  NotifierConfig,
} from '../Notifier';
import { SlideFade, SlideFadeProps } from '../Transition';

export interface MessageConfigProps
  extends
  Pick<NotifierConfig, 'duration'>,
  Pick<SlideFadeProps,
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited'
  | 'easing'
  | 'direction'
  > {}

export interface MessageData
  extends
  Omit<NotifierData, 'onClose'>,
  MessageConfigProps {
  /**
   * If given, the message will be closed after the amount of time.
   * You can use `Message.config` to overwrite.
   * @default 3000
   */
  duration?: NotifierData['duration'];
  /**
   * The key of message.
   */
  reference?: Key;
  /**
   * The severity of the message.
   * @default info
   */
  severity?: MessageSeverity;
}

export interface Message
  extends
  FC<MessageData>,
  Notifier<MessageData, MessageConfigProps>,
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
    duration,
    reference,
    severity = 'info',
    onExited: onExitedProp,
    ...restTransitionProps
  } = props;
  const icon = messageIcons[severity];

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (open && duration) {
      const timer = window.setTimeout(() => {
        setOpen(false);
      }, duration);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [open, duration]);

  const onExited: SlideFadeProps['onExited'] = (node) => {
    if (onExitedProp) {
      onExitedProp(node);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Message.remove(reference!);
  };

  return (
    <SlideFade
      in={open}
      appear
      onExited={onExited}
      {...restTransitionProps}
    >
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
    </SlideFade>

  );
}) as Message;

const {
  add,
  config,
  destroy,
  remove,
} = createNotifier<MessageData, MessageConfigProps>({
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
