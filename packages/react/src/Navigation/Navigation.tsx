import {
  forwardRef,
  Key,
  ReactElement,
  Children,
  cloneElement,
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

export type NavigationChild = ReactElement<NavigationItemProps | NavigationSubMenuProps>;
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
  const ItemChildren = Children.map(
    children, (
      child: NavigationChild,
    ) => {
      switch (child.type) {
        case NavigationItem: {
          const itemChild = child as ReactElement<NavigationItemProps>;

          return cloneElement(
            itemChild,
            {
              active: itemChild.props.active || activeKey === itemChild.key,
              eventKey: itemChild.key,
              onClick: itemChild.props.onClick || onClick,
            },
          );
        }
        case NavigationSubMenu: {
          const subMenuChild = child as ReactElement<NavigationItemProps>;
          const subMenuChildren =
          child.props.children as ReactElement<NavigationItemProps>[] | ReactElement<NavigationItemProps>;

          let subMenuActive = false;

          const groupChildren =
          Children
            .map(
              subMenuChildren,
              (
                groupChild,
              ) => {
                const active = activeKey === groupChild.key;

                if (active) {
                  subMenuActive = true;
                }

                return cloneElement(
                  groupChild,
                  {
                    active: groupChild.props.active || active,
                    eventKey: groupChild.key,
                    onClick: groupChild.props.onClick || onClick,
                  },
                );
              },
            );

          return cloneElement(
            subMenuChild,
            {
              active: subMenuChild.props.active || subMenuActive,
            },
            groupChildren,
          );
        }

        default:
      }
    },
  );

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
