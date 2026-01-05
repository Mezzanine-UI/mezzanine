import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { DescriptionContentProps } from '.';

const DescriptionContent = forwardRef<HTMLDivElement, DescriptionContentProps>(
  function DescriptionContent(props, ref) {
    const { className, children } = props;

    return (
      <div className={cx(classes.contentHost, className)} ref={ref}>
        <span>{children}</span>
      </div>
    );
  },
);

export default DescriptionContent;
