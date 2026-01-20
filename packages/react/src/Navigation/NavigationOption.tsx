'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  ReactElement,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { navigationOptionClasses as classes } from '@mezzanine-ui/core/navigation';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { Collapse } from '../Transition';
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
   * Icon of the item.
   */
  icon?: IconDefinition;
  /**
   * Unique ID of the item.
   */
  href?: string;
  /**
   * Set display title for sub-menu item.
   */
  title?: string;
  /**
   * Open menu as default
   * @default false
   */
  defaultOpen?: boolean;
  onTriggerClick?: (path: string[], href: string) => void;
}

const NavigationOption = forwardRef<HTMLLIElement, NavigationOptionProps>(
  (props, ref) => {
    const {
      active,
      children,
      className,
      defaultOpen = false,
      href,
      icon,
      onTriggerClick,
      title,
      ...rest
    } = props;

    const [open, setOpen] = useState<boolean>(defaultOpen);

    const GroupToggleIcon = open ? ChevronUpIcon : ChevronDownIcon;

    const { level, path: parentPath } = use(NavigationOptionLevelContext);
    const currentLevel = level + 1;
    const currentKey = href || title || 'unknownId';
    const currentPath = useMemo(
      () => [...parentPath, currentKey],
      [parentPath, currentKey],
    );

    const {
      activatedPath,
      setActivatedPath,
      currentPathname,
      collapsed,
      handleCollapseChange,
    } = use(NavigationActivatedContext);

    useEffect(() => {
      if (currentPathname === href) {
        setActivatedPath(currentPath);
        setOpen(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Component = href ? 'a' : 'div';

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
          className,
        )}
        data-id={currentKey}
      >
        <Tooltip
          options={{
            placement: 'right',
          }}
          title={collapsed ? title : undefined}
        >
          {({ onMouseEnter, onMouseLeave, ref: tooltipChildRef }) => (
            <Component
              className={cx(classes.content, classes.level(currentLevel))}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              ref={tooltipChildRef}
              href={href}
              onClick={() => {
                setOpen(!open);
                onTriggerClick?.(currentPath, href || '');

                if (collapsed) {
                  handleCollapseChange(false);
                }

                if (!children) setActivatedPath([...parentPath, currentKey]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen(!open);

                  if (!children) setActivatedPath([...parentPath, currentKey]);
                }
              }}
              role="menuitem"
              tabIndex={0}
            >
              {icon && <Icon className={classes.icon} icon={icon} />}
              <span className={classes.title}>{title}</span>
              {badge}
              {children && (
                <Icon className={classes.toggleIcon} icon={GroupToggleIcon} />
              )}
            </Component>
          )}
        </Tooltip>
        {children && !collapsed && (
          <Collapse
            className={classes.childrenWrapper}
            style={{
              width: '100%',
            }}
            in={!!open}
          >
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
