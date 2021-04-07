import {
  forwardRef,
} from 'react';
import {
  appBarSupportClasses as classes,
} from '@mezzanine-ui/core/app-bar';
import {
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';
import {
  cx,
} from '../utils/cx';

export type AppBarSupportProps = NativeElementPropsWithoutKeyAndRef<'div'>;

const AppBarSupport = forwardRef<HTMLDivElement, AppBarSupportProps>((props, ref) => {
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

export default AppBarSupport;
