import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { DescriptionTitleProps } from '.';

const DescriptionTitle = forwardRef<HTMLDivElement, DescriptionTitleProps>(
  function DescriptionTitle(props, ref) {
    const { className, children } = props;

    return (
      <div className={cx(classes.host, className)} ref={ref}>
        {children}
      </div>
    );
  },
);

export default DescriptionTitle;
