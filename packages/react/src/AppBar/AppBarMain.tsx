import {
  forwardRef,
} from 'react';
import {
  appBarMainClasses as classes,
} from '@mezzanine-ui/core/app-bar';
import {
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';
import {
  cx,
} from '../utils/cx';

export type AppBarMainProps = NativeElementPropsWithoutKeyAndRef<'div'>;
const AppBarMain = forwardRef<HTMLDivElement, AppBarMainProps>((props, ref) => {
  const {
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
    >
      {children}
    </div>
  );
});

export default AppBarMain;
