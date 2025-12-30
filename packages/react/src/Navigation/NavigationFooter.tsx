import { Children, forwardRef, isValidElement } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationFooterClasses as classes } from '@mezzanine-ui/core/navigation';
import NavigationUserMenu from './NavigationUserMenu';

export type NavigationFooterProps =
  NativeElementPropsWithoutKeyAndRef<'footer'>;

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

    const { userMenu, otherChildren } = resolveChildren(children);

    return (
      <footer {...rest} ref={ref} className={cx(classes.host, className)}>
        {userMenu}
        <span className={classes.icons}>{otherChildren}</span>
      </footer>
    );
  },
);

export default NavigationFooter;
