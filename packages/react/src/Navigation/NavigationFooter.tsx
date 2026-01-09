import { Children, forwardRef, isValidElement, use } from 'react';
import { navigationFooterClasses as classes } from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationUserMenu from './NavigationUserMenu';
import { NavigationActivatedContext } from './context';

export interface NavigationFooterProps
  extends NativeElementPropsWithoutKeyAndRef<'footer'> {
  /**
   * Children of footer, only `NavigationUserMenu` is allowed as direct child,
   * other children will be wrapped in an icons container.
   */
  children?: React.ReactNode;
}

const resolveChildren = (children: React.ReactNode) => {
  let userMenu: React.ReactNode = null;
  const otherChildren: React.ReactNode[] = [];

  Children.map(children, (child) => {
    if (isValidElement(child) && child.type === NavigationUserMenu) {
      userMenu = child;
    } else {
      otherChildren.push(child);
    }
  });

  return { userMenu, otherChildren };
};

const NavigationFooter = forwardRef<HTMLElement, NavigationFooterProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    const { collapsed } = use(NavigationActivatedContext);

    const { userMenu, otherChildren } = resolveChildren(children);

    return (
      <footer
        {...rest}
        ref={ref}
        className={cx(classes.host, collapsed && classes.collapsed, className)}
      >
        {userMenu}
        <span className={classes.icons}>{otherChildren}</span>
      </footer>
    );
  },
);

export default NavigationFooter;
