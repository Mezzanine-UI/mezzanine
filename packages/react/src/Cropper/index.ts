import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import Cropper, { CropperModal, CropperProps } from './Cropper';
import {
  CropArea,
  CropperComponent,
  CropperElementComponent,
  CropperPropsBase,
} from './typings';

export type { CropperSize } from '@mezzanine-ui/core/cropper';
export type {
  CropperModalConfirmContext,
  CropperModalOpenOptions,
  CropperModalProps,
  CropperModalResult,
  CropperModalType
} from './Cropper';
export { default as CropperElement } from './CropperElement';
export type { CropperElementProps } from './CropperElement';
export {
  cropToBlob, cropToDataURL, cropToFile
} from './tools';
export type { CropToBlobOptions } from './tools';
export { CropperModal };
export type {
  CropArea, CropperComponent,
  CropperElementComponent,
  CropperProps,
  CropperPropsBase
};

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericCropper = <C extends CropperComponent = 'div'>(
  props: PropsWithoutRef<CropperProps<C>> & RefAttributes<HTMLDivElement>,
) => ReactElement<any>;

export default Cropper as GenericCropper;

