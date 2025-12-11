'use client';

import { forwardRef, useRef, useState } from 'react';
import OverflowTooltip, { OverflowTooltipProps } from './OverflowTooltip';
import Tag from '../Tag';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';

export type OverflowCounterTagProps =
  NativeElementPropsWithoutKeyAndRef<'span'> &
    Pick<
      OverflowTooltipProps,
      | 'className'
      | 'onTagDismiss'
      | 'placement'
      | 'tags'
      | 'tagSize'
      | 'readOnly'
    > & {
      disabled?: boolean;
    };

/**
 * Compound component for OverflowTooltip and Tag with overflow-counter type.
 */
const OverflowCounterTag = forwardRef<HTMLSpanElement, OverflowCounterTagProps>(
  function OverflowCounterTag(props, ref) {
    const {
      onTagDismiss,
      tags = [],
      placement,
      tagSize,
      ...restTagProps
    } = props;

    const [open, setOpen] = useState(false);

    const triggerRef = useRef<HTMLSpanElement>(null);
    const composedTriggerRef = useComposeRefs([ref, triggerRef]);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useDocumentEvents(() => {
      const handler = (e: PointerEvent | TouchEvent) => {
        const target = e.target as HTMLElement | null;

        if (
          target === triggerRef.current ||
          target === tooltipRef.current ||
          triggerRef.current?.contains(target) ||
          tooltipRef.current?.contains(target)
        ) {
          return;
        }

        setOpen(false);
      };

      return {
        click: handler,
        touchend: handler,
      };
    });

    return (
      <>
        <Tag
          {...restTagProps}
          className={cx(
            classes.counterTagHost,
            {
              [classes.counterTagDisabled]: restTagProps.disabled,
              [classes.counterTagReadOnly]: restTagProps.readOnly,
            },
            restTagProps.className,
          )}
          count={tags.length}
          onClick={(e) => {
            setOpen((prevOpen) => !prevOpen);
            restTagProps.onClick?.(e);
          }}
          ref={composedTriggerRef}
          type="overflow-counter"
          size={tagSize}
        />

        <OverflowTooltip
          anchor={triggerRef}
          onTagDismiss={onTagDismiss}
          open={open}
          placement={placement}
          ref={tooltipRef}
          tags={tags}
          tagSize={tagSize}
          readOnly={restTagProps.readOnly}
        />
      </>
    );
  },
);

export default OverflowCounterTag;
