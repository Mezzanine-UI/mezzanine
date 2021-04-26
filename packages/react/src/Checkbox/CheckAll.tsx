import {
  Children,
  forwardRef, ReactElement, ReactNode, useMemo,
} from 'react';
import { checkboxClasses as classes } from '@mezzanine-ui/core/checkbox';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Checkbox from './Checkbox';
import { CheckboxGroupProps } from './CheckboxGroup';

export interface CheckAllProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  children?: ReactElement<CheckboxGroupProps>;
  label?: ReactNode;
}

/**
 * The react component for `mezzanine` check all.
 * Only support controlled.
 */
const CheckAll = forwardRef<HTMLDivElement, CheckAllProps>(function CheckAll(props: CheckAllProps, ref) {
  const {
    children,
    className,
    label,
    ...rest
  } = props;
  const checkboxGroup = children && Children.only(children);
  const {
    disabled,
    name,
    onChange,
    options,
    size,
    value,
  } = checkboxGroup?.props || {};
  const enabledOptions = useMemo(() => options?.filter((option) => !option.disabled), [options]);
  let allChecked = false;
  let indeterminate = false;

  if (enabledOptions && value) {
    allChecked = enabledOptions.length === value.length;
    indeterminate = enabledOptions.length > value.length && value.length > 0;
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.all,
        className,
      )}
    >
      <div>
        <Checkbox
          checked={allChecked}
          disabled={disabled}
          indeterminate={indeterminate}
          inputProps={{
            name,
          }}
          onChange={(event) => {
            if (onChange) {
              if (!event.target.checked) {
                onChange([], event);
              } else if (enabledOptions) {
                onChange(enabledOptions.map((option) => option.value), event);
              }
            }
          }}
          size={size}
        >
          {label}
        </Checkbox>
      </div>
      {children}
    </div>
  );
});

export default CheckAll;
