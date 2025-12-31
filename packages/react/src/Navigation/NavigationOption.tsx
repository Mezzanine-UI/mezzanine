'use client';

import {
  forwardRef,
  ReactElement,
  use,
  useEffect,
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
import { useClickAway } from '../hooks/useClickAway';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import { Collapse } from '../Transition';
import {
  NavigationActivatedContext,
  NavigationOptionLevelContext,
} from './context';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type NavigationOptionChild = ReactElement<NavigationOptionProps>;

export type NavigationOptionChildren =
  | NavigationOptionChild
  | NavigationOptionChild[];
export interface NavigationOptionProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'li'>, 'onClick'> {
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
  onTriggerClick?: (path: string[]) => void;
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
      title,
      ...rest
    } = props;

    const [open, setOpen] = useState<boolean>(defaultOpen);
    const nodeRef = useRef<HTMLLIElement>(null);
    const composedNodeRef = useComposeRefs([ref, nodeRef]);

    const GroupToggleIcon = open ? ChevronUpIcon : ChevronDownIcon;

    useClickAway(
      () => {
        if (!open) {
          return;
        }

        return () => {
          setOpen(!open);
        };
      },
      nodeRef,
      [open],
    );

    const { level, path: parentPath } = use(NavigationOptionLevelContext);
    const currentLevel = level + 1;
    const currentKey = href || title || 'unknownId';
    const currentPath = useMemo(
      () => [...parentPath, currentKey],
      [parentPath, currentKey],
    );

    const { activatedPath, setActivatedPath, currentPathname } = use(
      NavigationActivatedContext,
    );

    useEffect(() => {
      if (currentPathname === href) {
        setActivatedPath(currentPath);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <li
        {...rest}
        ref={composedNodeRef}
        className={cx(
          classes.host,
          open && classes.open,
          !children && classes.basic,
          (active ?? activatedPath?.[currentLevel - 1] === currentKey) &&
            classes.active,
          className,
        )}
        data-id={currentKey}
      >
        <div
          className={cx(classes.content, classes.level(currentLevel))}
          onClick={() => {
            setOpen(!open);

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
          {children && (
            <Icon
              size={12}
              className={classes.toggleIcon}
              icon={GroupToggleIcon}
            />
          )}
        </div>
        {children && (
          <Collapse
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
              <ul className={classes.group}>{children}</ul>
            </NavigationOptionLevelContext.Provider>
          </Collapse>
        )}
      </li>
    );
  },
);

export default NavigationOption;
