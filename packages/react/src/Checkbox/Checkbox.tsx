import {
  ChangeEventHandler,
  forwardRef, useEffect, useState,
} from 'react';
import {
  checkboxClasses as classes,
} from '@mezzanine-ui/core/checkbox';
import { cx } from '../utils/cx';
import Selection, { SelectionProps } from '../Selection/Selection';

export interface CheckboxProps extends Omit<SelectionProps, 'checked' | 'children' | 'htmlFor' | 'label' | 'type'> {
  children?: string;
  className?: string;
  indeterminate?: boolean;
}

/** @todo */
// 1. Hover state
// 2. Selected icon
// 3. State Logic
// 4. Group Mode
// 5. Tree Mode
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    canHover,
    children,
    className,
    defaultChecked,
    disabled,
    hasError,
    indeterminate,
    size = 'medium',
    value,
    // onChange,
  } = props;

  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (defaultChecked) setChecked(true);
  }, [defaultChecked]);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setChecked(event.target.checked);
  };

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
      value={value}
      onChange={onChangeHandler}
    >
      <span
        className={cx(
          classes.host,
          classes.checkbox(size),
          {
            [classes.selected]: checked || defaultChecked || indeterminate,
            [classes.disabled]: disabled,
            [classes.disabledBg]: (checked || indeterminate) && disabled,
            [classes.error]: hasError,
          },
          className,
        )}
      >
        {checked ? (
          <svg
            aria-hidden
            className={classes.icon(size)}
            data-icon-name="check"
            focusable={false}
          >
            <path
              fill="white"
              fillRule="evenodd"
              stroke="none"
              strokeWidth="1"
              d="M 17.993 8.768
              l -7.625 7.625
              L 6.4 12.425
              l 1.061-1.06 2.908 2.907 6.564-6.563z"
            />
          </svg>
        ) : null}
        {indeterminate ? (
          <svg
            aria-hidden
            className={classes.icon(size)}
            data-icon-name="indeterminate"
            focusable={false}
          >
            <path
              fill="white"
              fillRule="evenodd"
              stroke="none"
              strokeWidth="1"
              d="M 18 10 L 18 12 L 4 12 L 4 10 Z"
            />
          </svg>
        ) : null}
      </span>
    </Selection>
  );
});

export default Checkbox;
