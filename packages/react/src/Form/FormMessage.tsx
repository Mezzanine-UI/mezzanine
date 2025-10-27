'use client';

import { forwardRef, useContext } from 'react';
import {
  formFieldClasses as classes,
  formMessageIcons,
} from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { FormControlContext } from './FormControlContext';

export type FormMessageProps = NativeElementPropsWithoutKeyAndRef<'span'>;

/**
 * The react component for `mezzanine` form message.
 */
const FormMessage = forwardRef<HTMLSpanElement, FormMessageProps>(
  function FormMessage(props, ref) {
    const { children, className, ...rest } = props;
    const { severity } = useContext(FormControlContext) || {};
    const icon = severity ? formMessageIcons[severity] : null;

    return (
      <span {...rest} ref={ref} className={cx(classes.message, className)}>
        {icon && <Icon className={classes.severityIcon} icon={icon} />}
        {children}
      </span>
    );
  },
);

export default FormMessage;
