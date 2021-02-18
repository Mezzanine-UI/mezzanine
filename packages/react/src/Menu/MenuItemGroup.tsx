import {
  DetailedHTMLProps,
  forwardRef,
  LiHTMLAttributes,
  ReactNode,
} from 'react';
import {
  menuItemGroupClasses as classes,
} from '@mezzanine-ui/core/menu';
import { cx } from '../utils/cx';

export interface MenuItemGroupProps
  extends Omit<DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, 'ref'> {
  /**
   * The label of menu item group
   */
  label?: ReactNode;
}

/**
 * The react component for `mezzanine` menu item group.
 */
const MenuItemGroup = forwardRef<HTMLLIElement, MenuItemGroupProps>(function MenuItemGroup(props, ref) {
  const {
    children,
    className,
    label,
    ...rest
  } = props;

  return (
    <li
      ref={ref}
      {...rest}
      className={cx(
        classes.host,
        className,
      )}
    >
      <span className={classes.label}>{label}</span>
      <ul className={classes.items}>{children}</ul>
    </li>
  );
});

export default MenuItemGroup;
