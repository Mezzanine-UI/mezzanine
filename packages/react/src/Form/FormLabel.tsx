'use client';

import { forwardRef, ReactNode, useContext } from 'react';
import { formFieldClasses as classes } from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { FormControlContext } from './FormControlContext';

export interface FormLabelProps
  extends NativeElementPropsWithoutKeyAndRef<'label'> {
  remark?: ReactNode;
  remarkIcon?: ReactNode;
}

/**
 * The react component for `mezzanine` form label.
 */
const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel(props, ref) {
    const { children, className, htmlFor, remark, remarkIcon, ...rest } = props;
    const { required } = useContext(FormControlContext) || {};

    return (
      <label
        {...rest}
        ref={ref}
        className={cx(classes.label, className)}
        htmlFor={htmlFor}
      >
        <span>
          {children}
          {required && <span className={classes.asterisk}>*</span>}
        </span>
        {(remark || remarkIcon) && (
          <span className={classes.remark}>
            <span>{remark}</span>
            {remarkIcon}
          </span>
        )}
      </label>
    );
  },
);

export default FormLabel;
