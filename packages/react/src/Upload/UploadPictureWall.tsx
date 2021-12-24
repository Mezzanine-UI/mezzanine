import {
  forwardRef,
} from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { UploadInputProps } from './UploadInput';

export interface UploadPictureWallProps
  extends
  Omit<UploadInputProps, 'multiple'>,
  NativeElementPropsWithoutKeyAndRef<'div'> {
}

const UploadPictureWall = forwardRef<HTMLDivElement, UploadPictureWallProps>(function UploadPicture() {
  return (
    <div>
      UploadPictureWall
    </div>
  );
});

export default UploadPictureWall;
