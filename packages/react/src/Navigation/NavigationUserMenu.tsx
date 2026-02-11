import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import Dropdown, { DropdownProps } from '../Dropdown';
import Tooltip from '../Tooltip';

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

  const userNameRef = useRef<HTMLSpanElement>(null);
  const [userNameTooltip, setUserNameTooltip] = useState(false);

  useEffect(() => {
    if (!userNameRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (userNameRef.current) {
        setUserNameTooltip(
          userNameRef.current.scrollWidth > userNameRef.current.offsetWidth,
        );
      }
    });

    resizeObserver.observe(userNameRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
        {children && (
          <Tooltip title={userNameTooltip && !open ? children : undefined}>
            {({ onMouseEnter, onMouseLeave, ref: tooltipRef }) => (
              <span
                className={classes.userName}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                ref={tooltipRef}
              >
                <span ref={userNameRef}>{children}</span>
              </span>
            )}
          </Tooltip>
        )}
        <Icon className={classes.icon} icon={ChevronDownIcon} />
      </button>
    </Dropdown>
  );
});

export default NavigationUserMenu;
