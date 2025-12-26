'use client';

import { forwardRef, MouseEvent, Key, ReactNode, useCallback } from 'react';
import { navigationItemClasses as classes } from '@mezzanine-ui/core/navigation';
import { IconDefinition } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import Badge, { BadgeProps } from '../Badge';

export interface NavigationItemProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'li'>, 'onClick'> {
  /**
   * Whether the item is active.
   */
  active?: boolean;
  /**
   * Item display content.
   */
  children?: ReactNode;
  /**
   * Unique ID of the item.
   */
  key?: Key | null;
  /**
   * @ignore
   */
  eventKey?: Key | null;
  /**
   * Icon of the item.
   */
  icon?: IconDefinition;
  /**
   * Called when item is clicked.
   */
  onClick?: (key?: Key | string | null) => void;
  badge?: BadgeProps;
}

const NavigationItem = forwardRef<HTMLLIElement, NavigationItemProps>(
  (props, ref) => {
    const {
      active,
      badge,
      children,
      className,
      eventKey,
      icon,
      onClick,
      ...rest
    } = props;

    const handleClick = useCallback(
      (event: MouseEvent<HTMLLIElement>) => {
        if (onClick) {
          onClick(eventKey);
        }
      },
      [eventKey, onClick],
    );

    return (
      <li
        {...rest}
        ref={ref}
        className={cx(classes.host, active && classes.active, className)}
        role="menuitem"
        onClick={handleClick}
        onKeyDown={() => {}}
      >
        {icon && <Icon className={classes.icon} icon={icon} />}
        {children}
        {badge && (
          <Badge {...badge} className={cx(classes.badge, badge.className)} />
        )}
      </li>
    );
  },
);

export default NavigationItem;
