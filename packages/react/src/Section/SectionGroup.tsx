'use client';

import { forwardRef, PropsWithChildren } from 'react';
import { sectionGroupClasses as classes } from '@mezzanine-ui/core/section';
import { cx } from '../utils/cx';

export interface SectionGroupProps {
  /**
   * Additional style for the section group container.
   */
  className?: string;
  /**
   * Layout direction of the section group.
   * @default 'vertical'
   */
  direction?: 'horizontal' | 'vertical';
}

/**
 * The react component for `mezzanine` section group.
 * Use this to compose multiple sections with consistent gap.
 */
const SectionGroup = forwardRef<HTMLDivElement, PropsWithChildren<SectionGroupProps>>(
  function SectionGroup(props, ref) {
    const { children, className, direction = 'vertical' } = props;

    return (
      <div
        className={cx(
          classes.host,
          direction === 'horizontal' && classes.hostHorizontal,
          className,
        )}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default SectionGroup;
