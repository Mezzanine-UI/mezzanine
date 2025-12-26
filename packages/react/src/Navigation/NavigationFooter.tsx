import { forwardRef, ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationFooterClasses as classes } from '@mezzanine-ui/core/navigation';

export interface NavigationFooterProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'header'>, 'onClick'> {
  /**
   * Whether the item is active.
   */
  active?: boolean;
  /**
   * Item display content.
   */
  children?: ReactNode;
}

const NavigationFooter = forwardRef<HTMLHeadElement, NavigationFooterProps>(
  (props, ref) => {
    const { active, children, className, ...rest } = props;

    return (
      <header {...rest} ref={ref} className={cx(classes.host, className)}>
        {children}
      </header>
    );
  },
);

export default NavigationFooter;
