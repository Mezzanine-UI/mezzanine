'use client';

import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { DescriptionContext } from './DescriptionContext';
import { DescriptionProps } from '.';

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      className,
      children,
      orientation = 'horizontal',
      widthType = 'stretch',
    } = props;

    return (
      <DescriptionContext.Provider value={{ widthType }}>
        <div
          className={cx(
            classes.host,
            classes.orientation(orientation),
            className,
          )}
          ref={ref}
        >
          {children}
        </div>
      </DescriptionContext.Provider>
    );
  },
);

export default Description;
