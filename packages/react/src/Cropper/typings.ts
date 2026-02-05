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
   * Callback fired when crop area drag ends.
   */
  onCropDragEnd?: (cropArea: CropArea) => void;
  /**
   * Callback fired when image drag ends.
   */
  onImageDragEnd?: () => void;
  /**
   * Callback fired when scale (zoom) changes.
   */
  onScaleChange?: (scale: number) => void;
  /**
   * Callback fired when image loads successfully.
   */
  onImageLoad?: () => void;
  /**
   * Callback fired when image fails to load.
   */
  onImageError?: (error: Error) => void;
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

