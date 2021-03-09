import { forwardRef } from 'react';
import {
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type BadgeContainerProps = NativeElementPropsWithoutKeyAndRef<'span'>;

/**
 * The react component for `mezzanine` badge container.
 */
const BadgeContainer = forwardRef<HTMLSpanElement, BadgeContainerProps>(function BadgeContainer(props, ref) {
  const {
    children,
    className,
    ...rest
  } = props;

  return (
    <span
      {...rest}
      ref={ref}
      className={cx(classes.container, className)}
    >
      {children}
    </span>
  );
});

export default BadgeContainer;
