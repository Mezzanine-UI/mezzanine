import { forwardRef, ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';

export interface NavigationHeaderProps
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

const NavigationHeader = forwardRef<HTMLHeadElement, NavigationHeaderProps>(
  (props, ref) => {
    const { active, children, className, ...rest } = props;

    return (
      <header {...rest} ref={ref} className={cx(classes.host, className)}>
        {children}
      </header>
    );
  },
);

export default NavigationHeader;
