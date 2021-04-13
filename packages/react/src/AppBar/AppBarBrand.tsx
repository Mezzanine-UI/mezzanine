import {
  forwardRef,
} from 'react';
import {
  appBarBrandClasses as classes,
} from '@mezzanine-ui/core/app-bar';
import {
  cx,
} from '../utils/cx';
import {
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';

export type AppBarBrandProps = NativeElementPropsWithoutKeyAndRef<'div'>;

const AppBarBrand = forwardRef<HTMLDivElement, AppBarBrandProps>((props, ref) => {
  const {
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      ref={ref}
      className={
        cx(
          classes.host,
          className,
        )
      }
    >
      {children}
    </div>
  );
});

export default AppBarBrand;
