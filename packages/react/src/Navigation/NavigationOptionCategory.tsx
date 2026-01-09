'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';
import { navigationOptionCategoryClasses as classes } from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationOption, { NavigationOptionProps } from './NavigationOption';

export interface NavigationOptionCategoryProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'li'>, 'onClick'> {
  title: string;
  collapsed?: boolean;
}

const NavigationOptionCategory = forwardRef<
  HTMLLIElement,
  NavigationOptionCategoryProps
>((props, ref) => {
  const { children, className, collapsed, title, ...rest } = props;

  const renderItemChildren = useCallback(
    function renderItemChildrenImpl(parsedChildren: ReactNode): ReactNode {
      const childArray = Children.map(parsedChildren, (child: ReactNode) => {
        if (child && isValidElement(child)) {
          switch (child.type) {
            case NavigationOption: {
              return cloneElement(
                child as ReactElement<NavigationOptionProps>,
                { collapsed },
              );
            }

            default:
              return null;
          }
        }

        return null;
      });

      return childArray?.filter((child) => child !== null) ?? null;
    },
    [collapsed],
  );

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
