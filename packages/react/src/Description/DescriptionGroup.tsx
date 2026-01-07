'use client';

import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { DescriptionGroupContext } from './DescriptionGroupContext';
import { DescriptionGroupProps } from '.';

const DescriptionGroup = forwardRef<HTMLDivElement, DescriptionGroupProps>(
  function DescriptionGroup(props, ref) {
    const {
      className,
      children,
      isWrapGroup,
      orientation = 'horizontal',
      widthType = 'stretch',
    } = props;

    return (
      <DescriptionGroupContext.Provider value={{ widthType }}>
        <div
          className={cx(
            classes.groupHost,
            classes.groupOrientation(orientation),
            {
              [classes.groupWrapGroup]: isWrapGroup,
            },
            className,
          )}
          ref={ref}
        >
          {children}
        </div>
      </DescriptionGroupContext.Provider>
    );
  },
);

export default DescriptionGroup;
