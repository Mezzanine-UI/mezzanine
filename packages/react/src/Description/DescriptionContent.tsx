'use client';

import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { DescriptionContentProps } from '.';

const DescriptionContent = forwardRef<HTMLDivElement, DescriptionContentProps>(
  function DescriptionContent(props, ref) {
    const {
      className,
      children,
      prefix,
      size = 'main',
      suffix,
      type = 'normal',
    } = props;

    return (
      <div
        className={cx(
          classes.contentHost,
          classes.contentType(type),
          classes.contentSize(size),
          className,
        )}
        ref={ref}
      >
        {prefix}
        <span>{children}</span>
        {suffix}
      </div>
    );
  },
);

export default DescriptionContent;
