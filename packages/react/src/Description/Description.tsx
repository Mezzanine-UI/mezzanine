'use client';

import { forwardRef, useMemo } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import DescriptionTitle from './DescriptionTitle';
import DescriptionContent from './DescriptionContent';
import Badge from '../Badge';
import Progress from '../Progress';
import { DescriptionProps } from '.';

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      className,
      contentProps,
      orientation = 'horizontal',
      titleProps,
    } = props;

    const contentComponent = useMemo(() => {
      switch (contentProps.variant) {
        case 'badge':
          return <Badge {...contentProps.badge} />;

        case 'progress':
          return <Progress {...contentProps.progress} />;

        default:
          return <DescriptionContent {...contentProps} />;
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
        {contentComponent}
      </div>
    );
  },
);

export default Description;
