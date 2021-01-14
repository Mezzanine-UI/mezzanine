import { forwardRef, ReactNode } from 'react';
import Button, { ButtonProps } from './Button';

export interface IconButtonProps extends Omit<ButtonProps, 'iconEnd' | 'iconStart'> {
  /**
   * The icon element.
   */
  children: ReactNode;
}

/**
 * The react component for `mezzanine` button only has icon.
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  const { children, ...rest } = props;

  return (
    <Button
      ref={ref as any}
      {...rest}
      iconStart={children}
    />
  );
});

export default IconButton;
