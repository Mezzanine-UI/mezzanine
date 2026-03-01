import { forwardRef, ReactNode, use, useEffect, useRef, useState } from 'react';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import Dropdown, { DropdownProps } from '../Dropdown';
import Tooltip from '../Tooltip';
import { NavigationActivatedContext } from './context';

export interface NavigationUserMenuProps
  extends Omit<DropdownProps, 'children' | 'type'> {
  children?: ReactNode;
  className?: string;
  collapsedPlacement?: DropdownProps['placement'];
  imgSrc: string;
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
    collapsedPlacement = 'right-end',
    onVisibilityChange,
    ...dropdownRest
  } = rest;
  const [imgError, setImgError] = useState(false);
  const [_open, setOpen] = useState(false);

  const { collapsed } = use(NavigationActivatedContext);

  const open = openProp ?? _open;

  const userNameRef = useRef<HTMLSpanElement>(null);
  const [userNameOverflow, setUserNameOverflow] = useState(false);

  useEffect(() => {
    if (!userNameRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (userNameRef.current) {
        setUserNameOverflow(
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
      placement={collapsed ? collapsedPlacement : placement}
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
        className={cx(classes.host, open && classes.open, className)}
        ref={ref}
        type="button"
      >
        <Tooltip
          disablePortal={false}
          options={{
            placement: collapsed ? 'right' : 'top',
          }}
          title={
            (collapsed || userNameOverflow) && !open ? children : undefined
          }
        >
          {({ onMouseEnter, onMouseLeave, ref: tooltipRef }) => (
            <span
              className={classes.content}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              ref={tooltipRef}
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
                <span className={classes.userName}>
                  <span ref={userNameRef}>{children}</span>
                </span>
              )}
              <Icon className={classes.icon} icon={ChevronDownIcon} />
            </span>
          )}
        </Tooltip>
      </button>
    </Dropdown>
  );
});

export default NavigationUserMenu;
