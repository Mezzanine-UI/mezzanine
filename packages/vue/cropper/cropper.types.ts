import type { CropperSize } from '@mezzanine-ui/core/cropper';

/**
 * What a Cropper host may be rendered as. React's list, verbatim.
 */
export type CropperComponent = 'div' | 'span';

/**
 * What a CropperElement host may be rendered as. The drawing surface is always
 * a canvas, so the list has exactly one member — React's does too.
 */
export type CropperElementComponent = 'canvas';

/**
 * A rectangle in the coordinate space of whatever produced it: the canvas while
 * the crop is being dragged, the source image once it has been emitted.
 */
export interface CropArea {
  /** The height of the rectangle. */
  height: number;
  /** The width of the rectangle. */
  width: number;
  /** The distance from the left edge. */
  x: number;
  /** The distance from the top edge. */
  y: number;
}

/**
 * The props both cropper hosts share.
 *
 * The callbacks stay props rather than becoming emits because MznCropperModal
 * takes the whole object as its `cropperProps`, exactly as React's does — a
 * config object cannot carry emits. Consumers may still write them as
 * listeners (`@crop-change`): Vue turns those into the very same props.
 */
export interface CropperPropsBase {
  /**
   * Aspect ratio for the crop area (width / height).
   * If not provided, free aspect ratio is allowed.
   */
  aspectRatio?: number;
  /**
   * The image source to crop.
   * Can be a URL string, File, or Blob.
   */
  imageSrc?: string | File | Blob;
  /**
   * Initial crop area.
   */
  initialCropArea?: CropArea;
  /**
   * Minimum crop area height in pixels.
   * @default 50
   */
  minHeight?: number;
  /**
   * Minimum crop area width in pixels.
   * @default 50
   */
  minWidth?: number;
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
   * Callback fired when image fails to load.
   */
  onImageError?: (error: Error) => void;
  /**
   * Callback fired when image loads successfully.
   */
  onImageLoad?: () => void;
  /**
   * Callback fired when scale (zoom) changes.
   */
  onScaleChange?: (scale: number) => void;
  /**
   * The size of cropper.
   * @default 'main'
   */
  size?: CropperSize;
}

export interface CropperProps extends CropperPropsBase {
  /**
   * Override the element the cropper is rendered as.
   * @default 'div'
   */
  component?: CropperComponent;
}
