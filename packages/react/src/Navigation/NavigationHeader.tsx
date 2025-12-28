import { forwardRef, ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';
import { SiderIcon } from '@mezzanine-ui/icons';
import NavigationIconButton from './NavigationIconButton';

export interface NavigationHeaderProps
  extends NativeElementPropsWithoutKeyAndRef<'header'> {
  onCollapse?: () => void;
  children?: ReactNode;
}

const NavigationHeader = forwardRef<HTMLHeadElement, NavigationHeaderProps>(
  (props, ref) => {
    const { children, className, onCollapse, ...rest } = props;

    return (
      <header {...rest} ref={ref} className={cx(classes.host, className)}>
        <span className={classes.content}>{children}</span>
        <NavigationIconButton onClick={onCollapse} icon={SiderIcon} />
      </header>
    );
  },
);

export default NavigationHeader;
