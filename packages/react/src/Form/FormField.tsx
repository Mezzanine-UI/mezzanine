import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import { Severity } from '@mezzanine-ui/system/severity';
import { formFieldClasses as classes } from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { FormControl, FormControlContext } from './FormControlContext';

export interface FormFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * To control the field passed from children whether should be disabled.
   * The form message won't appear if disabled.
   */
  disabled?: boolean;
  /**
   * To control the field passed from children whether should be fullWidth.
   */
  fullWidth?: boolean;
  /**
   * To control the field passed from children whether should be required.
   */
  required?: boolean;
  /**
   * To control the severity of field passed from children and form message.
   */
  severity?: Severity;
}

/**
 * The react component for `mezzanine` form field.
 */
const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(props, ref) {
  const {
    children,
    className,
    disabled = false,
    fullWidth = false,
    required = false,
    severity,
    ...rest
  } = props;
  const formControl: FormControl = {
    disabled,
    fullWidth,
    required,
    severity,
  };

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        severity && classes.severity(severity),
        {
          [classes.disabled]: disabled,
          [classes.fullWidth]: fullWidth,
        },
        className,
      )}
    >
      <FormControlContext.Provider value={formControl}>
        {children}
      </FormControlContext.Provider>
    </div>
  );
});

export default FormField;
