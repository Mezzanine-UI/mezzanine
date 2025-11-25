'use client';

import {
  inputSpinnerButtonClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { forwardRef } from 'react';
import Icon from '../../Icon';
import { cx } from '../../utils/cx';
import { CaretDownFlatIcon, CaretUpFlatIcon } from '@mezzanine-ui/icons';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';

export interface SpinnerButtonProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'button'>,
    'type' | 'disabled'
  > {
  /**
   * Whether the spinner button is disabled.
   */
  disabled?: boolean;
  /**
   * The size of spinner button.
   * @default 'main'
   */
  size?: InputSize;
  /**
   * The type of spinner button.
   */
  type: 'up' | 'down';
}

const SpinnerButton = forwardRef<HTMLButtonElement, SpinnerButtonProps>(
  function SpinnerButton(props, ref) {
    const { className, disabled, size = 'main', type, ...rest } = props;

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
        title={type === 'up' ? 'Increase value' : 'Decrease value'}
        {...rest}
      >
        <Icon icon={type === 'up' ? CaretUpFlatIcon : CaretDownFlatIcon} />
      </button>
    );
  },
);

export default SpinnerButton;
