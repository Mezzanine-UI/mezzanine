'use client';

import { forwardRef, useMemo } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import DescriptionTitle from './DescriptionTitle';
import DescriptionContent from './DescriptionContent';
import Badge from '../Badge';
import { DescriptionProps } from '.';

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      className,
      contentProps,
      orientation = 'horizontal',
      titleProps,
    } = props;

    const contentComponents = useMemo(() => {
      switch (contentProps.variant) {
        case 'badge':
          return <Badge {...contentProps.badge} />;

        default:
          <DescriptionContent {...contentProps} />;
      }
    }, [contentProps]);

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
        {contentComponents}
      </div>
    );
  },
);

export default Description;
