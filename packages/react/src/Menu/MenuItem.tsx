import { forwardRef } from 'react';
import {
  menuItemClasses as classes,
} from '@mezzanine-ui/core/menu';
import { CheckIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';

export interface MenuItemProps extends NativeElementPropsWithoutKeyAndRef<'li'> {
  /**
   * Whether the menu item is active.
   * @default false
   */
  active?: boolean;
  /**
   * Whether the menu item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The role of menu item.
   * @default 'menuitem'
   */
  role?: string;
}

/**
 * The react component for `mezzanine` menu item.
 */
const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(props, ref) {
  const {
    active = false,
    children,
    className,
    disabled = false,
    onClick,
    role = 'menuitem',
    ...rest
  } = props;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      {...rest}
      ref={ref}
      aria-disabled={disabled}
      className={cx(
        classes.host,
        {
          [classes.active]: active,
          [classes.disabled]: disabled,
        },
        className,
      )}
      onClick={(event) => {
        if (!disabled && onClick) {
          onClick(event);
        }
      }}
      onKeyDown={() => {}}
      role={role}
    >
      <div className={classes.label}>{children}</div>
      {active && <Icon className={classes.activeIcon} icon={CheckIcon} />}
    </li>
  );
});

export default MenuItem;
