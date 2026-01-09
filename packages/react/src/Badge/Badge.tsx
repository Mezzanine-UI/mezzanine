import { forwardRef } from 'react';
import {
  BadgeCountVariant,
  BadgeVariant,
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import { cx } from '../utils/cx';
import { BadgeProps } from './typings';

const isCountVariant = (variant: BadgeVariant): variant is BadgeCountVariant =>
  [
    'count-alert',
    'count-inactive',
    'count-inverse',
    'count-brand',
    'count-info',
  ].includes(variant);

/**
 * The react component for `mezzanine` badge.
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const {
      children,
      count,
      className,
      overflowCount,
      text,
      variant,
      ...rest
    } = props;

    return (
      <div className={classes.container(!!children)}>
        {children}

        <span
          {...rest}
          ref={ref}
          className={cx(
            classes.host,
            classes.variant(variant),
            { [classes.hide]: isCountVariant(variant) && count === 0 },
            className,
          )}
        >
          {isCountVariant(variant)
            ? overflowCount && count > overflowCount
              ? `${overflowCount}+`
              : count
            : text}
        </span>
      </div>
    );
  },
);

export default Badge;
