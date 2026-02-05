import type { CropArea } from '../typings';

export interface ImagePosition {
  offsetX: number;
  offsetY: number;
}

export interface BaseDisplaySize {
  width: number;
  height: number;
}

export interface InitialCropAreaResult {
  baseDisplayHeight: number;
  baseDisplayWidth: number;
  cropArea: CropArea;
  imagePosition: ImagePosition;
}

/**
 * Calculate base scale for image to fit canvas height.
 */
export function getBaseScale(rect: DOMRect, img: HTMLImageElement): number {
  if (!rect.height) return 1;
  return img.height / rect.height;
}

/**
 * Calculate base display size of image.
 */
export function getBaseDisplaySize(
  rect: DOMRect,
  img: HTMLImageElement,
): BaseDisplaySize {
  const baseScale = getBaseScale(rect, img);
  return {
    width: img.width / baseScale,
    height: img.height / baseScale,
  };
}

/**
 * Calculate initial crop area and image position.
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

  let initialWidth = baseDisplayWidth;
  let initialHeight = baseDisplayHeight;

  if (aspectRatio) {
    const maxWidthByHeight = baseDisplayHeight * aspectRatio;
    const maxHeightByWidth = baseDisplayWidth / aspectRatio;

    if (maxWidthByHeight <= baseDisplayWidth) {
      initialWidth = maxWidthByHeight;
      initialHeight = baseDisplayHeight;
    } else {
      initialWidth = baseDisplayWidth;
      initialHeight = maxHeightByWidth;
    }
  }

  const initialX =
    initialOffsetX + (baseDisplayWidth - initialWidth) / 2;
  const initialY =
    initialOffsetY + (baseDisplayHeight - initialHeight) / 2;

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
 * Constrain image position to ensure it covers crop area.
 */
export function constrainImagePosition(
  newOffsetX: number,
  newOffsetY: number,
  displayWidth: number,
  displayHeight: number,
  cropArea: CropArea,
): ImagePosition {
  const { x: cx, y: cy, width: cw, height: ch } = cropArea;

  // Ensure image always covers crop area (no white space in crop area)
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
 * Check if two crop areas are similar (within threshold).
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
 * Check if two image positions are similar (within threshold).
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

