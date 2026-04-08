import type { CropArea } from './cropper.component';

export interface ImagePosition {
  readonly offsetX: number;
  readonly offsetY: number;
}

export interface BaseDisplaySize {
  readonly width: number;
  readonly height: number;
}

export interface InitialCropAreaResult {
  readonly baseDisplayHeight: number;
  readonly baseDisplayWidth: number;
  readonly cropArea: CropArea;
  readonly imagePosition: ImagePosition;
}

/**
 * Calculate base scale for image to fit (cover) canvas.
 * Uses the smaller of width/height ratios so image fills the canvas.
 */
export function getBaseScale(rect: DOMRect, img: HTMLImageElement): number {
  if (!rect.height || !rect.width) return 1;
  return Math.min(img.height / rect.height, img.width / rect.width);
}

/**
 * Calculate the base display size (at scale 1) of the image within the canvas.
 */
export function getBaseDisplaySize(
  rect: DOMRect,
  img: HTMLImageElement,
): BaseDisplaySize {
  const baseScale = getBaseScale(rect, img);
  return {
    height: img.height / baseScale,
    width: img.width / baseScale,
  };
}

/**
 * Calculate initial crop area and image position from canvas rect and image.
 */
export function calculateInitialCropArea(
  img: HTMLImageElement,
  rect: DOMRect,
  aspectRatio?: number,
): InitialCropAreaResult {
  const baseScale = getBaseScale(rect, img);
  const baseDisplayWidth = img.width / baseScale;
  const baseDisplayHeight = img.height / baseScale;
  const initialOffsetX = (rect.width - baseDisplayWidth) / 2;
  const initialOffsetY = (rect.height - baseDisplayHeight) / 2;

  let initialWidth = rect.width;
  let initialHeight = rect.height;

  if (aspectRatio) {
    const maxWidthByCanvasHeight = rect.height * aspectRatio;
    const maxHeightByCanvasWidth = rect.width / aspectRatio;

    if (maxWidthByCanvasHeight <= rect.width) {
      initialWidth = maxWidthByCanvasHeight;
      initialHeight = rect.height;
    } else {
      initialWidth = rect.width;
      initialHeight = maxHeightByCanvasWidth;
    }
  }

  const initialX = (rect.width - initialWidth) / 2;
  const initialY = (rect.height - initialHeight) / 2;

  return {
    baseDisplayHeight,
    baseDisplayWidth,
    cropArea: {
      height: initialHeight,
      width: initialWidth,
      x: initialX,
      y: initialY,
    },
    imagePosition: {
      offsetX: initialOffsetX,
      offsetY: initialOffsetY,
    },
  };
}

/**
 * Constrain image position so the image always fully covers the crop area.
 */
export function constrainImagePosition(
  newOffsetX: number,
  newOffsetY: number,
  displayWidth: number,
  displayHeight: number,
  cropArea: CropArea,
): ImagePosition {
  const { height: ch, width: cw, x: cx, y: cy } = cropArea;

  const minOffsetX = cx + cw - displayWidth;
  const maxOffsetX = cx;
  const minOffsetY = cy + ch - displayHeight;
  const maxOffsetY = cy;

  return {
    offsetX: Math.max(minOffsetX, Math.min(newOffsetX, maxOffsetX)),
    offsetY: Math.max(minOffsetY, Math.min(newOffsetY, maxOffsetY)),
  };
}

/**
 * Check whether two crop areas are considered similar within a given threshold.
 */
export function isCropAreaSimilar(
  a: CropArea | null,
  b: CropArea | null,
  threshold = 0.5,
): boolean {
  if (!a || !b) return a === b;
  return (
    Math.abs(a.x - b.x) < threshold &&
    Math.abs(a.y - b.y) < threshold &&
    Math.abs(a.width - b.width) < threshold &&
    Math.abs(a.height - b.height) < threshold
  );
}

/**
 * Check whether two image positions are considered similar within a given threshold.
 */
export function isImagePositionSimilar(
  a: ImagePosition | null,
  b: ImagePosition | null,
  threshold = 0.1,
): boolean {
  if (!a || !b) return a === b;
  return (
    Math.abs(a.offsetX - b.offsetX) < threshold &&
    Math.abs(a.offsetY - b.offsetY) < threshold
  );
}
