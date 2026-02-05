import { GeneralSize } from '@mezzanine-ui/system/size';

export type CropperSize = GeneralSize;

export const cropperPrefix = 'mzn-cropper';

export const cropperClasses = {
  host: cropperPrefix,
  size: (size: CropperSize) => `${cropperPrefix}--${size}`,
  element: `${cropperPrefix}__element`,
  content: `${cropperPrefix}__content`,
  controls: `${cropperPrefix}__controls`,
  tag: `${cropperPrefix}__tag`,
};

