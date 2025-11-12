'use client';

import { forwardRef, useCallback, useMemo, useState } from 'react';

import {
  inlineMessageClasses as classes,
  inlineMessageIcons,
  InlineMessageSeverity,
} from '@mezzanine-ui/core/inline-message';
import { IconDefinition } from '@mezzanine-ui/icons';

import DismissButton from '../DismissButton';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface InlineMessageProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The content of the inline message value(only string is supported).
   */
  content: string;
  /**
   * The class name of the inline message element.
   */
  className?: string;
  /**
   * The icon of the inline message.
   */
  icon?: IconDefinition;
  /**
   * Called when user clicks the close button.
   */
  onClose?: () => void;
  /**
   * The inline message severity (`'info' | 'warning' | 'error'`).
   */
  severity: InlineMessageSeverity;
}

/**
 * The react component for `mezzanine` inline message.
 *
 * Use `InlineMessage` directly in your layout to display contextual feedback,
 * and provide `onClose` callback when you need to react to dismiss events.
 */
const InlineMessage = forwardRef<HTMLDivElement, InlineMessageProps>(
  function InlineMessage(props, ref) {
    const { content, className, icon, onClose, severity } = props;
    const [visible, setVisible] = useState(true);

    const handleClose = useCallback(() => {
      setVisible(false);

      if (onClose) {
        onClose();
      }
    }, [onClose]);

    const iconNode = useMemo(() => {
      if (icon) {
        return <Icon className={classes.icon} icon={icon} />;
      }

      const severityIcon = inlineMessageIcons[severity];

      return <Icon className={classes.icon} icon={severityIcon} />;
    }, [icon, severity]);

    if (!visible) {
      return null;
    }

    return (
      <div
        ref={ref}
        aria-live="polite"
        className={cx(
          classes.host,
          classes.severity(severity),
          className,
        )}
        role="status"
      >
        <div className={classes.contentContainer}>
          {iconNode}
          <span className={classes.content}>{content}</span>
        </div>
        {severity === 'info' ? (
          <DismissButton
            onClick={handleClose}
            type="standard"
            variant="base"
          />
        ) : null}
      </div>
    );
  },
);

export default InlineMessage;