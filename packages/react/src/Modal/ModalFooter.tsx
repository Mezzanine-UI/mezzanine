import { forwardRef } from 'react';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type ModalFooterProps = NativeElementPropsWithoutKeyAndRef<'div'>;

/**
 * The react component for `mezzanine` modal footer.
 */
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter(props, ref) {
    const { children, className, ...rest } = props;

    return (
      <div {...rest} ref={ref} className={cx(classes.footer, className)}>
        {children}
      </div>
    );
  },
);

export default ModalFooter;
