'use client';

import {
  messageClasses as classes,
  messageIcons,
  MessageSeverity,
} from '@mezzanine-ui/core/message';
import { IconDefinition } from '@mezzanine-ui/icons';
import type { FC, Key } from 'react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import {
  createNotifier,
  Notifier,
  NotifierData,
  NotifierConfig,
} from '../Notifier';
import { SlideFade, SlideFadeProps } from '../Transition';
import { messageTimerController } from './MessageTimerController';

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
    > {}

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
}

export type MessageType = FC<MessageData> &
  Notifier<MessageData, MessageConfigProps> &
  Record<
    string,
    (
      message: MessageData['children'],
      props?: Omit<MessageData, 'children' | 'severity' | 'icon'> & {
        key?: Key;
      },
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
    icon,
    reference,
    severity,
    onExited: onExitedProp,
    ...restTransitionProps
  } = props;

  const [open, setOpen] = useState(true);
  const timerRef = useRef<number | null>(null);
  const remainingTimeRef = useRef<number>(duration || 0);
  const startTimeRef = useRef<number>(Date.now());

  // 清理計時器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 開始計時器
  const startTimer = useCallback(
    (time: number) => {
      clearTimer();

      if (time > 0) {
        startTimeRef.current = Date.now();
        remainingTimeRef.current = time;
        timerRef.current = window.setTimeout(() => {
          setOpen(false);
        }, time);
      }
    },
    [clearTimer],
  );

  // 暫停計時器
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimer();

      const elapsed = Date.now() - startTimeRef.current;

      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed,
      );
    }
  }, [clearTimer]);

  // 恢復計時器
  const resumeTimer = useCallback(() => {
    if (remainingTimeRef.current > 0) {
      startTimer(remainingTimeRef.current);
    }
  }, [startTimer]);

  // 初始設定計時器
  useEffect(() => {
    if (open && duration) {
      startTimer(duration);
    } else if (open && duration === false) {
      // duration 為 false 時，清除計時器（不自動關閉）
      clearTimer();
    }

    return () => {
      clearTimer();
    };
  }, [open, duration, clearTimer, startTimer]);

  // 註冊到全域控制器
  useEffect(() => {
    if (reference && duration) {
      messageTimerController.register(reference, {
        pause: pauseTimer,
        resume: resumeTimer,
      });

      return () => {
        messageTimerController.unregister(reference);
      };
    }
  }, [reference, duration, pauseTimer, resumeTimer]);

  // 清理計時器（組件卸載時）
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const onExited: SlideFadeProps['onExited'] = (node) => {
    if (onExitedProp) {
      onExitedProp(node);
    }

    if (reference) Message.remove(reference);
  };

  const handleMouseEnter = () => {
    messageTimerController.pause();
  };

  const handleMouseLeave = () => {
    messageTimerController.resume();
  };

  const handleFocus = () => {
    messageTimerController.pause();
  };

  const handleBlur = () => {
    messageTimerController.resume();
  };

  return (
    <SlideFade
      in={open}
      appear
      onExited={onExited}
      direction="up"
      {...restTransitionProps}
    >
      <div
        className={cx(classes.host, severity ? classes.severity(severity) : '')}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="status"
      >
        {icon ? (
          <Icon
            className={classes.icon}
            icon={icon}
            spin={severity === 'loading'}
          />
        ) : null}
        <span className={classes.content}>{children}</span>
      </div>
    </SlideFade>
  );
}) as MessageType;

const { add, config, destroy, remove } = createNotifier<
  MessageData,
  MessageConfigProps
>({
  duration: 3000,
  maxCount: 4,
  render: (message) => (
    <Message
      {...message}
      reference={(message as MessageData & { key: Key }).key}
      key={undefined}
    />
  ),
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
    key: 'success',
    icon: messageIcons.success,
  },
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
  {
    key: 'loading',
    icon: messageIcons.loading,
  },
];

const validSeverities: MessageSeverity[] = [
  'success',
  'warning',
  'error',
  'info',
  'loading',
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
      duration: severity.key === 'loading' ? false : props?.duration,
    });
});

export default Message;
