'use client';

import { Children, cloneElement, forwardRef, ReactElement } from 'react';
import {
  buttonGroupClasses as classes,
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { ButtonProps } from './Button';

export type ButtonGroupChild =
  | ReactElement<ButtonProps>
  | null
  | undefined
  | false;

export interface ButtonGroupProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Only accept button elements.
   */
  children: ButtonGroupChild | ButtonGroupChild[];
  /**
   * If the `disabled` of a button inside group not provided, the `disabled` of group will override it.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, set width: 100%.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The orientation of button group.
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation;
  /**
   * If the `size` of a button inside group not provided, the `size` of group will override it.
   * @default 'main'
   */
  size?: ButtonSize;
  /**
   * If the `variant` of a button inside group not provided, the `variant` of group will override it.
   * @default 'base-primary'
   */
  variant?: ButtonVariant;
}

/**
 * The react component for `mezzanine` button group.
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(props, ref) {
    const {
      children,
      className,
      disabled = false,
      fullWidth = false,
      orientation = 'horizontal',
      role = 'group',
      size = 'main',
      variant = 'base-primary',
      ...rest
    } = props;

    return (
      <div
        ref={ref}
        {...rest}
        aria-orientation={orientation}
        className={cx(
          classes.host,
          classes.orientation(orientation),
          {
            [classes.fullWidth]: fullWidth,
          },
          className,
        )}
        role={role}
      >
        {Children.map(children, (unknownChild) => {
          const child = unknownChild as ButtonGroupChild;

          if (!child) {
            return null;
          }

          return cloneElement(child, {
            disabled: child.props.disabled ?? disabled,
            size: child.props.size || size,
            variant: child.props.variant || variant,
          });
        })}
      </div>
    );
  },
);

export default ButtonGroup;
