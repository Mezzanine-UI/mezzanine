import {
  messageClasses as classes,
  messageIcons,
  MessageSeverity,
} from '@mezzanine-ui/core/message';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  FC,
  Key,
  useEffect,
  useState,
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
   * message icon prefix
   */
  icon?: IconDefinition;
  /**
   * The key of message.
   */
  reference?: Key;
  /**
   * The severity of the message.
   */
  severity?: MessageSeverity;
}

export type MessageType = FC<MessageData>
& Notifier<MessageData, MessageConfigProps>
& (Record<
string,
(message: MessageData['children'], props?: Omit<MessageData, 'children' | 'severity' | 'icon'>) => Key>);

/**
 * The react component for `mezzanine` message.
 *
 * Use the API from the Message instance such as `Message.add` and `Message.success`
 * to display a notification message globally.
 */
const Message: MessageType = ((props) => {
  const {
    children,
    duration,
    icon,
    reference,
    severity,
    onExited: onExitedProp,
    ...restTransitionProps
  } = props;

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

    if (reference) Message.remove(reference);
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
          severity ? classes.severity(severity) : '',
        )}
      >
        {icon ? (
          <Icon
            className={classes.icon}
            icon={icon}
          />
        ) : null}
        <span className={classes.content}>
          {children}
        </span>
      </div>
    </SlideFade>
  );
}) as MessageType;

const {
  add,
  config,
  destroy,
  remove,
} = createNotifier<MessageData, MessageConfigProps>({
  duration: 3000,
  render: (message) => <Message {...message} />,
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

Message.add = add;
Message.config = config;
Message.destroy = destroy;
Message.remove = remove;

const severities = [{
  key: 'success',
  icon: messageIcons.success,
}, {
  key: 'warning',
  icon: messageIcons.warning,
}, {
  key: 'error',
  icon: messageIcons.error,
}, {
  key: 'info',
  icon: messageIcons.info,
}];

const validSeverities: MessageSeverity[] = ['success', 'warning', 'error', 'info'];

(severities).forEach((severity) => {
  Message[severity.key] = (message, props) => Message.add({
    ...props,
    children: message,
    severity: validSeverities.includes((severity.key as MessageSeverity))
      ? (severity.key as MessageSeverity)
      : undefined,
    icon: severity.icon,
  });
});

export default Message;
