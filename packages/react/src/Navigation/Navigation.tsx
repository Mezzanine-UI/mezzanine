'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { navigationClasses as classes } from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationOption, { NavigationOptionProps } from './NavigationOption';
import NavigationHeader, { NavigationHeaderProps } from './NavigationHeader';
import NavigationFooter, { NavigationFooterProps } from './NavigationFooter';
import { flattenChildren } from '../utils/flatten-children';
import NavigationOptionCategory from './NavigationOptionCategory';
import Input, { InputProps } from '../Input';
import {
  NavigationActivatedContext,
  NavigationOptionLevelContext,
  navigationOptionLevelContextDefaultValues,
} from './context';
import { useCurrentPathname } from './useCurrentPathname';

export type NavigationChild =
  | ReactElement<
      NavigationOptionProps | NavigationHeaderProps | NavigationFooterProps
    >
  | null
  | JSX.Element[];
export type NavigationChildren = NavigationChild | NavigationChild[];

export interface NavigationProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'ul'>, 'onClick'> {
  /**
   * Current active key.
   */
  activatedPath?: string[];
  /**
   * Strict children with `NavigationOption`, `NavigationHeader` or `NavigationFooter`.
   */
  children?: NavigationChildren;
  /**
   * Navigation display type.
   * @default false (expanded)
   */
  collapsed?: boolean;
  /**
   * Called when collapsed state changes.
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Called when a navigation option is clicked.
   */
  onOptionClick?: (activePath?: string[]) => void;
}

const Navigation = forwardRef<HTMLElement, NavigationProps>((props, ref) => {
  const {
    activatedPath,
    children = [],
    className,
    collapsed: collapsedProp,
    onOptionClick,
    onCollapseChange,
    ...rest
  } = props;
  const [collapsedState, setCollapsedState] = useState(collapsedProp || false);
  const collapsed = collapsedProp ?? collapsedState;
  const handleCollapseChange = useCallback(
    (newCollapsed: boolean) => {
      setCollapsedState(newCollapsed);
      onCollapseChange?.(newCollapsed);
    },
    [onCollapseChange],
  );

  const [innerActivatedPath, setInnerActivatedPath] = useState<string[]>([]);
  const combineSetActivatedPath = useCallback(
    (newActivatedPath: string[]) => {
      onOptionClick?.(newActivatedPath);
      setInnerActivatedPath(newActivatedPath);
    },
    [onOptionClick],
  );

  const currentPathname = useCurrentPathname();

  const flattenedChildren = useMemo(
    () => flattenChildren(children) as NavigationChildren,
    [children],
  );

  const { headerComponent, footerComponent, searchInput } = useMemo(() => {
    let headerComponent: ReactElement<NavigationHeaderProps> | null = null;
    let footerComponent: ReactElement<NavigationFooterProps> | null = null;
    let searchInput: ReactElement<InputProps> | null = null;

    Children.forEach(flattenedChildren, (child: NavigationChild) => {
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
          case Input: {
            searchInput = cloneElement(child as ReactElement<InputProps>, {
              size: 'sub',
              variant: 'search',
              className: cx(
                classes.searchInput,
                (child as ReactElement<InputProps>).props.className,
              ),
            });
            break;
          }
        }
      }
    });

    return { headerComponent, footerComponent, searchInput };
  }, [flattenedChildren]);

  const renderItemChildren = useCallback(function renderItemChildrenImpl(
    parsedChildren: NavigationChildren,
  ): ReactNode {
    const childArray = Children.map(
      parsedChildren,
      (child: NavigationChild) => {
        if (child && isValidElement(child)) {
          switch (child.type) {
            case NavigationOptionCategory:
            case NavigationOption: {
              return child;
            }

            case NavigationHeader:
            case NavigationFooter:
              // already handled in headerComponent and footerComponent
              return null;

            default:
              console.warn(
                '[Mezzanine][Navigation]: Navigation only accepts NavigationOption, NavigationOptionCategory, NavigationHeader or NavigationFooter as children.',
              );
              return null;
          }
        }

        return null;
      },
    );

    return childArray?.filter((child) => child !== null) ?? null;
  }, []);

  return (
    <nav
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        collapsed ? classes.collapsed : classes.expand,
        className,
      )}
    >
      <NavigationActivatedContext.Provider
        value={{
          activatedPath: activatedPath || innerActivatedPath,
          setActivatedPath: combineSetActivatedPath,
          currentPathname,
          collapsed,
          handleCollapseChange,
        }}
      >
        {headerComponent}
        <NavigationOptionLevelContext.Provider
          value={navigationOptionLevelContextDefaultValues}
        >
          <div className={classes.content}>
            {searchInput}
            <ul>{renderItemChildren(flattenedChildren)}</ul>
          </div>
        </NavigationOptionLevelContext.Provider>
        {footerComponent}
      </NavigationActivatedContext.Provider>
    </nav>
  );
});

export default Navigation;
