import { forwardRef, ReactNode } from 'react';
import Button, { ButtonProps } from './Button';

export interface IconButtonProps extends Omit<ButtonProps, 'prefix' | 'suffix'> {
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
      prefix={children}
    />
  );
});

export default IconButton;
