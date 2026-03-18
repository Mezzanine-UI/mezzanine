'use client';

import type { Key, MouseEvent, ReactElement } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

import {
  alertBannerGroupClasses,
  alertBannerIcons,
  AlertBannerSeverity,
  alertBannerClasses as classes,
} from '@mezzanine-ui/core/alert-banner';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';
import Button, { ButtonPropsBase } from '../Button';
import ClearActions from '../ClearActions';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import {
  createNotifier,
  Notifier,
  NotifierConfig,
  NotifierData,
} from '../Notifier';
import Portal from '../Portal';
import { reflow } from '../Transition/reflow';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface AlertBannerAction extends Omit<ButtonPropsBase, 'children'> {
  /**
   * The text content of the button.
   */
  content?: string;
  /**
   * Callback when the button is clicked.
   */
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export type AlertBannerConfigProps = NotifierConfig;

export interface AlertBannerData
  extends Omit<NotifierData, 'onClose'>,
    AlertBannerConfigProps {
  /**
   * The action buttons to be rendered on the right side of the banner.
   * Maximum 2 actions, minimum 0 (will not display if empty).
   */
  actions?: AlertBannerAction[];
  /**
   * Whether to show the close button.
   */
  closable?: boolean;
  /**
   * @internal
   */
  createdAt?: number;
  /**
   * Custom icon. Defaults to severity icon when omitted.
   */
  icon?: IconDefinition;
  /**
   * Main message displayed in the banner.
   */
  message: string;
  /**
   * Callback when the banner is closed.
   */
  onClose?: () => void;
  /**
   * The key of alert banner.
   */
  reference?: Key;
  /**
   * The severity of the banner.
   */
  severity: AlertBannerSeverity;
}

type AlertBannerInternalData = AlertBannerData &
  Required<Pick<AlertBannerData, 'createdAt'>>;

type AlertBannerNotifier = AlertBannerInternalData & { key: Key };

function getPriority(severity: AlertBannerData['severity']) {
  if (severity === 'info') {
    return 1;
  }

  return 0;
}

function sortAlertNotifiers(notifiers: AlertBannerNotifier[]) {
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

export interface AlertBannerProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'children' | 'title'
  > {
  /**
   * The action buttons to be rendered on the right side of the banner.
   * Maximum 2 actions, minimum 0 (will not display if empty).
   */
  actions?: AlertBannerAction[];
  /**
   * Whether to show the close button.
   */
  closable?: boolean;
  /**
   * Disable portal rendering. Only used internally by grouped rendering.
   * @internal
   */
  disablePortal?: boolean;
  /**
   * Custom icon. Defaults to severity icon when omitted.
   */
  icon?: IconDefinition;
  /**
   * Main message displayed in the banner.
   */
  message: string;
  /**
   * Callback when the banner is closed.
   */
  onClose?: () => void;
  /**
   * The severity of the banner.
   */
  severity: AlertBannerSeverity;
}

export type AlertBannerType = ((
  props: AlertBannerData,
) => ReactElement | null) &
  Notifier<AlertBannerData, AlertBannerConfigProps> &
  Record<
    string,
    (
      message: AlertBannerData['message'],
      props?: Omit<AlertBannerData, 'message' | 'severity' | 'icon'> & {
        key?: Key;
      },
    ) => Key
  >;

/**
 * 頁面層級的橫幅式警示訊息元件。
 *
 * 預設透過 `Portal` 渲染至 `alert` layer，支援 `info`、`warning`、`error` 三種嚴重程度。
 * 提供最多 2 個操作按鈕與關閉按鈕，並在顯示及關閉時套用進入／離開動畫。
 * 也可透過靜態方法 `AlertBanner.info()`、`AlertBanner.warning()`、`AlertBanner.error()` 以命令式方式觸發。
 *
 * @example
 * ```tsx
 * import AlertBanner from '@mezzanine-ui/react/AlertBanner';
 *
 * // 基本用法（JSX）
 * <AlertBanner severity="info" message="系統將於今晚進行維護" />
 *
 * // 帶有操作按鈕
 * <AlertBanner
 *   severity="warning"
 *   message="您有未儲存的變更"
 *   actions={[
 *     { content: '儲存', onClick: handleSave },
 *     { content: '捨棄', onClick: handleDiscard },
 *   ]}
 * />
 *
 * // 命令式呼叫
 * AlertBanner.error('操作失敗，請稍後再試');
 * AlertBanner.info('資料已更新', { closable: true });
 * ```
 *
 * @see {@link InlineMessage} 行內訊息元件
 * @see {@link Message} 全域提示訊息元件
 */
export const AlertBannerComponent = forwardRef<
  HTMLDivElement,
  AlertBannerProps
>(function AlertBanner(props, ref) {
  const {
    actions,
    className,
    closable = true,
    disablePortal = false,
    icon,
    message,
    onClose,
    severity,
    ...rest
  } = props;
  const [visible, setVisible] = useState(true);
  const nodeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, nodeRef]);

  const handleClose = useCallback(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.style.height = `${wrapper.scrollHeight}px`;
      wrapper.style.overflow = 'hidden';
      reflow(wrapper);

      wrapper.style.transition = `height 250ms ${MOTION_EASING.exit}`;
      wrapper.style.height = '0px';
    }

    setTimeout(() => {
      setVisible(false);

      if (onClose) {
        onClose();
      }
    }, 250); // moderate duration
  }, [onClose]);

  useEffect(() => {
    if (actions && actions.length > 2) {
      console.warn('AlertBanner: actions maximum is 2');
    }
  }, [actions]);

  useEffect(() => {
    if (visible && nodeRef.current && wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const inner = nodeRef.current;

      wrapper.style.height = '0px';
      wrapper.style.overflow = 'hidden';
      reflow(wrapper);

      requestAnimationFrame(() => {
        wrapper.style.transition = `height 250ms ${MOTION_EASING.entrance}`;
        wrapper.style.height = `${inner.scrollHeight}px`;

        setTimeout(() => {
          wrapper.style.height = 'auto';
          wrapper.style.overflow = 'visible';
          wrapper.style.transition = '';
        }, 250);
      });
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const resolvedIcon = icon ?? alertBannerIcons[severity];
  const showCloseButton = closable ?? Boolean(onClose);

  const validActions = actions?.slice(0, 2) ?? []; // Maximum support 2 actions
  const hasActions = validActions.length > 0;

  const actionsArea = hasActions ? (
    <div className={classes.actions}>
      {validActions.map((action, index) => {
        const { content, onClick, ...buttonProps } = action;

        return (
          <Button
            key={index}
            onClick={onClick}
            size="minor"
            variant="inverse"
            {...buttonProps}
          >
            {content}
          </Button>
        );
      })}
    </div>
  ) : null;

  const clearActionsArea = showCloseButton ? (
    <ClearActions
      className={classes.close}
      onClick={handleClose}
      type="standard"
      variant="inverse"
    />
  ) : null;

  const {
    maxCount: _maxCount,
    instanceKey: _instanceKey,
    ...restProps
  } = rest as typeof rest & { maxCount?: unknown; instanceKey?: unknown };

  const content = (
    <div ref={wrapperRef} className={classes.wrapper}>
      <div
        {...restProps}
        ref={composedRef}
        aria-live="polite"
        className={cx(
          classes.host,
          classes.severity(severity),
          className,
        )}
        role="status"
      >
        <div className={classes.body}>
          <Icon className={classes.icon} icon={resolvedIcon} />
          <span className={classes.message}>{message}</span>
        </div>

        <div className={classes.controls}>
          {actionsArea}
          {clearActionsArea}
        </div>
      </div>
    </div>
  );

  if (disablePortal) {
    return content;
  }

  return <Portal layer="alert">{content}</Portal>;
});

const AlertBanner: AlertBannerType = ((props) => {
  const {
    message,
    reference,
    onClose: onCloseProp,
    maxCount: _maxCount,
    createdAt: _createdAt,
    ...restProps
  } = props as AlertBannerData & { instanceKey?: unknown; maxCount?: unknown };

  const onClose = useCallback(() => {
    if (onCloseProp) {
      onCloseProp();
    }

    if (reference) {
      AlertBanner.remove(reference);
    }
  }, [onCloseProp, reference]);

  return (
    <AlertBannerComponent
      {...(restProps as AlertBannerProps)}
      message={message}
      onClose={onClose}
    />
  );
}) as AlertBannerType;

function initializeAlertBannerNotifier() {
  const notifier = createNotifier<
    AlertBannerInternalData,
    AlertBannerConfigProps
  >({
    maxCount: undefined,
    render: (notifierProps) => {
      const {
        key,
        reference: _reference,
        onClose: onCloseProp,
        createdAt: _createdAt,
        ...restProps
      } = notifierProps as typeof notifierProps & {
        maxCount?: unknown;
        instanceKey?: unknown;
      };

      return (
        <AlertBannerComponent
          {...(restProps as AlertBannerProps)}
          disablePortal
          onClose={() => {
            if (onCloseProp) {
              onCloseProp();
            }

            notifier.remove(key);
          }}
        />
      );
    },
    renderContainer: (children) => (
      <Portal layer="alert">
        <div className={alertBannerGroupClasses.host}>{children}</div>
      </Portal>
    ),
    sortBeforeUpdate: sortAlertNotifiers,
  });

  return notifier;
}

const alertBannerNotifier = initializeAlertBannerNotifier();

AlertBanner.add = (notifier) =>
  alertBannerNotifier.add({
    ...notifier,
    createdAt: notifier.createdAt ?? Date.now(),
  });
AlertBanner.config = alertBannerNotifier.config;
AlertBanner.destroy = alertBannerNotifier.destroy;
AlertBanner.remove = alertBannerNotifier.remove;
AlertBanner.getConfig = alertBannerNotifier.getConfig;

const severities = [
  // support severity: info, warning, error
  {
    key: 'info',
    icon: alertBannerIcons.info,
  },
  {
    key: 'warning',
    icon: alertBannerIcons.warning,
  },
  {
    key: 'error',
    icon: alertBannerIcons.error,
  },
];

const validSeverities: AlertBannerSeverity[] = ['info', 'warning', 'error'];

severities.forEach((severity) => {
  AlertBanner[severity.key] = (message, props) =>
    AlertBanner.add({
      ...props,
      message,
      severity: validSeverities.includes(severity.key as AlertBannerSeverity)
        ? (severity.key as AlertBannerSeverity)
        : 'info',
      icon: severity.icon,
    });
});

export default AlertBanner;
