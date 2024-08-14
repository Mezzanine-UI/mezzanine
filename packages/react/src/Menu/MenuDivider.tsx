import { forwardRef } from 'react';
import { menuDividerClasses as classes } from '@mezzanine-ui/core/menu';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type MenuDividerProps = NativeElementPropsWithoutKeyAndRef<'hr'>;

/**
 * The react component for `mezzanine` menu divider.
 */
const MenuDivider = forwardRef<HTMLHRElement, MenuDividerProps>(
  function MenuDivider(props, ref) {
    const { className, ...rest } = props;

    return <hr {...rest} ref={ref} className={cx(classes.host, className)} />;
  },
);

export default MenuDivider;
