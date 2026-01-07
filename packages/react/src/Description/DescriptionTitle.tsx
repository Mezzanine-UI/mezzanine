'use client';

import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  DescriptionWidthType,
  descriptionClasses as classes,
} from '@mezzanine-ui/core/description';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import { Placement } from '@floating-ui/react-dom';
import Badge from '../Badge';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

interface DescriptionTitleBaseProps {
  badge?: BadgeDotVariant;
  /**
   * Custom class name for title
   */
  className?: string;
  /**
   * Title text
   */
  children: string;
  /**
   * Width type for title
   * @default 'stretch'
   */
  widthType?: DescriptionWidthType;
}

interface DescriptionTitleWithTooltip {
  icon: IconDefinition;
  tooltip: string;
  tooltipPlacement?: Placement;
}

interface DescriptionTitleWithoutTooltip {
  icon?: IconDefinition;
  tooltip?: undefined;
  tooltipPlacement?: undefined;
}

export type DescriptionTitleProps =
  | (DescriptionTitleBaseProps & DescriptionTitleWithTooltip)
  | (DescriptionTitleBaseProps & DescriptionTitleWithoutTooltip);

const DescriptionTitle = forwardRef<HTMLDivElement, DescriptionTitleProps>(
  function DescriptionTitle(props, ref) {
    const {
      badge,
      className,
      children,
      icon,
      tooltip,
      tooltipPlacement,
      widthType = 'stretch',
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
