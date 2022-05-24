import {
  forwardRef,
  Children,
  ReactElement,
  NamedExoticComponent,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';
import {
  appBarClasses as classes,
  AppBarOrientation,
} from '@mezzanine-ui/core/app-bar';
import {
  cx,
} from '../utils/cx';
import {
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';

import AppBarBrand, {
  AppBarBrandProps,
} from './AppBarBrand';
import AppBarMain, {
  AppBarMainProps,
} from './AppBarMain';
import AppBarSupport, {
  AppBarSupportProps,
} from './AppBarSupport';

export type AppBarChild = ReactElement<
AppBarBrandProps | AppBarMainProps | AppBarSupportProps,
NamedExoticComponent>;
export type AppBarChildren = AppBarChild | AppBarChild[];

export interface AppBarProps extends
  NativeElementPropsWithoutKeyAndRef<'header'> {
  orientation?: AppBarOrientation;
  children?: AppBarChildren;
}

const componentOrders = (type: ForwardRefExoticComponent<(AppBarBrandProps | AppBarMainProps | AppBarSupportProps) & RefAttributes<HTMLDivElement>>) => {
  switch (type) {
    case AppBarBrand:
      return 1;
    case AppBarMain:
      return 2;
    case AppBarSupport:
      return 3;
    default:
  }
};

const AppBar = forwardRef<HTMLElement, AppBarProps>((props, ref) => {
  const {
    orientation = 'horizontal',
    className,
    children,
    ...rest
  } = props;

  const SortedChildren = Children
    .toArray(children)
    .sort((unknownBefore, unknownAfter) => {
      const { type: beforeType } = unknownBefore as AppBarChild;
      const { type: afterType } = unknownAfter as AppBarChild;

      const beforeOrder = componentOrders(beforeType);
      const afterOrder = componentOrders(afterType);

      if (!beforeOrder || !afterOrder) return 0;

      return beforeOrder - afterOrder;
    });

  return (
    <header
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        classes[orientation],
        className,
      )}
    >
      {SortedChildren}
    </header>
  );
});

export default AppBar;
