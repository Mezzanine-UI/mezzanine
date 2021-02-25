import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
} from 'react';
import { cx } from '../utils/cx';

export type ModalFooterProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * The react component for `mezzanine` modal footer.
 */
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(props, ref) {
  const {
    children,
    className,
    ...rest
  } = props;

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.footer,
        className,
      )}
    >
      {children}
    </div>
  );
});

export default ModalFooter;
