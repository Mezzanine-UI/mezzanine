'use client';

import {
  inputSelectButtonClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { forwardRef } from 'react';
import Icon from '../../Icon';
import Rotate from '../../Transition/Rotate';
import { cx } from '../../utils/cx';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface SelectButtonProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'button'>,
    'type' | 'disabled'
  > {
  /**
   * Whether the select button is disabled.
   */
  disabled?: boolean;
  /**
   * The value of select button.
   */
  value?: string;
  /**
   * The size of select button.
   * @default 'main'
   */
  size?: InputSize;
}

/** @TODO dropdown menu with button */
const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
  function SelectButton(props, ref) {
    const { className, disabled, value, size = 'main', ...rest } = props;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cx(
          classes.host,
          disabled && classes.disabled,
          size === 'main' ? classes.main : classes.sub,
          className,
        )}
        title={value}
        {...rest}
      >
        <span className={classes.text}>{value}</span>
        <Rotate
          /** @TODO in=true when dropdown opened */
          in={false}
          duration={MOTION_DURATION.fast}
          easing={MOTION_EASING.standard}
        >
          <Icon className={classes.icon} icon={ChevronDownIcon} size={16} />
        </Rotate>
      </button>
    );
  },
);

export default SelectButton;
