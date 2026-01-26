import { forwardRef, ReactNode, useState } from 'react';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import Dropdown, { DropdownProps } from '../Dropdown';

export interface NavigationUserMenuProps
  extends Omit<DropdownProps, 'children' | 'type'> {
  children?: ReactNode;
  className?: string;
  imgSrc?: string;
  onClick?: () => void;
}

const NavigationUserMenu = forwardRef<
  HTMLButtonElement,
  NavigationUserMenuProps
>((props, ref) => {
  // shared props

  const { children, className, imgSrc, onClick, ...rest } = props;
  const {
    open: openProp,
    onClose,
    placement = 'top-end',
    onVisibilityChange,
    ...dropdownRest
  } = rest;
  const [imgError, setImgError] = useState(false);
  const [_open, setOpen] = useState(false);

  const open = openProp ?? _open;

  return (
    <Dropdown
      {...dropdownRest}
      open={open}
      placement={placement}
      onVisibilityChange={() => {
        setOpen(!open);
        onVisibilityChange?.(!open);
        onClick?.();
      }}
      onClose={() => {
        setOpen(false);
        onClose?.();
      }}
    >
      <button
        type="button"
        ref={ref}
        className={cx(classes.host, open && classes.open, className)}
      >
        <span className={classes.avatar}>
          {imgError ? (
            <Icon icon={UserIcon} />
          ) : (
            <img
              alt="User avatar"
              className={classes.avatar}
              src={imgSrc}
              onError={() => setImgError(true)}
            />
          )}
        </span>
        {children && <span className={classes.userName}>{children}</span>}
        <Icon className={classes.icon} icon={ChevronDownIcon} />
      </button>
    </Dropdown>
  );
});

export default NavigationUserMenu;
