'use client';

import { forwardRef, useContext } from 'react';
import {
  MenuSize,
  menuClasses as classes,
  toMenuCssVars,
} from '@mezzanine-ui/core/menu';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { MezzanineConfig } from '../Provider/context';

export interface MenuProps extends NativeElementPropsWithoutKeyAndRef<'ul'> {
  /**
   * The minimum items count in scroll container.
   * @default 4;
   */
  itemsInView?: number;
  /**
   * The custom menu max height.
   */
  maxHeight?: number;
  /**
   * The role of menu.
   * @default 'menu'
   */
  role?: string;
  /**
   * The size of menu.
   * @default 'medium'
   */
  size?: MenuSize;
}

/**
 * The react component for `mezzanine` menu.
 */
const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(props, ref) {
  const { size: globalSize } = useContext(MezzanineConfig);
  const {
    children,
    className,
    itemsInView = 4,
    maxHeight,
    role = 'menu',
    size = globalSize,
    style: styleProp,
    ...rest
  } = props;
  const cssVars = toMenuCssVars({
    itemsInView,
    maxHeight,
  });
  const style = {
    ...cssVars,
    ...styleProp,
  };

  return (
    <ul
      {...rest}
      ref={ref}
      className={cx(classes.host, classes.size(size), className)}
      role={role}
      style={style}
    >
      {children}
    </ul>
  );
});

export default Menu;
