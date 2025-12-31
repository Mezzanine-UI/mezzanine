import { forwardRef, ReactNode, useState } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';

export interface NavigationUserMenuProps
  extends NativeElementPropsWithoutKeyAndRef<'button'> {
  children?: ReactNode;
  imgSrc: string;
}

const NavigationUserMenu = forwardRef<
  HTMLButtonElement,
  NavigationUserMenuProps
>((props, ref) => {
  const { children, imgSrc, className, onClick, ...rest } = props;
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <button
      {...rest}
      ref={ref}
      onClick={(e) => {
        setOpen(!open);
        onClick?.(e);
      }}
      className={cx(classes.host, open && classes.open, className)}
    >
      <span className={classes.avatar}>
        {imgError ? (
          <Icon icon={UserIcon} />
        ) : (
          <img
            alt="User avatar"
            className={classes.avatar}
            onError={() => setImgError(true)}
            src={imgSrc}
          />
        )}
      </span>
      {children && <span className={classes.userName}>{children}</span>}
      <Icon className={classes.icon} icon={ChevronDownIcon} />
    </button>
  );
});

export default NavigationUserMenu;
