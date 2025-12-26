import { forwardRef, ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';
import { SiderIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';

export interface NavigationHeaderProps
  extends NativeElementPropsWithoutKeyAndRef<'header'> {
  children?: ReactNode;
}

const NavigationHeader = forwardRef<HTMLHeadElement, NavigationHeaderProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    return (
      <header {...rest} ref={ref} className={cx(classes.host, className)}>
        <span className={classes.content}>{children}</span>
        <Icon icon={SiderIcon} className={classes.siderIcon} />
      </header>
    );
  },
);

export default NavigationHeader;
