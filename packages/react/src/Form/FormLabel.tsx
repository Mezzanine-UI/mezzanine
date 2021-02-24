import {
  DetailedHTMLProps,
  forwardRef,
  LabelHTMLAttributes,
  ReactNode,
  useContext,
} from 'react';
import { formFieldClasses as classes } from '@mezzanine-ui/core/form';
// import { InfoCircleFilledIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
// import Icon from '../Icon';
import { FormControlContext } from './FormControlContext';

export interface FormLabelProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  remark?: ReactNode;
  remarkIcon?: ReactNode;
}

/**
 * The react component for `mezzanine` form label.
 */
const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(function FormLabel(props, ref) {
  const {
    children,
    className,
    htmlFor,
    remark,
    remarkIcon,
    ...rest
  } = props;
  const { required } = useContext(FormControlContext) || {};

  return (
    <label
      {...rest}
      ref={ref}
      className={cx(
        classes.label,
        className,
      )}
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
});

export default FormLabel;
