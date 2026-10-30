import { type RefAttributes } from 'react';
import { badgeClasses as classes } from '@mezzanine-ui/core/badge';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type BadgeContainerProps = NativeElementPropsWithoutKeyAndRef<'span'>;

/**
 * @deprecated Use `Badge` component instead.
 */
function BadgeContainer({
  ref,
  ...props
}: BadgeContainerProps & RefAttributes<HTMLSpanElement>) {
  const { children, className, ...rest } = props;

  return (
    <span {...rest} ref={ref} className={cx(classes.container, className)}>
      {children}
    </span>
  );
}

export default BadgeContainer;
