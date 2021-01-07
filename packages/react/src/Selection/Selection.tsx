import { ChangeEventHandler, forwardRef, ReactNode } from 'react';
import {
  selectionClasses as classes,
  SelectionSize,
} from '@mezzanine-ui/core/selection';
import { cx } from '../utils/cx';

export interface SelectionProps {
  canHover?: boolean;
  checked?: boolean;
  children: ReactNode;
  defaultChecked?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  htmlFor?: string;
  label?: string;
  size: SelectionSize;
  type: 'checkbox' | 'radio';
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Selection = forwardRef<HTMLLabelElement, SelectionProps>(function Selection(props, ref) {
  const {
    // canHover,
    checked,
    // children,
    defaultChecked,
    disabled,
    // hasError,
    htmlFor,
    label,
    size = 'medium',
    type,
    value,
    onChange,
  } = props;

  return (
    <label
      htmlFor={htmlFor}
      ref={ref}
      className={cx(
        classes.host,
        classes.size(size),
      )}
    >
      <div className={classes.select}>
        <input
          aria-disabled={disabled}
          className={classes.input}
          checked={checked || defaultChecked}
          disabled={disabled}
          id={htmlFor}
          type={type}
          value={value}
          onChange={onChange}
        />
        {/* {children} */}
        <span className={classes.check(size)} />
      </div>
      <span className={classes.label(size)}>{label}</span>
    </label>
  );
});

export default Selection;
