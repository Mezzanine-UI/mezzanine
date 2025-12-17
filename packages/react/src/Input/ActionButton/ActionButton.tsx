'use client';

import {
  inputActionButtonClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { forwardRef } from 'react';
import Icon from '../../Icon';
import { cx } from '../../utils/cx';
import { CopyIcon } from '@mezzanine-ui/icons';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { IconDefinition } from '@mezzanine-ui/icons';

export interface ActionButtonProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'button'>,
    'type' | 'disabled'
  > {
  /**
   * Whether the action button is disabled.
   */
  disabled?: boolean;
  /**
   * The icon of action button.
   * @default CopyIcon
   */
  icon?: IconDefinition;
  /**
   * The label of action button.
   * @default 'Copy'
   */
  label?: string;
  /**
   * The size of action button.
   * @default 'main'
   */
  size?: InputSize;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  function ActionButton(props, ref) {
    const {
      className,
      disabled,
      icon = CopyIcon,
      label = 'Copy',
      size = 'main',
      ...rest
    } = props;

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
        title={label}
        {...rest}
      >
        <Icon className={classes.icon} icon={icon} size={16} />
        <span className={classes.text}>{label}</span>
      </button>
    );
  },
);

export default ActionButton;
