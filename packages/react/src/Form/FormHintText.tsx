'use client';

import { forwardRef } from 'react';
import {
  formFieldClasses as classes,
  formHintIcons,
} from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { IconDefinition } from '@mezzanine-ui/icons';

export type FormHintTextProps = NativeElementPropsWithoutKeyAndRef<'span'> & {
  /**
   * The hint text to display below the input field.
   * Provides additional information or guidance to the user.
   */
  hintText?: string;
  /**
   * The icon to display alongside the hint text.
   * If provided, this icon will override the default severity icon.
   */
  hintTextIcon?: IconDefinition;
  /**
   * The severity of form message.
   * if not provided, no icon will be displayed.
   */
  severity?: keyof typeof formHintIcons | undefined;
};

/**
 * The React component for `mezzanine` form message.
 */
const FormHintText = forwardRef<HTMLSpanElement, FormHintTextProps>(
  function FormHintText(props, ref) {
    const {
      className,
      hintText,
      hintTextIcon,
      severity = 'info',
      ...rest
    } = props;
    const defaultIcon = severity ? formHintIcons[severity] : null;

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
        {hintTextIcon ? (
          <Icon
            className={classes.hintTextIcon}
            icon={hintTextIcon}
            color={severity}
          />
        ) : (
          defaultIcon && (
            <Icon
              className={classes.hintTextIcon}
              icon={defaultIcon}
              color={severity}
            />
          )
        )}
        {hintText}
      </span>
    );
  },
);

export default FormHintText;
