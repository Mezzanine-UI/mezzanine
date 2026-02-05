'use client';

import { forwardRef } from 'react';
import { accordionGroupClasses } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type AccordionGroupProps = NativeElementPropsWithoutKeyAndRef<'div'>;

const AccordionGroup = forwardRef<HTMLDivElement, AccordionGroupProps>(
  function AccordionGroup(props, ref) {
    const { className, children, ...rest } = props;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(accordionGroupClasses.host, className)}
      >
        {children}
      </div>
    );
  },
);

export default AccordionGroup;
