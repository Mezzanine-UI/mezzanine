'use client';

import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { DescriptionGroupProps } from '.';

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
