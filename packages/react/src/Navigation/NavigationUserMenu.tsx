import { forwardRef, ReactNode, useState } from 'react';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface NavigationUserMenuProps
  extends NativeElementPropsWithoutKeyAndRef<'button'> {
  children?: ReactNode;
  imgSrc: string;
}

const NavigationUserMenu = forwardRef<
  HTMLButtonElement,
  NavigationUserMenuProps
>((props, ref) => {
  const { children, className, imgSrc, onClick, ...rest } = props;
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <button
      {...rest}
      className={cx(classes.host, open && classes.open, className)}
      onClick={(e) => {
        setOpen(!open);
        onClick?.(e);
      }}
      ref={ref}
      type="button"
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
  );
});

export default NavigationUserMenu;
