import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
} from 'react';
import {
  menuDividerClasses as classes,
} from '@mezzanine-ui/core/menu';
import { cx } from '../utils/cx';

export type MenuDividerProps = Omit<DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>, 'ref'>;

/**
 * The react component for `mezzanine` menu divider.
 */
const MenuDivider = forwardRef<HTMLHRElement, MenuDividerProps>(function MenuDivider(props, ref) {
  const {
    className,
    ...rest
  } = props;

  return (
    <hr
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
    />
  );
});

export default MenuDivider;
