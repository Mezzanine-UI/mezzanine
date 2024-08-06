import { forwardRef, useContext, useMemo } from 'react';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { AccordionControlContext } from './AccordionControlContext';
import { Collapse } from '../Transition';

export interface AccordionDetailsProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * If true, expands the details, otherwise collapse it.
   */
  expanded?: boolean;
}

const AccordionDetails = forwardRef<HTMLDivElement, AccordionDetailsProps>(
  function AccordionDetails(props, ref) {
    const { className, children, expanded: expandedProp, ...rest } = props;

    const { detailsId, expanded, summaryId } =
      useContext(AccordionControlContext) || {};

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
          className={cx(
            classes.details,
            {
              [classes.detailsExpanded]: expandedProp || expanded,
            },
            className,
          )}
          role="region"
        >
          {children}
        </div>
      </Collapse>
    );
  },
);

export default AccordionDetails;
