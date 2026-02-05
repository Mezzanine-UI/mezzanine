'use client';

import { forwardRef, isValidElement, useMemo } from 'react';
import { accordionGroupClasses } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { flattenChildren } from '../utils/flatten-children';
import Accordion, { AccordionProps } from './Accordion';

export interface AccordionGroupProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The size of accordion group, which will be passed to each Accordion in the group.
   * @default 'main'
   */
  size?: 'main' | 'sub';
}

const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  function AccordionGroup(props, ref) {
    const { className, children, size, ...rest } = props;

    const childrenWithSize = useMemo(
      () =>
        flattenChildren(children).map((child) => {
          if (isValidElement(child) && child.type === Accordion) {
            return {
              ...child,
              props: {
                ...(child.props as AccordionProps),
                size,
              },
            };
          }
          return child;
        }),
      [children, size],
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(accordionGroupClasses.host, className)}
      >
        {childrenWithSize}
      </div>
    );
  },
);

export default AccordionGroup;
