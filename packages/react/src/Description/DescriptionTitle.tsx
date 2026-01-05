import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import Icon from '../Icon';
import Badge from '../Badge';
import { DescriptionTitleProps } from '.';

const DescriptionTitle = forwardRef<HTMLDivElement, DescriptionTitleProps>(
  function DescriptionTitle(props, ref) {
    const { badge, className, children, icon } = props;

    return (
      <div className={cx(classes.titleHost, className)} ref={ref}>
        {badge ? (
          <Badge
            variant={badge}
            text={children}
            className={classes.titleText}
          />
        ) : (
          <span className={classes.titleText}>{children}</span>
        )}
        {icon && <Icon icon={icon} size={16} />}
      </div>
    );
  },
);

export default DescriptionTitle;
