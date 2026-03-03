'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { navigationClasses as classes } from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationOption, { NavigationOptionProps } from './NavigationOption';
import NavigationHeader, { NavigationHeaderProps } from './NavigationHeader';
import NavigationFooter, { NavigationFooterProps } from './NavigationFooter';
import { flattenChildren } from '../utils/flatten-children';
import NavigationOptionCategory, {
  NavigationOptionCategoryProps,
} from './NavigationOptionCategory';
import Input from '../Input';
import {
  NavigationActivatedContext,
  NavigationOptionLevelContext,
  navigationOptionLevelContextDefaultValues,
} from './context';
import { useCurrentPathname } from './useCurrentPathname';
import { useVisibleItems } from './useVisibleItems';
import { NavigationOverflowMenu } from './NavigationOverflowMenu';

export type NavigationChild =
  | ReactElement<NavigationFooterProps>
  | ReactElement<NavigationHeaderProps>
  | ReactElement<NavigationOptionCategoryProps>
  | ReactElement<NavigationOptionProps>
  | null
  | undefined
  | false;

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
   * Whether to show search input
   */
  filter?: boolean;
  /**
   * Called when collapsed state changes.
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Called when a navigation option is clicked.
   */
  onOptionClick?: (activePath?: string[]) => void;
  /**
   * Custom component for rendering navigation options which have an href prop.
   */
  optionsAnchorComponent?: React.ElementType;
}

const Navigation = forwardRef<HTMLElement, NavigationProps>((props, ref) => {
  const {
    activatedPath,
    children = [],
    className,
    collapsed: collapsedProp,
    filter,
    onCollapseChange,
    onOptionClick,
    optionsAnchorComponent,
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

  const [innerActivatedPath, setInnerActivatedPath] = useState<string[]>(
    activatedPath || [],
  );
  const [activatedPathKey, setActivatedPathKey] = useState<string>(
    activatedPath ? activatedPath.join('::') : '',
  );
  const combineSetActivatedPath = useCallback(
    (newActivatedPath: string[]) => {
      onOptionClick?.(newActivatedPath);
      setInnerActivatedPath(newActivatedPath);
      setActivatedPathKey(newActivatedPath.join('::'));
    },
    [onOptionClick],
  );

  const currentPathname = useCurrentPathname();

  const flattenedChildren = useMemo(
    () => flattenChildren(children) as NavigationChildren,
    [children],
  );

  const { headerComponent, footerComponent, items, level1Items } =
    useMemo(() => {
      let headerComponent: ReactElement<NavigationHeaderProps> | null = null;
      let footerComponent: ReactElement<NavigationFooterProps> | null = null;
      const items: (
        | ReactElement<NavigationOptionCategoryProps>
        | ReactElement<NavigationOptionProps>
      )[] = [];
      const level1Items: ReactElement<NavigationOptionProps>[] = [];

      Children.forEach(flattenedChildren, (child: NavigationChild, index) => {
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
            case NavigationOptionCategory:
              level1Items.push(
                ...(child.props.children
                  ? (flattenChildren(child.props.children, -1, [
                      child.props.title || 'NavigationOptionCategory:' + index,
                    ]) as ReactElement<NavigationOptionProps>[])
                  : []),
              );
              items.push(child as ReactElement<NavigationOptionCategoryProps>);
              break;
            case NavigationOption: {
              level1Items.push(child as ReactElement<NavigationOptionProps>);
              items.push(child as ReactElement<NavigationOptionProps>);
              break;
            }
            default:
              console.warn(
                '[Mezzanine][Navigation]: Navigation only accepts NavigationOption, NavigationOptionCategory, NavigationHeader or NavigationFooter as children.',
              );
          }
        }
      });

      return { headerComponent, footerComponent, items, level1Items };
    }, [flattenedChildren]);

  const hrefActivated = useRef(false);
  // Scan level1Items and its descendants (up to level3) to find out whether href matches to determine whether to preset expansion and activatedPath
  useEffect(() => {
    if (hrefActivated.current || !currentPathname) {
      return;
    }

    const checkActivatedPathKey = (
      items: ReactElement<NavigationOptionProps>[],
      path: string[],
    ): boolean => {
      for (const item of items) {
        if (!isValidElement(item) || item.type !== NavigationOption) {
          continue;
        }

        const newKey = item.props.id || item.props.title || item.props.href;

        if (!newKey) {
          continue;
        }

        const newPath = [...path, newKey];

        if (item.props.href && item.props.href === currentPathname) {
          combineSetActivatedPath(newPath);

          return true;
        }

        if (item.props.children) {
          const flattenedChildren = flattenChildren(
            item.props.children,
          ) as ReactElement<NavigationOptionProps>[];

          if (checkActivatedPathKey(flattenedChildren, newPath)) {
            return true;
          }
        }
      }

      return false;
    };

    checkActivatedPathKey(level1Items, []);
    hrefActivated.current = true;
  }, [combineSetActivatedPath, currentPathname, level1Items]);

  const { contentRef, visibleCount } = useVisibleItems(items, collapsed);

  const { collapsedItems, collapsedMenuItems } = useMemo(() => {
    return {
      collapsedItems:
        visibleCount !== null
          ? level1Items.slice(0, visibleCount)
          : level1Items,
      collapsedMenuItems:
        visibleCount !== null ? level1Items.slice(visibleCount) : [],
    };
  }, [level1Items, visibleCount]);

  const [filterText, setFilterText] = useState('');

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
          activatedPathKey,
          collapsed,
          currentPathname,
          filterText,
          handleCollapseChange,
          setActivatedPath: combineSetActivatedPath,
          optionsAnchorComponent,
        }}
      >
        {headerComponent}
        <NavigationOptionLevelContext.Provider
          value={navigationOptionLevelContextDefaultValues}
        >
          <div ref={contentRef} className={classes.content}>
            {filter && (
              <Input
                size="sub"
                variant="search"
                className={cx(classes.searchInput)}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            )}
            <ul key={collapsed ? 'collapsed' : 'expand'}>
              {collapsed ? collapsedItems : items}

              {collapsed &&
                visibleCount !== null &&
                visibleCount < level1Items.length && (
                  <NavigationOverflowMenu items={collapsedMenuItems} />
                )}
            </ul>
          </div>
        </NavigationOptionLevelContext.Provider>
        {footerComponent}
      </NavigationActivatedContext.Provider>
    </nav>
  );
});

export default Navigation;
