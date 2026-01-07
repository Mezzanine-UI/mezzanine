'use client';

import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import DescriptionTitle from './DescriptionTitle';
import DescriptionContent from './DescriptionContent';
import { DescriptionProps } from '.';

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      className,
      contentProps,
      orientation = 'horizontal',
      titleProps,
    } = props;

    return (
      <div
        className={cx(
          classes.host,
          classes.orientation(orientation),
          className,
        )}
        ref={ref}
      >
        <DescriptionTitle {...titleProps} />
        <DescriptionContent {...contentProps} />
      </div>
    );
  },
);

export default Description;
