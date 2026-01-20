'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  ReactNode,
  useCallback,
} from 'react';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationOption from './NavigationOption';

export interface NavigationOptionCategoryProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'li'>, 'onClick'> {
  title: string;
}

const NavigationOptionCategory = forwardRef<
  HTMLLIElement,
  NavigationOptionCategoryProps
>((props, ref) => {
  const { children, className, title, ...rest } = props;

  const renderItemChildren = useCallback(function renderItemChildrenImpl(
    parsedChildren: ReactNode,
  ): ReactNode {
    const childArray = Children.map(parsedChildren, (child: ReactNode) => {
      if (child && isValidElement(child)) {
        switch (child.type) {
          case NavigationOption: {
            return child;
          }

          default:
            console.warn(
              '[Mezzanine][NavigationOptionCategory]: NavigationOptionCategory only accepts NavigationOption as children.',
            );
            return null;
        }
      }

      return null;
    });

    return childArray?.filter((child) => child !== null) ?? null;
  }, []);

  return (
    <li
      {...rest}
      ref={ref}
      className={cx(classes.host, className)}
      role="menuitem"
    >
      <span className={classes.title}>{title}</span>
      <ul>{renderItemChildren(children)}</ul>
    </li>
  );
});

export default NavigationOptionCategory;
