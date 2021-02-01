import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { badgeClasses as classes } from '@mezzanine-ui/core/badge';
import { cx } from '../utils/cx';

export interface BadgeProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, 'color'> {
  /**
   * It `true`, ignore passed children and display as a dot.
   * @default false
   */
  dot?: boolean;
  /**
   * If the children is number and greater than overflowCount, it will show overflowCount suffixed with a "+".
   * @default 99
   */
  overflowCount?: number;
}

/**
 * The react component for `mezzanine` badge.
 */
const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  const {
    children: childrenProp,
    className,
    dot = false,
    overflowCount = 99,
    ...rest
  } = props;
  let children: ReactNode;

  if (!dot) {
    if (typeof childrenProp === 'number') {
      const count = childrenProp;

      children = count > overflowCount ? `${overflowCount}+` : count;
    } else {
      children = childrenProp;
    }
  }

  return (
    <span
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        {
          [classes.dot]: dot,
          [classes.hide]: !dot && children === 0,
        },
        className,
      )}
    >
      {children}
    </span>

  );
});

export default Badge;
