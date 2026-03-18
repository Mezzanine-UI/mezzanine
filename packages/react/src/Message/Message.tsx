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
import { createNotifier, NotifierData, NotifierConfig } from '../Notifier';
import { Translate, TranslateProps } from '../Transition';
import { messageTimerController } from './MessageTimerController';

export interface MessageConfigProps
  extends Pick<NotifierConfig, 'duration'>,
    Pick<
      TranslateProps,
      | 'onEnter'
      | 'onEntering'
      | 'onEntered'
      | 'onExit'
      | 'onExiting'
      | 'onExited'
      | 'easing'
      | 'from'
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

/**
 * Props accepted by Message severity shorthand methods such as `Message.success`.
 * Includes an optional `key` to identify the message for later updates or dismissal.
 */
export type MessageShorthandProps = Omit<
  MessageData,
  'children' | 'severity' | 'icon'
> & { key?: Key };

/**
 * Signature shared by all Message severity shorthand methods.
 * @param message - The notification content.
 * @param props   - Optional configuration; mirrors {@link MessageData} minus `children`, `severity`, and `icon`.
 */
export type MessageShorthandMethod = (
  message: MessageData['children'],
  props?: MessageShorthandProps,
) => Key;

/** Static severity shorthand methods attached to the {@link Message} component. */
export interface MessageSeverityMethods {
  /** Display an error message. */
  error: MessageShorthandMethod;
  /** Display an informational message. */
  info: MessageShorthandMethod;
  /** Display a loading message that will **not** auto-close. */
  loading: MessageShorthandMethod;
  /** Display a success message. */
  success: MessageShorthandMethod;
  /** Display a warning message. */
  warning: MessageShorthandMethod;
}

/** @internal Underlying React element rendered by the Message notifier. */
const MessageFC: FC<MessageData> = (props) => {
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
  const startTimeRef = useRef<number>(0);

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

  const onExited: TranslateProps['onExited'] = (node) => {
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
    <Translate
      in={open}
      appear
      onExited={onExited}
      from="bottom"
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
    </Translate>
  );
};

const { add, config, destroy, remove } = createNotifier<
  MessageData,
  MessageConfigProps
>({
  duration: 3000,
  maxCount: 4,
  render: (message) => (
    <MessageFC {...message} reference={message.key} key={undefined} />
  ),
  setRoot: (root) => {
    root?.setAttribute('class', classes.root);
  },
});

/**
 * The react component for `mezzanine` message.
 *
 * Trigger messages imperatively via severity shorthand methods:
 *
 * @example
 * ```tsx
 * import Message from '@mezzanine-ui/react/message';
 *
 * Message.success('Saved!');
 * Message.error('Something went wrong.');
 *
 * // With custom key for later update/dismissal
 * const key = Message.loading('Uploading…');
 * Message.success('Done!', { key });
 * ```
 *
 * @see {@link MessageData} for the full set of options accepted by `Message.add`.
 */
const Message = Object.assign(MessageFC, {
  add,
  config,
  destroy,
  remove,
  error: (message: MessageData['children'], props?: MessageShorthandProps) =>
    add({
      ...props,
      children: message,
      icon: messageIcons.error,
      severity: 'error',
    }),
  info: (message: MessageData['children'], props?: MessageShorthandProps) =>
    add({
      ...props,
      children: message,
      icon: messageIcons.info,
      severity: 'info',
    }),
  loading: (message: MessageData['children'], props?: MessageShorthandProps) =>
    add({
      ...props,
      children: message,
      icon: messageIcons.loading,
      severity: 'loading',
      duration: false,
    }),
  success: (message: MessageData['children'], props?: MessageShorthandProps) =>
    add({
      ...props,
      children: message,
      icon: messageIcons.success,
      severity: 'success',
    }),
  warning: (message: MessageData['children'], props?: MessageShorthandProps) =>
    add({
      ...props,
      children: message,
      icon: messageIcons.warning,
      severity: 'warning',
    }),
});

/** Full type of the {@link Message} component including all static notification API methods. */
export type MessageType = typeof Message;

export default Message;
