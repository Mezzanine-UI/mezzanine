import { ChangeEventHandler, forwardRef } from 'react';
import {
  switchClasses as classes,
  SwitchSize,
  SwitchSpinnerIcon,
} from '@mezzanine-ui/core/switch';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { useSwitchControl } from './useSwitchControl';

export interface SwitchProps extends Omit<NativeElementPropsWithoutKeyAndRef<'span'>, 'onChange'> {
  /**
   * Whether the switch is checked.
   */
  checked?: boolean;
  /**
   * Whether the switch is checked by default.
   * Only used for uncontrolled.
   */
  defaultChecked?: boolean;
  /**
   * Whether the switch is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the switch is loading.
   * @default false
   */
  loading?: boolean;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of switch.
   * @default 'medium'
   */
  size?: SwitchSize;
}

/**
 * The react component for `mezzanine` switch.
 */
const Switch = forwardRef<HTMLSpanElement, SwitchProps>(function Switch(props, ref) {
  const {
    checked: checkedProp,
    className,
    defaultChecked,
    disabled: disabledProp = false,
    loading = false,
    onChange: onChangeProp,
    size = 'medium',
    ...rest
  } = props;
  const disabled = disabledProp || loading;
  const { checked, onChange } = useSwitchControl({
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
  });

  return (
    <span
      ref={ref}
      {...rest}
      className={cx(
        classes.host,
        {
          [classes.checked]: checked,
          [classes.disabled]: disabled,
          [classes.large]: size === 'large',
        },
        className,
      )}
    >
      <span className={classes.control}>
        {loading && <Icon icon={SwitchSpinnerIcon} spin />}
      </span>
      <input
        aria-checked={checked}
        aria-disabled={disabled}
        checked={checked}
        className={classes.input}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
    </span>
  );
});

export default Switch;
