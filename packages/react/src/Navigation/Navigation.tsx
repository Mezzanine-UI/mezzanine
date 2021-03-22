import {
  forwardRef,
  Key,
  ReactElement,
  Children,
  cloneElement,
  useMemo,
} from 'react';
import {
  navigationClasses as classes,
  NavigationOrientation,
} from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationItem, { NavigationItemProps } from './NavigationItem';
import NavigationSubMenu, { NavigationSubMenuProps } from './NavigationSubMenu';
import { NavigationContext } from './NavigationContext';

export type NavigationChild = ReactElement<NavigationItemProps> | ReactElement<NavigationSubMenuProps>;
export type NavigationChildren = NavigationChild | NavigationChild[];

export interface NavigationProps extends
  Omit<NativeElementPropsWithoutKeyAndRef<'ul'>, 'onClick'> {
  /**
   * Current active key.
   */
  activeKey?: Key | null;
  /**
   * Strict children with `NavigationItem` or `NavigationSubMenu`.
   * @default []
   */
  children?: NavigationChildren;
  /**
   * Called when a navigation item is clicked.
   */
  onClick?: (key?: Key | string | null) => void;
  /**
   * Navigation orientation.
   * @default 'horizontal'
   */
  orientation?: NavigationOrientation;
}

const Navigation = forwardRef<HTMLUListElement, NavigationProps>((props, ref) => {
  const {
    activeKey,
    children = [],
    className,
    onClick,
    orientation = 'horizontal',
    ...rest
  } = props;
  const ItemChildren = useMemo(() => Children.map(
    children, (
      child: NavigationChild,
    ) => {
      switch (child.type) {
        case NavigationItem: {
          return cloneElement(
            child,
            {
              ...child.props,
              active: activeKey === child.key,
              eventKey: child.key,
              onClick,
            },
          );
        }
        case NavigationSubMenu: {
          const subMenuChildren = child.props.children as NavigationChild;

          let groupActive = false;

          const groupChildren =
          Children
            .map(
              subMenuChildren,
              (
                groupChild,
              ) => {
                const active = activeKey === groupChild.key;

                if (active) {
                  groupActive = true;
                }

                return cloneElement(
                  groupChild,
                  {
                    ...groupChild.props,
                    active,
                    eventKey: groupChild.key,
                    onClick,
                  },
                );
              },
            );

          return cloneElement(
            child,
            {
              ...child.props,
              active: groupActive,
            },
            groupChildren,
          );
        }

        default:
          break;
      }
    },
  ), [activeKey, children, onClick]);

  return (
    <ul
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        classes[orientation],
        className,
      )}
    >
      <NavigationContext.Provider
        value={{
          orientation,
        }}
      >
        {ItemChildren}
      </NavigationContext.Provider>
    </ul>
  );
});

export default Navigation;
