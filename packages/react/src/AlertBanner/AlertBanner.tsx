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
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface AlertBannerAction
  extends Omit<ButtonPropsBase, 'children'> {
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
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'title'> {
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

export type AlertBannerType = ((props: AlertBannerData) => ReactElement | null) &
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
 * The react component for `mezzanine` alert banner.
 */
export const AlertBannerComponent = forwardRef<HTMLDivElement, AlertBannerProps>(
  function AlertBanner(props, ref) {
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
    const [isExiting, setIsExiting] = useState(false);
    const [isEntering, setIsEntering] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs([ref, nodeRef]);

    const handleClose = useCallback(() => {
      setIsExiting(true);

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
      if (visible && !isExiting && nodeRef.current) {
        // Force reflow to ensure initial state is applied
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        nodeRef.current.offsetHeight;

        // Trigger entering animation in next frame
        requestAnimationFrame(() => {
          setIsEntering(true);
        });
      }
    }, [visible, isExiting]);

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
      <div
        {...restProps}
        ref={composedRef}
        aria-live="polite"
        className={cx(
          classes.host,
          classes.severity(severity),
          isExiting && classes.exiting,
          isEntering && !isExiting && classes.entering,
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
    );

    if (disablePortal) {
      return content;
    }

    return <Portal layer="alert">{content}</Portal>;
  },
);

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
      } = notifierProps as typeof notifierProps & { maxCount?: unknown; instanceKey?: unknown };

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


