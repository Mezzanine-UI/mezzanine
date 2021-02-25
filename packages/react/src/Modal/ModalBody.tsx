import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
} from 'react';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { cx } from '../utils/cx';

export type ModalBodyProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * The react component for `mezzanine` modal body.
 */
const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(props, ref) {
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
        classes.body,
        className,
      )}
    >
      {children}
    </div>
  );
});

export default ModalBody;
