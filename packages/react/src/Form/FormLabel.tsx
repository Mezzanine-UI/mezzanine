'use client';

import { forwardRef, ReactNode, useContext } from 'react';
import { formFieldClasses as classes } from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { FormControlContext } from './FormControlContext';
import { IconDefinition } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

export interface FormLabelProps
  extends NativeElementPropsWithoutKeyAndRef<'label'> {
  informationIcon?: IconDefinition;
  informationText?: string;
  labelText: string;
  optionalMarker?: ReactNode;
}

/**
 * The React component for `mezzanine` form label.
 */
const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel(props, ref) {
    const {
      className,
      htmlFor,
      informationIcon,
      informationText,
      labelText,
      optionalMarker,
      ...rest
    } = props;
    const { required } = useContext(FormControlContext) || {};

    return (
      <label
        {...rest}
        ref={ref}
        className={cx(classes.label, className)}
        htmlFor={htmlFor}
      >
        {required && <span className={classes.labelRequiredMarker}>*</span>}
        {labelText}
        {optionalMarker && (
          <span className={classes.labelOptionalMarker}>{optionalMarker}</span>
        )}
        {informationIcon && (
          <Tooltip title={informationText}>
            {({ onMouseEnter, onMouseLeave, ref: tooltipRef }) => (
              <Icon
                ref={tooltipRef}
                className={cx(classes.labelInformationIcon)}
                color="neutral-light"
                icon={informationIcon}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                size={16}
              />
            )}
          </Tooltip>
        )}
        <span className={classes.labelColon}>:</span>
      </label>
    );
  },
);

export default FormLabel;
