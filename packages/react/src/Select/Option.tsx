import { forwardRef, useContext } from 'react';
import { MenuItem, MenuItemProps } from '../Menu';
import { SelectControlContext } from './SelectControlContext';

export interface OptionProps extends Omit<MenuItemProps, 'children' | 'role'> {
  /**
   * option children (often means the option name)
   */
  children: string;
  /**
   * The role of menu item.
   * @default 'option'
   */
  role?: string;
  /**
   * The value of option
   */
  value: string;
}

const Option = forwardRef<HTMLLIElement, OptionProps>(function Option(props, ref) {
  const {
    active: activeProp,
    children,
    role = 'option',
    value,
    ...rest
  } = props;

  const selectControl = useContext(SelectControlContext);

  const {
    onChange,
    value: selectedValue,
  } = selectControl || {};

  const active = Boolean(activeProp || (selectedValue ?? []).find((sv) => sv.id === value));

  return (
    <MenuItem
      {...rest}
      ref={ref}
      active={active}
      onClick={(evt) => {
        evt.stopPropagation();

        if (typeof onChange === 'function' && value) {
          onChange({
            id: value,
            name: children,
          });
        }
      }}
      role={role}
    >
      {children}
    </MenuItem>
  );
});

export default Option;
