import {
  DetailedHTMLProps, forwardRef, HTMLAttributes,
} from 'react';
// import { cx } from '../utils/cx';
import Selection from '../Selection/Selection';

export interface CheckboxProps extends DetailedHTMLProps<HTMLAttributes<HTMLLabelElement>, HTMLElement> {
  canHover?: boolean;
  checked?: boolean;
  children?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  indeterminate?: boolean;
  size?: 'large' | 'medium' | 'small';
  value?: boolean;
}

const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    canHover,
    checked,
    children,
    // className,
    defaultChecked,
    disabled,
    hasError,
    size = 'medium',
  } = props;

  return (
    <Selection
      ref={ref}
      type="checkbox"
      canHover={canHover}
      checked={checked}
      defaultChecked={defaultChecked}
      hasError={hasError}
      size={size}
      label={children}
      disabled={disabled}
    >
      {/* <span
        className={cx(
          classes.check,
          classes[color],
          classes[size],
          {
            [classes.indeterminate]: indeterminate,
            [classes.checked]: checked,
            [classes.disabled]: disabled,
          },
          className,
        )}
      /> */}
    </Selection>
  );
});

export default Checkbox;
