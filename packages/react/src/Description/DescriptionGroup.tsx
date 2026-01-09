'use client';

import { forwardRef, ReactElement } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';

export interface DescriptionGroupProps {
  /**
   * Custom class name for group
   */
  className?: string;
  /**
   * Description elements to be grouped and displayed together
   */
  children: ReactElement[];
}

const DescriptionGroup = forwardRef<HTMLDivElement, DescriptionGroupProps>(
  function DescriptionGroup(props, ref) {
    const { className, children } = props;

    return (
      <div className={cx(classes.groupHost, className)} ref={ref}>
        {children}
      </div>
    );
  },
);

export default DescriptionGroup;
