import { forwardRef, ReactNode, use } from 'react';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';
import { SiderIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationIconButton from './NavigationIconButton';
import { NavigationActivatedContext } from './context';

export interface NavigationHeaderProps
  extends NativeElementPropsWithoutKeyAndRef<'header'> {
  /**
   * Custom content to render inside the header, typically an icon or logo.
   */
  children?: ReactNode;
  /**
   * The title text displayed in the header.
   */
  title: string;
}

const NavigationHeader = forwardRef<HTMLElement, NavigationHeaderProps>(
  (props, ref) => {
    const { children, className, title, ...rest } = props;

    const { collapsed, handleCollapseChange } = use(NavigationActivatedContext);

    return (
      <header
        {...rest}
        ref={ref}
        className={cx(classes.host, collapsed && classes.collapsed, className)}
      >
        <span className={classes.content}>
          {children}
          <span className={classes.title}>{title}</span>
        </span>
        <NavigationIconButton
          onClick={() => handleCollapseChange(!collapsed)}
          icon={SiderIcon}
        />
      </header>
    );
  },
);

export default NavigationHeader;
