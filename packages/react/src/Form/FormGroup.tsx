'use client';

import { forwardRef } from 'react';
import { formGroupClasses as classes } from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface FormGroupProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Additional className to apply to the fields' container.
   */
  fieldsContainerClassName?: string;
  /**
   * The title text for the form group.
   */
  title: string;
}

/**
 * The React component for `mezzanine` form group.
 */
const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  function FormGroup(props, ref) {
    const {
      children,
      className,
      fieldsContainerClassName,
      title,
      ...rest
    } = props;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(classes.host, className)}
      >
        <div className={classes.title}>{title}</div>
        <div className={cx(classes.fieldsContainer, fieldsContainerClassName)}>
          {children}
        </div>
      </div>
    );
  },
);

export default FormGroup;
