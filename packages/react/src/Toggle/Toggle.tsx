'use client';

import { ChangeEventHandler, forwardRef, useContext } from 'react';
import {
  toggleClasses as classes,
  ToggleSize,
} from '@mezzanine-ui/core/toggle';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useSwitchControlValue } from '../Form/useSwitchControlValue';
import { FormControlContext } from '../Form';
import Typography from '../Typography';

export interface ToggleProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange'> {
  /**
   * Whether the toggle is checked.
   */
  checked?: boolean;
  /**
   * Whether the toggle is checked by default.
   * Only used for uncontrolled.
   */
  defaultChecked?: boolean;
  /**
   * Whether the toggle is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
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
   * The label text displayed beside the toggle.
   */
  label?: string;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of toggle.
   * @default 'main'
   */
  size?: ToggleSize;
  /**
   * Supporting text displayed below the label.
   */
  supportingText?: string;
}

/**
 * The react component for `mezzanine` toggle.
 */
const Toggle = forwardRef<HTMLDivElement, ToggleProps>(
  function Toggle(props, ref) {
    const { disabled: disabledFromFormControl } =
      useContext(FormControlContext) || {};
    const {
      checked: checkedProp,
      className,
      defaultChecked,
      disabled = disabledFromFormControl,
      inputProps,
      label,
      onChange: onChangeProp,
      size = 'main',
      supportingText,
      ...rest
    } = props;
    const [checked, onChange] = useSwitchControlValue({
      checked: checkedProp,
      defaultChecked,
      onChange: onChangeProp,
    });

    return (
      <div
        ref={ref}
        {...rest}
        className={cx(
          classes.host,
          {
            [classes.checked]: checked,
            [classes.disabled]: disabled,
            [classes.main]: size === 'main',
            [classes.sub]: size === 'sub',
          },
          className,
        )}
      >
        <div className={classes.inputContainer}>
          <span className={classes.knob} />
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
        </div>
        {label && (
          <div className={classes.textContainer}>
            <Typography color="text-neutral-solid" variant="label-primary">
              {label}
            </Typography>
            {supportingText && (
              <Typography color="text-neutral" variant="caption">
                {supportingText}
              </Typography>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default Toggle;
