import { forwardRef, useRef, useState } from 'react';
import OverflowTooltip, { OverflowTooltipProps } from './OverflowTooltip';
import Tag from '../Tag';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type OverflowCounterTagProps =
  NativeElementPropsWithoutKeyAndRef<'span'> &
    Pick<
      OverflowTooltipProps,
      'className' | 'onTagDismiss' | 'placement' | 'tags' | 'tagSize'
    >;

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
          count={tags.length}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
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
        />
      </>
    );
  },
);

export default OverflowCounterTag;
