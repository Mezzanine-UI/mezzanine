import {
  forwardRef,
} from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { UploadInputProps } from './UploadInput';
import UploadPicture from './UploadPicture';

export interface UploadPictureWallProps
  extends
  UploadInputProps,
  NativeElementPropsWithoutKeyAndRef<'div'> {
  value?: string[] ;
}

const UploadPictureWall = forwardRef<HTMLDivElement, UploadPictureWallProps>(function UploadPictureWall(props, ref) {
  const {
    accept,
    className,
    disabled,
    style,
  } = props;

  return (
    <div
      ref={ref}
      className={cx(
        className,
      )}
      style={style}
    >
      <UploadPicture accept={accept} disabled={disabled} />
    </div>
  );
});

export default UploadPictureWall;
