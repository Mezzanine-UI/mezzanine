import {
  forwardRef,
  Key,
  ReactElement,
  Children,
  cloneElement,
  useCallback,
  useState,
  ReactNode,
  isValidElement,
  JSX,
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
import NavigationHeader, { NavigationHeaderProps } from './NavigationHeader';
import NavigationFooter, { NavigationFooterProps } from './NavigationFooter';
import { flattenChildren } from '../utils/flatten-children';

export type NavigationChild =
  | ReactElement<
      | NavigationItemProps
      | NavigationSubMenuProps
      | NavigationHeaderProps
      | NavigationFooterProps
    >
  | null
  | JSX.Element[];
export type NavigationChildren = NavigationChild[];

export interface NavigationProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'ul'>, 'onClick'> {
  /**
   * Current active key.
   */
  activeKey?: Key | null;
  /**
   * Strict children with `NavigationItem`, `NavigationSubMenu`, `NavigationHeader` or `NavigationFooter`.
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

const Navigation = forwardRef<HTMLUListElement, NavigationProps>(
  (props, ref) => {
    const { activeKey, children = [], className, onClick, ...rest } = props;

    const { headerComponent, footerComponent } = useMemo(() => {
      let headerComponent: ReactElement<NavigationHeaderProps> | null = null;
      let footerComponent: ReactElement<NavigationFooterProps> | null = null;

      Children.forEach(children, (child: NavigationChild) => {
        if (child && isValidElement(child)) {
          switch (child.type) {
            case NavigationHeader: {
              headerComponent = child as ReactElement<NavigationHeaderProps>;
              break;
            }
            case NavigationFooter: {
              footerComponent = child as ReactElement<NavigationFooterProps>;
              break;
            }
          }
        }
      });

      return { headerComponent, footerComponent };
    }, [children]);

    const renderItemChildren = useCallback(
      function renderItemChildrenImpl(
        parsedChildren: NavigationChildren,
      ): ReactNode {
        const childArray = Children.map(
          flattenChildren(parsedChildren) as NavigationChildren,
          (child: NavigationChild) => {
            if (child && isValidElement(child)) {
              switch (child.type) {
                case NavigationItem: {
                  const itemChild = child as ReactElement<NavigationItemProps>;

                  return cloneElement(itemChild, {
                    active:
                      itemChild.props.active || activeKey === itemChild.key,
                    eventKey: itemChild.key,
                    onClick: itemChild.props.onClick || onClick,
                  });
                }

                case NavigationSubMenu: {
                  const subMenuChild =
                    child as ReactElement<NavigationItemProps>;
                  const subMenuChildren = subMenuChild.props.children as
                    | ReactElement<NavigationItemProps>[]
                    | ReactElement<NavigationItemProps>;

                  let subMenuActive = false;

                  const groupChildren = Children.map(
                    subMenuChildren,
                    (groupChild) => {
                      const active =
                        activeKey === groupChild.key || groupChild.props.active;

                      if (active) {
                        subMenuActive = true;
                      }

                      return cloneElement(groupChild, {
                        active,
                        eventKey: groupChild.key,
                        onClick: groupChild.props.onClick || onClick,
                      });
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
                  return null;
              }
            }

            return null;
          },
        );

        return childArray?.filter((child) => child !== null) ?? null;
      },
      [activeKey, onClick],
    );

    return (
      <nav
        {...rest}
        ref={ref}
        className={cx(classes.host, classes.vertical, className)}
      >
        {headerComponent}
        <ul>{renderItemChildren(children)}</ul>
        {footerComponent}
      </nav>
    );
  },
);

export default Navigation;
