'use client';

import { FC, Key, useEffect, useMemo, useState } from 'react';

import {
  messageClasses as classes,
  messageIcons,
  MessageSeverity,
  MessageSeverityMap,
} from '@mezzanine-ui/core/message';
import { CloseIcon, IconDefinition } from '@mezzanine-ui/icons';

import Icon from '../Icon';
import {
  createNotifier,
  Notifier,
  NotifierConfig,
  NotifierData,
} from '../Notifier';
import { SlideFade, SlideFadeProps } from '../Transition';
import { cx } from '../utils/cx';

export interface MessageConfigProps
  extends Pick<NotifierConfig, 'duration'>,
  Pick<
    SlideFadeProps,
    | 'onEnter'
    | 'onEntering'
    | 'onEntered'
    | 'onExit'
    | 'onExiting'
    | 'onExited'
    | 'easing'
    | 'direction'
  > { }

export interface MessageData
  extends Omit<NotifierData, 'onClose'>,
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
  /**
   * Called when user clicks the close button.
   */
  onClose?: (reference?: Key) => void;
}

export type MessageType = FC<MessageData> &
  Notifier<MessageData, MessageConfigProps> &
  Record<
    string,
    (
      message: MessageData['children'],
      props?: Omit<MessageData, 'children' | 'severity' | 'icon'>,
    ) => Key
  >;

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
    onClose: onCloseProp,
    onExited: onExitedProp,
    reference,
    severity,
    icon,
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

  const onClose = () => {
    setOpen(false);

    if (onCloseProp) {
      onCloseProp(reference);
    }
  };

  const iconNode = useMemo(() => {
    const iconNodeMap = {
      [MessageSeverityMap.Warning]: messageIcons.warning,
      [MessageSeverityMap.Error]: messageIcons.error,
      [MessageSeverityMap.Info]: messageIcons.info,
    }

    if (!severity) return (<></>);

    if (icon) {
      return (<Icon className={classes.icon} icon={icon} />);
    }

    const severityIcon = iconNodeMap[severity];

    return (<Icon className={classes.icon} icon={severityIcon} />);
  }, [severity, icon]);

  return (
    <SlideFade appear in={open} onExited={onExited} {...restTransitionProps}>
      <div
        className={cx(classes.host, severity ? classes.severity(severity) : '')}
      >
        <div className={classes.contentContainer}>
          {iconNode}
          <span className={classes.content}>{children}</span>
        </div>
        {
          severity === MessageSeverityMap.Info
            ? (
              <button type="button" onClick={onClose} className={classes.close}>
                <Icon
                  icon={CloseIcon}
                  className={classes.closeIcon}
                />
              </button>
            )
            : <></>
        }
      </div>
    </SlideFade>
  );
}) as MessageType;

const { add, config, destroy, remove } = createNotifier<
  MessageData,
  MessageConfigProps
>({
  duration: 3000,
  render: (message) => <Message {...message} key={undefined} />,
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

Message.add = add;
Message.config = config;
Message.destroy = destroy;
Message.remove = remove;

const severities = [
  {
    key: 'warning',
    icon: messageIcons.warning,
  },
  {
    key: 'error',
    icon: messageIcons.error,
  },
  {
    key: 'info',
    icon: messageIcons.info,
  },
];

const validSeverities: MessageSeverity[] = [
  'warning',
  'error',
  'info',
];

severities.forEach((severity) => {
  Message[severity.key] = (message, props) =>
    Message.add({
      ...props,
      children: message,
      severity: validSeverities.includes(severity.key as MessageSeverity)
        ? (severity.key as MessageSeverity)
        : undefined,
      icon: severity.icon,
    });
});

export default Message;
