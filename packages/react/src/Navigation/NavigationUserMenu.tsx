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
  /**
   * Accessible name for the trigger button.
   * Defaults to `children` when that is plain text — the user name is hidden
   * while the navigation is collapsed, which would otherwise leave the button
   * with only an avatar and no accessible name.
   */
  'aria-label'?: string;
  children?: ReactNode;
  className?: string;
  collapsedPlacement?: DropdownProps['placement'];
  imgSrc?: string;
  onClick?: () => void;
}

const NavigationUserMenu = forwardRef<
  HTMLButtonElement,
  NavigationUserMenuProps
>((props, ref) => {
  const {
    'aria-label': ariaLabel,
    children,
    className,
    imgSrc,
    onClick,
    ...rest
  } = props;
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
        /**
         * When the navigation is collapsed the user name is hidden, leaving the
         * button with only an avatar and a chevron — and so no accessible name.
         * Derive one from `children` when it is plain text; an explicit
         * `aria-label` from the caller still wins.
         */
        aria-label={
          ariaLabel ?? (typeof children === 'string' ? children : undefined)
        }
        className={cx(classes.host, open && classes.open, className)}
        ref={ref}
        type="button"
      >
        <Tooltip
          disablePortal={false}
          offsetMainAxis={
            collapsed
              ? 8 + 6 /* 6 is the padding of the item */
              : 8 + 8 /* 8 is the padding of the item and avatar */
          }
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
                {imgError || !imgSrc ? (
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
