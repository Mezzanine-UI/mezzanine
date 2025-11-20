'use client';

import { forwardRef, useCallback, useMemo, useState } from 'react';

import {
  inlineMessageClasses as classes,
  inlineMessageIcons,
  InlineMessageSeverity,
} from '@mezzanine-ui/core/inline-message';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

import ClearActions from '../ClearActions';
import Icon from '../Icon';
import Fade from '../Transition/Fade';
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

    return (
      <Fade
        ref={ref}
        duration={{
          enter: MOTION_DURATION.fast,
          exit: MOTION_DURATION.fast,
        }}
        easing={{
          enter: MOTION_EASING.standard,
          exit: MOTION_EASING.standard,
        }}
        in={visible}
      >
        <div
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
            <ClearActions
              onClick={handleClose}
              type="standard"
              variant="base"
            />
          ) : null}
        </div>
      </Fade>
    );
  },
);

export default InlineMessage;