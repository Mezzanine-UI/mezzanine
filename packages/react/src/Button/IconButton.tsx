import { forwardRef, ReactNode } from 'react';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import { ButtonComponent, ButtonPropsBase } from './typings';
import Button from './Button';

export type IconButtonProps<C extends ButtonComponent = 'button'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    ButtonComponent,
    C,
    Omit<ButtonPropsBase, 'prefix' | 'suffix'> & {
      /**
       * The icon element.
       */
      children?: ReactNode;
    }
  >;

/**
 * The react component for `mezzanine` button only has icon.
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps<'button'>>(
  function IconButton(props, ref) {
    const { children, ...rest } = props;

    return <Button {...rest} ref={ref} prefix={children} />;
  },
);

export default IconButton;
