'use client';

import { forwardRef } from 'react';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface NavigationOptionCategoryProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'li'>, 'onClick'> {
  title: string;
}

const NavigationOptionCategory = forwardRef<
  HTMLLIElement,
  NavigationOptionCategoryProps
>((props, ref) => {
  const { children, className, title, ...rest } = props;

  return (
    <li
      {...rest}
      ref={ref}
      className={cx(classes.host, className)}
      role="menuitem"
    >
      <span className={classes.title}>{title}</span>
      <ul>{children}</ul>
    </li>
  );
});

export default NavigationOptionCategory;
