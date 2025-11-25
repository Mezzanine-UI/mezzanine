'use client';

import { forwardRef } from 'react';
import {
  formFieldClasses as classes,
  formHintIcons,
} from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';

export type FormHintTextProps = NativeElementPropsWithoutKeyAndRef<'span'> & {
  /**
   * The severity of form message.
   */
  severity?: keyof typeof formHintIcons | undefined;
};

/**
 * The react component for `mezzanine` form message.
 */
const FormHintText = forwardRef<HTMLSpanElement, FormHintTextProps>(
  function FormHintText(props, ref) {
    const { children, className, severity, ...rest } = props;
    const icon = severity ? formHintIcons[severity] : null;

    return (
      <span
        {...rest}
        ref={ref}
        className={cx(
          classes.hintText,
          severity ? classes.hintTextSeverity(severity) : undefined,
          className,
        )}
      >
        {icon && <Icon className={classes.hintTextIcon} icon={icon} />}
        {children}
      </span>
    );
  },
);

export default FormHintText;
