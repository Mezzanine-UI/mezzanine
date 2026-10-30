'use client';

import { type RefAttributes, ReactElement } from 'react';
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

function DescriptionGroup({
  ref,
  ...props
}: DescriptionGroupProps & RefAttributes<HTMLDivElement>) {
  const { className, children } = props;

  return (
    <div className={cx(classes.groupHost, className)} ref={ref}>
      {children}
    </div>
  );
}

export default DescriptionGroup;
