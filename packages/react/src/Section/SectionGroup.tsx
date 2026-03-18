'use client';

import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { sectionGroupClasses as classes } from '@mezzanine-ui/core/section';
import { cx } from '../utils/cx';

export interface SectionGroupProps extends HTMLAttributes<HTMLDivElement> {
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
    const { children, className, direction = 'vertical', ...rest } = props;

    return (
      <div
        className={cx(
          classes.host,
          direction === 'horizontal' && classes.hostHorizontal,
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default SectionGroup;
