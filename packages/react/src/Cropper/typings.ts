import { CropperSize } from '@mezzanine-ui/core/cropper';
import { ReactNode } from 'react';

export type CropperComponent = 'div' | 'span';
export type CropperElementComponent = 'canvas';

export interface CropperPropsBase {
  /**
   * The size of cropper.
   * @default 'main'
   */
  size?: CropperSize;
  /**
   * The cropper content.
   */
  children?: ReactNode;
  /**
   * The image source to crop.
   * Can be a URL string, File, or Blob.
   */
  imageSrc?: string | File | Blob;
  /**
   * Callback fired when the crop area changes.
   */
  onCropChange?: (cropArea: CropArea) => void;
  /**
   * Initial crop area.
   */
  initialCropArea?: CropArea;
  /**
   * Aspect ratio for the crop area (width / height).
   * If not provided, free aspect ratio is allowed.
   */
  aspectRatio?: number;
  /**
   * Minimum crop area width in pixels.
   * @default 50
   */
  minWidth?: number;
  /**
   * Minimum crop area height in pixels.
   * @default 50
   */
  minHeight?: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

