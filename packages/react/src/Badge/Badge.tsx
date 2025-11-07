import { forwardRef, ReactNode } from 'react';
import {
  BadgeVariant,
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type BadgeProps = NativeElementPropsWithoutKeyAndRef<'span'> & {} & {
  /**
   * If the children is number and greater than overflowCount, it will show overflowCount suffixed with a "+".
   * @default 99
   */
  overflowCount?: number;
  variant: BadgeVariant;
};

/**
 * The react component for `mezzanine` badge.
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(props, ref) {
    const {
      children: childrenProp,
      className,
      overflowCount,
      variant,
      ...rest
    } = props;

    let children: ReactNode;
    const isCount = variant.startsWith('count-');

    if (isCount && !Number.isNaN(Number(childrenProp)) && !!overflowCount) {
      const count = Number(childrenProp);

      children = count > overflowCount ? `${overflowCount}+` : count;
    } else {
      children = childrenProp;
    }

    return (
      <span
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.variant(variant),
          {
            [classes.hide]: isCount && Number(children) === 0,
          },
          className,
        )}
      >
        {children}
      </span>
    );
  },
);

export default Badge;
