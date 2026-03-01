'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  ReactElement,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { navigationOptionClasses as classes } from '@mezzanine-ui/core/navigation';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { Collapse, Fade } from '../Transition';
import {
  NavigationActivatedContext,
  NavigationOptionLevelContext,
} from './context';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Tooltip from '../Tooltip';
import { flattenChildren } from '../utils/flatten-children';
import Badge, { BadgeProps } from '../Badge';

export type NavigationOptionChild =
  | ReactElement<NavigationOptionProps>
  | ReactElement<BadgeProps>
  | false
  | null
  | undefined;

export type NavigationOptionChildren =
  | NavigationOptionChild
  | NavigationOptionChild[];
export interface NavigationOptionProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'li'>,
    'onClick' | 'onMouseEnter' | 'onMouseLeave'
  > {
  /**
   * Whether the item is active.
   */
  active?: boolean;
  /**
   * Strict children with `NavigationOption`.
   */
  children?: NavigationOptionChildren;
  /**
   * Custom component to render, it should support `href` and `onClick` props if provided.
   */
  anchorComponent?: React.ElementType;
  /**
   * Icon of the item.
   */
  icon?: IconDefinition;
  /**
   * Unique ID of the item.
   */
  id?: string;
  /**
   * Href of the item.
   */
  href?: string;
  /**
   * Set display title for sub-menu item.
   */
  title: string;
  /**
   * Open menu as default
   * @default false
   */
  defaultOpen?: boolean;
  onTriggerClick?: (path: string[], currentKey: string, href?: string) => void;
}

const NavigationOption = forwardRef<HTMLLIElement, NavigationOptionProps>(
  (props, ref) => {
    const {
      active,
      children,
      className,
      anchorComponent,
      defaultOpen,
      href,
      icon,
      id,
      onTriggerClick,
      title,
      ...rest
    } = props;

    const {
      activatedPathKey,
      activatedPath,
      collapsed,
      filterText,
      handleCollapseChange,
      setActivatedPath,
      optionsAnchorComponent,
    } = use(NavigationActivatedContext);

    const [open, setOpen] = useState<boolean>(defaultOpen ?? false);

    const GroupToggleIcon = open ? ChevronUpIcon : ChevronDownIcon;

    const { level, path: parentPath } = use(NavigationOptionLevelContext);
    const currentLevel = level + 1; // start as 1

    const uuid = useId();
    const currentKey = id || title || href || uuid;
    const currentPath = useMemo(
      () => [...parentPath, currentKey],
      [parentPath, currentKey],
    );
    const currentPathKey = currentPath.join('::');

    const Component =
      href && !children
        ? (anchorComponent ?? optionsAnchorComponent ?? 'a')
        : 'div';

    const flattenedChildren = useMemo(
      () => flattenChildren(children) as NavigationOptionChildren,
      [children],
    );

    const { badge, items } = useMemo(() => {
      let badgeComponent: ReactElement<BadgeProps> | null = null;

      const items: ReactElement<NavigationOptionProps>[] = [];

      Children.forEach(flattenedChildren, (child: NavigationOptionChildren) => {
        if (child && isValidElement(child)) {
          switch (child.type) {
            case Badge: {
              badgeComponent = child as ReactElement<BadgeProps>;
              break;
            }
            case NavigationOption: {
              items.push(child as ReactElement<NavigationOptionProps>);
              break;
            }
            default:
              console.warn(
                '[Mezzanine][NavigationOption]: NavigationOption only accepts NavigationOption or Badge as children.',
              );
          }
        }
      });

      return { badge: badgeComponent, items };
    }, [flattenedChildren]);

    // Default open if current path is activated
    useEffect(() => {
      if (activatedPathKey.startsWith(currentPathKey)) {
        setOpen(true);
      }
    }, [activatedPathKey, currentLevel, currentPathKey]);

    const [filter, setFilter] = useState(true);

    useEffect(() => {
      if (!filterText) {
        setFilter(true);

        return;
      }

      setFilter(
        (title.includes(filterText) || href?.includes(filterText)) ?? false,
      );
    }, [currentPath, filterText, href, title]);

    const titleRef = useRef<HTMLElement>(null);
    const [titleOverflow, setTitleOverflow] = useState(false);

    useEffect(() => {
      if (!titleRef.current) return;

      const checkOverflow = () => {
        if (!titleRef.current) return;

        const { scrollWidth, clientWidth } = titleRef.current;

        setTitleOverflow(scrollWidth > clientWidth);
      };

      checkOverflow();

      const resizeObserver = new ResizeObserver(checkOverflow);

      resizeObserver.observe(titleRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [title]);

    return (
      <li
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          open && classes.open,
          !children && classes.basic,
          (active ?? activatedPath?.[currentLevel - 1] === currentKey) &&
            classes.active,
          collapsed && classes.collapsed,
          !collapsed && !filter && classes.hidden,
          className,
        )}
        data-id={currentKey}
      >
        <Tooltip
          disablePortal={false}
          options={{
            placement: collapsed ? 'right' : 'top',
          }}
          title={collapsed || titleOverflow ? title : undefined}
        >
          {({ onMouseEnter, onMouseLeave, ref: tooltipChildRef }) => (
            <Component
              className={cx(classes.content, classes.level(currentLevel))}
              href={href}
              onClick={() => {
                setOpen(!open);
                onTriggerClick?.(currentPath, currentKey, href);

                if (collapsed) {
                  handleCollapseChange(false);
                }

                if (!children) setActivatedPath(currentPath);
              }}
              onKeyDown={(
                e: React.KeyboardEvent<HTMLAnchorElement | HTMLDivElement>,
              ) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(!open);

                  if (!children) setActivatedPath(currentPath);
                }
              }}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              ref={tooltipChildRef}
              role="menuitem"
              tabIndex={0}
            >
              {icon && <Icon className={classes.icon} icon={icon} />}

              <Fade ref={titleRef} in={collapsed === false || !icon}>
                <span className={classes.title}>{title}</span>
              </Fade>

              {badge}
              {children && (
                <Icon className={classes.toggleIcon} icon={GroupToggleIcon} />
              )}
            </Component>
          )}
        </Tooltip>
        {children && !collapsed && (
          <Collapse lazyMount className={cx(classes.childrenWrapper)} in={open}>
            <NavigationOptionLevelContext.Provider
              value={{
                level: currentLevel,
                path: currentPath,
              }}
            >
              <ul className={classes.group}>{items}</ul>
            </NavigationOptionLevelContext.Provider>
          </Collapse>
        )}
      </li>
    );
  },
);

export default NavigationOption;
