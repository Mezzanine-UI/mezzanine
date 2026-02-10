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
  useState,
} from 'react';
import { navigationOverflowMenuOptionClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import {
  NavigationActivatedContext,
  NavigationOptionLevelContext,
} from './context';
import { flattenChildren } from '../utils/flatten-children';
import Badge, { BadgeProps } from '../Badge';
import NavigationOption, {
  NavigationOptionChildren,
  NavigationOptionProps,
} from './NavigationOption';

export interface NavigationOverflowMenuOptionProps
  extends NavigationOptionProps {
  onTriggerClick?: (
    path: string[],
    currentKey: string,
    href?: string,
    items?: ReactElement<NavigationOptionProps>[],
  ) => void;
}

const NavigationOverflowMenuOption = forwardRef<
  HTMLLIElement,
  NavigationOverflowMenuOptionProps
>((props, ref) => {
  const {
    active,
    children,
    className,
    anchorComponent,
    defaultOpen = false,
    href,
    icon,
    id,
    onTriggerClick,
    title,
    ...rest
  } = props;

  const [open, setOpen] = useState<boolean>(defaultOpen);

  const { level, path: parentPath } = use(NavigationOptionLevelContext);
  const currentLevel = level + 1; // start as 1

  const uuid = useId();
  const currentKey = id || title || href || uuid;
  const currentPath = useMemo(
    () => [...parentPath, currentKey],
    [parentPath, currentKey],
  );

  const {
    activatedPath,
    setActivatedPath,
    currentPathname,
    optionsAnchorComponent,
  } = use(NavigationActivatedContext);

  useEffect(() => {
    if (currentPathname === href) {
      setActivatedPath(currentPath);
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = href
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
        className,
      )}
      data-id={currentKey}
    >
      <Component
        className={cx(classes.content)}
        href={href}
        onClick={() => {
          setOpen(!open);
          onTriggerClick?.(currentPath, currentKey, href, items);

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
        role="menuitem"
        tabIndex={0}
      >
        {icon && <Icon className={classes.icon} icon={icon} />}
        <span className={classes.title}>{title}</span>
        {badge}
        {children && (
          <Icon className={classes.toggleIcon} icon={ChevronRightIcon} />
        )}
      </Component>
    </li>
  );
});

export default NavigationOverflowMenuOption;
