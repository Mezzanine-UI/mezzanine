import { forwardRef, useRef } from 'react';
import { UploadIcon } from '@mezzanine-ui/icons';
import Button, { ButtonProps } from '../Button';
import UploadInput, { UploadInputProps } from './UploadInput';
import Icon from '../Icon';

export interface UploadButtonProps
  extends
  Omit<ButtonProps, 'component' | 'prefix' | 'suffix'>,
  UploadInputProps {
}

/**
 * The react component for `mezzanine` upload button.
 */
const UploadButton = forwardRef<HTMLButtonElement, UploadButtonProps>(function UploadButton(props, ref) {
  const {
    accept,
    children,
    disabled = false,
    multiple = false,
    onClick,
    onUpload,
    ...rest
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      {...rest}
      ref={ref}
      disabled={disabled}
      onClick={(event) => {
        inputRef.current?.click();

        if (onClick) {
          onClick(event);
        }
      }}
      prefix={<Icon icon={UploadIcon} />}
    >
      <UploadInput
        ref={inputRef}
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onUpload={onUpload}
      />
      {children}
    </Button>
  );
});

export default UploadButton;
