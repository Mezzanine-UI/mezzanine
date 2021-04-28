import {
  forwardRef,
  ReactNode,
} from 'react';
import {
  pageFooterClasses as classes,
} from '@mezzanine-ui/core/page-footer';
import { cx } from '../utils/cx';
import ConfirmActions, { ConfirmActionsProps } from '../ConfirmActions';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface PageFooterProps
  extends
  NativeElementPropsWithoutKeyAndRef<'footer'>,
  Pick<
  ConfirmActionsProps,
  | 'cancelButtonProps'
  | 'cancelText'
  | 'confirmButtonProps'
  | 'confirmText'
  | 'danger'
  | 'loading'
  | 'onCancel'
  | 'onConfirm'
  > {
  /**
   * The className of action wrapper.
   */
  actionClassName?: string;
  /**
   * The action element in the left.
   */
  children?: ReactNode;
}

const PageFooter = forwardRef<HTMLElement, PageFooterProps>(function PageFooter(props, ref) {
  const {
    className,
    actionClassName,
    cancelButtonProps,
    cancelText,
    children,
    danger,
    loading,
    confirmButtonProps,
    confirmText,
    onCancel,
    onConfirm,
    ...rest
  } = props;

  return (
    <footer
      ref={ref}
      {...rest}
      className={cx(
        classes.host,
        className,
      )}
    >
      <div className={actionClassName}>
        {children}
      </div>
      <ConfirmActions
        cancelText={cancelText}
        confirmText={confirmText}
        danger={danger}
        loading={loading}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </footer>
  );
});

export default PageFooter;
