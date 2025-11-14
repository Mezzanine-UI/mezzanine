'use client';

import { ChangeEventHandler, forwardRef, useContext } from 'react';
import {
  toggleClasses as classes,
  ToggleSize,
  ToggleSpinnerIcon,
} from '@mezzanine-ui/core/toggle';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useSwitchControlValue } from '../Form/useSwitchControlValue';
import Icon from '../Icon';
import { FormControlContext } from '../Form';

export interface ToggleProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'span'>, 'onChange'> {
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
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   *  If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'checked'
    | 'defaultChecked'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'type'
    | 'value'
    | `aria-${'disabled' | 'checked'}`
  >;
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
  size?: ToggleSize;
}

/**
 * The react component for `mezzanine` switch.
 */
const Toggle = forwardRef<HTMLSpanElement, ToggleProps>(
  function Toggle(props, ref) {
    const { disabled: disabledFromFormControl } =
      useContext(FormControlContext) || {};
    const {
      checked: checkedProp,
      className,
      defaultChecked,
      disabled: disabledProp = disabledFromFormControl,
      inputProps,
      loading = false,
      onChange: onChangeProp,
      size = 'medium',
      ...rest
    } = props;
    const [checked, onChange] = useSwitchControlValue({
      checked: checkedProp,
      defaultChecked,
      onChange: onChangeProp,
    });
    const disabled = loading || disabledProp;

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
          {loading && <Icon icon={ToggleSpinnerIcon} spin />}
        </span>
        <input
          {...inputProps}
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
  },
);

export default Toggle;
