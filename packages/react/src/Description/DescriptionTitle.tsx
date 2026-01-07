'use client';

import { forwardRef, useContext } from 'react';
import { cx } from '../utils/cx';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import Badge from '../Badge';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import { DescriptionContext } from './DescriptionContext';
import { DescriptionTitleProps } from '.';

const DescriptionTitle = forwardRef<HTMLDivElement, DescriptionTitleProps>(
  function DescriptionTitle(props, ref) {
    const descriptionGroupContent = useContext(DescriptionContext);

    const {
      badge,
      className,
      children,
      icon,
      tooltip,
      tooltipPlacement,
      widthType = descriptionGroupContent?.widthType ?? 'stretch',
    } = props;

    return (
      <div
        className={cx(
          classes.titleHost,
          classes.titleWidth(widthType),
          className,
        )}
        ref={ref}
      >
        {badge ? (
          <Badge
            variant={badge}
            text={children}
            className={classes.titleText}
          />
        ) : (
          <span className={classes.titleText}>{children}</span>
        )}
        {icon ? (
          tooltip ? (
            <Tooltip
              title={tooltip}
              options={{
                placement: tooltipPlacement ?? 'top',
              }}
            >
              {({ onMouseEnter, onMouseLeave, ref }) => (
                <Icon
                  ref={ref}
                  icon={icon}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              )}
            </Tooltip>
          ) : (
            <Icon icon={icon} size={16} />
          )
        ) : null}
      </div>
    );
  },
);

export default DescriptionTitle;
