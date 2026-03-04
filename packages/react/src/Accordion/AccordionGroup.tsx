'use client';

import {
  forwardRef,
  isValidElement,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { accordionGroupClasses } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { flattenChildren } from '../utils/flatten-children';
import Accordion, { AccordionProps } from './Accordion';

export interface AccordionGroupProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * If true, only one accordion can be expanded at a time.
   * @default false
   */
  exclusive?: boolean;
  /**
   * The size of accordion group, which will be passed to each Accordion in the group.
   * @default 'main'
   */
  size?: 'main' | 'sub';
}

const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  function AccordionGroup(props, ref) {
    const { className, children, exclusive = false, size, ...rest } = props;

    const [expandedIndex, setExpandedIndex] = useState<number>(-1);

    const handleChange = useCallback((index: number, open: boolean) => {
      setExpandedIndex(open ? index : -1);
    }, []);

    const childrenWithProps = useMemo(
      () =>
        flattenChildren(children).map((child, index) => {
          if (isValidElement(child) && child.type === Accordion) {
            const extraProps: Partial<AccordionProps> = { size };

            if (exclusive) {
              extraProps.expanded = expandedIndex === index;
              extraProps.onChange = (open: boolean) =>
                handleChange(index, open);
            }

            return {
              ...child,
              props: {
                ...(child.props as AccordionProps),
                ...extraProps,
              },
            };
          }
          return child;
        }),
      [children, exclusive, expandedIndex, handleChange, size],
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(accordionGroupClasses.host, className)}
      >
        {childrenWithProps}
      </div>
    );
  },
);

export default AccordionGroup;
