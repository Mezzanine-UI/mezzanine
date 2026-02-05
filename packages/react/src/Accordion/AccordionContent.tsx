'use client';

import { forwardRef, useContext, useMemo } from 'react';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { AccordionControlContext } from './AccordionControlContext';
import { Collapse } from '../Transition';

export interface AccordionContentProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * If true, expands the content, otherwise collapse it.
   */
  expanded?: boolean;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent(props, ref) {
    const { className, children, expanded: expandedProp, ...rest } = props;

    const {
      contentId: detailsId,
      expanded,
      titleId: summaryId,
    } = useContext(AccordionControlContext) || {};

    const ariaProps = useMemo(() => {
      if (summaryId && detailsId) {
        return {
          'aria-labelledby': summaryId,
          id: detailsId,
        };
      }

      return {};
    }, [summaryId, detailsId]);

    return (
      <Collapse style={{ width: '100%' }} in={expandedProp || expanded}>
        <div
          {...rest}
          {...ariaProps}
          ref={ref}
          className={cx(classes.content, className)}
          role="region"
        >
          {children}
        </div>
      </Collapse>
    );
  },
);

export default AccordionContent;
