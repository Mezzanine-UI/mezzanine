'use client';

import {
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
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

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const flattenedChildren = useMemo(
      () => flattenChildren(children),
      [children],
    );

    const defaultExpandedIndex = useMemo(
      () =>
        flattenedChildren.findIndex(
          (child) =>
            isValidElement(child) &&
            child.type === Accordion &&
            typeof (child.props as AccordionProps).expanded === 'undefined' &&
            !!(child.props as AccordionProps).defaultExpanded,
        ),
      [flattenedChildren],
    );

    const resolvedExpandedIndex =
      expandedIndex === null ? defaultExpandedIndex : expandedIndex;

    const handleChange = useCallback((index: number, open: boolean) => {
      setExpandedIndex(open ? index : -1);
    }, []);

    const childrenWithProps = useMemo(
      () =>
        flattenedChildren.map((child, index) => {
          if (isValidElement(child) && child.type === Accordion) {
            const accordionProps = child.props as AccordionProps;
            const extraProps: Partial<AccordionProps> = { size };

            if (exclusive) {
              const isExpandedControlled =
                typeof accordionProps.expanded !== 'undefined';

              if (!isExpandedControlled) {
                extraProps.expanded = resolvedExpandedIndex === index;
              }

              extraProps.onChange = (open: boolean) => {
                if (typeof accordionProps.onChange === 'function') {
                  accordionProps.onChange(open);
                }

                if (!isExpandedControlled) {
                  handleChange(index, open);
                }
              };
            }

            return cloneElement(child as ReactElement<AccordionProps>, {
              ...accordionProps,
              ...extraProps,
            });
          }
          return child;
        }),
      [exclusive, flattenedChildren, handleChange, resolvedExpandedIndex, size],
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
