import {
  calculateInitialCropArea,
  constrainImagePosition,
  getBaseDisplaySize,
  getBaseScale,
  isCropAreaSimilar,
  isImagePositionSimilar,
  type ImagePosition,
} from './cropper-calculations';
import type { CropArea } from '../typings';

describe('getBaseScale', () => {
  it('should calculate scale based on image height and rect height', () => {
    const rect = new DOMRect(0, 0, 400, 300);
    const img = {
      width: 800,
      height: 600,
    } as HTMLImageElement;

    const scale = getBaseScale(rect, img);

    expect(scale).toBe(2); // 600 / 300 = 2
  });

  it('should return 1 when rect height is 0', () => {
    const rect = new DOMRect(0, 0, 400, 0);
    const img = {
      width: 800,
      height: 600,
    } as HTMLImageElement;

    const scale = getBaseScale(rect, img);

    expect(scale).toBe(1);
  });

  it('should handle different image and rect dimensions', () => {
    const rect = new DOMRect(0, 0, 200, 150);
    const img = {
      width: 1000,
      height: 750,
    } as HTMLImageElement;

    const scale = getBaseScale(rect, img);

    expect(scale).toBe(5); // 750 / 150 = 5
  });
});

describe('getBaseDisplaySize', () => {
  it('should calculate base display size correctly', () => {
    const rect = new DOMRect(0, 0, 400, 300);
    const img = {
      width: 800,
      height: 600,
    } as HTMLImageElement;

    const size = getBaseDisplaySize(rect, img);

    expect(size.width).toBe(400); // 800 / 2 = 400
    expect(size.height).toBe(300); // 600 / 2 = 300
  });

  it('should handle different dimensions', () => {
    const rect = new DOMRect(0, 0, 200, 150);
    const img = {
      width: 1000,
      height: 750,
    } as HTMLImageElement;

    const size = getBaseDisplaySize(rect, img);

    expect(size.width).toBe(200); // 1000 / 5 = 200
    expect(size.height).toBe(150); // 750 / 5 = 150
  });

  it('should return correct size when rect height is 0', () => {
    const rect = new DOMRect(0, 0, 400, 0);
    const img = {
      width: 800,
      height: 600,
    } as HTMLImageElement;

    const size = getBaseDisplaySize(rect, img);

    // When height is 0, scale is 1, so width = 800 / 1 = 800
    expect(size.width).toBe(800);
    expect(size.height).toBe(600);
  });
});

describe('calculateInitialCropArea', () => {
  const createMockImage = (width: number, height: number): HTMLImageElement => ({
    width,
    height,
  } as HTMLImageElement);

  const createMockRect = (width: number, height: number): DOMRect =>
    new DOMRect(0, 0, width, height);

  it('should calculate initial crop area without aspect ratio', () => {
    const img = createMockImage(800, 600);
    const rect = createMockRect(400, 300);

    const result = calculateInitialCropArea(img, rect);

    expect(result.baseDisplayWidth).toBe(400);
    expect(result.baseDisplayHeight).toBe(300);
    expect(result.cropArea.width).toBe(400);
    expect(result.cropArea.height).toBe(300);
    expect(result.cropArea.x).toBe(0);
    expect(result.cropArea.y).toBe(0);
    expect(result.imagePosition.offsetX).toBe(0);
    expect(result.imagePosition.offsetY).toBe(0);
  });

  it('should calculate initial crop area with aspect ratio (width limited)', () => {
    const img = createMockImage(800, 600);
    const rect = createMockRect(400, 300);
    const aspectRatio = 16 / 9; // ~1.778

    const result = calculateInitialCropArea(img, rect, aspectRatio);

    // baseDisplayWidth = 400, baseDisplayHeight = 300
    // maxWidthByHeight = 300 * 1.778 = 533.4 > 400, so width limited
    // maxHeightByWidth = 400 / 1.778 = 225
    // So initialWidth = 400, initialHeight = 225
    expect(result.cropArea.width).toBe(400);
    expect(result.cropArea.height).toBeCloseTo(225, 1);
    expect(result.cropArea.x).toBe(0);
    expect(result.cropArea.y).toBeCloseTo(37.5, 1); // (300 - 225) / 2
  });

  it('should calculate initial crop area with aspect ratio (height limited)', () => {
    const img = createMockImage(800, 600);
    const rect = createMockRect(400, 300);
    const aspectRatio = 4 / 3; // 1.333

    const result = calculateInitialCropArea(img, rect, aspectRatio);

    // baseDisplayWidth = 400, baseDisplayHeight = 300
    // maxWidthByHeight = 300 * 1.333 = 400 <= 400, so height limited
    // So initialWidth = 400, initialHeight = 300
    expect(result.cropArea.width).toBe(400);
    expect(result.cropArea.height).toBe(300);
  });

  it('should center crop area when smaller than display size', () => {
    const img = createMockImage(800, 600);
    const rect = createMockRect(600, 400);

    const result = calculateInitialCropArea(img, rect);

    // baseDisplayWidth = 600, baseDisplayHeight = 400
    // But image fits: 800/scale = 600, 600/scale = 400, so scale = 1.333
    // Actually: scale = 600/400 = 1.5, so baseDisplayWidth = 800/1.5 = 533.33, baseDisplayHeight = 600/1.5 = 400
    // Wait, let me recalculate: scale = img.height / rect.height = 600 / 400 = 1.5
    // baseDisplayWidth = 800 / 1.5 = 533.33, baseDisplayHeight = 600 / 1.5 = 400
    // initialOffsetX = (600 - 533.33) / 2 = 33.33
    expect(result.imagePosition.offsetX).toBeCloseTo(33.33, 1);
    expect(result.imagePosition.offsetY).toBe(0);
  });

  it('should handle square aspect ratio', () => {
    const img = createMockImage(800, 600);
    const rect = createMockRect(400, 300);
    const aspectRatio = 1; // Square

    const result = calculateInitialCropArea(img, rect, aspectRatio);

    // Should create a square crop area
    expect(result.cropArea.width).toBe(result.cropArea.height);
  });
});

describe('constrainImagePosition', () => {
  const createCropArea = (
    x: number,
    y: number,
    width: number,
    height: number,
  ): CropArea => ({
    x,
    y,
    width,
    height,
  });

  it('should constrain position to keep image covering crop area', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 400;
    const displayHeight = 400;

    // Position that would leave white space
    const result = constrainImagePosition(0, 0, displayWidth, displayHeight, cropArea);

    // minOffsetX = 100 + 200 - 400 = -100
    // maxOffsetX = 100
    // minOffsetY = 100 + 200 - 400 = -100
    // maxOffsetY = 100
    // So constrained to: offsetX = max(-100, min(0, 100)) = 0
    // offsetY = max(-100, min(0, 100)) = 0
    expect(result.offsetX).toBe(0);
    expect(result.offsetY).toBe(0);
  });

  it('should constrain position when too far right', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 400;
    const displayHeight = 400;

    const result = constrainImagePosition(200, 100, displayWidth, displayHeight, cropArea);

    // maxOffsetX = 100, so should be constrained to 100
    expect(result.offsetX).toBe(100);
    expect(result.offsetY).toBe(100);
  });

  it('should constrain position when too far left', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 400;
    const displayHeight = 400;

    const result = constrainImagePosition(-200, 100, displayWidth, displayHeight, cropArea);

    // minOffsetX = 100 + 200 - 400 = -100, so should be constrained to -100
    expect(result.offsetX).toBe(-100);
    expect(result.offsetY).toBe(100);
  });

  it('should constrain position when too far down', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 400;
    const displayHeight = 400;

    const result = constrainImagePosition(100, 200, displayWidth, displayHeight, cropArea);

    // maxOffsetY = 100, so should be constrained to 100
    expect(result.offsetX).toBe(100);
    expect(result.offsetY).toBe(100);
  });

  it('should constrain position when too far up', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 400;
    const displayHeight = 400;

    const result = constrainImagePosition(100, -200, displayWidth, displayHeight, cropArea);

    // minOffsetY = 100 + 200 - 400 = -100, so should be constrained to -100
    expect(result.offsetX).toBe(100);
    expect(result.offsetY).toBe(-100);
  });

  it('should allow position within valid range', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 400;
    const displayHeight = 400;

    const result = constrainImagePosition(50, 50, displayWidth, displayHeight, cropArea);

    // Should remain unchanged as it's within valid range
    expect(result.offsetX).toBe(50);
    expect(result.offsetY).toBe(50);
  });

  it('should handle edge case when image is exactly crop area size', () => {
    const cropArea = createCropArea(100, 100, 200, 200);
    const displayWidth = 200;
    const displayHeight = 200;

    const result = constrainImagePosition(150, 150, displayWidth, displayHeight, cropArea);

    // minOffsetX = 100 + 200 - 200 = 100
    // maxOffsetX = 100
    // So offsetX must be exactly 100
    expect(result.offsetX).toBe(100);
    expect(result.offsetY).toBe(100);
  });
});

describe('isCropAreaSimilar', () => {
  const createCropArea = (
    x: number,
    y: number,
    width: number,
    height: number,
  ): CropArea => ({
    x,
    y,
    width,
    height,
  });

  it('should return true for identical crop areas', () => {
    const a = createCropArea(100, 100, 200, 200);
    const b = createCropArea(100, 100, 200, 200);

    expect(isCropAreaSimilar(a, b)).toBe(true);
  });

  it('should return true for crop areas within threshold', () => {
    const a = createCropArea(100, 100, 200, 200);
    const b = createCropArea(100.3, 100.3, 200.3, 200.3);

    expect(isCropAreaSimilar(a, b, 0.5)).toBe(true);
  });

  it('should return false for crop areas outside threshold', () => {
    const a = createCropArea(100, 100, 200, 200);
    const b = createCropArea(101, 100, 200, 200);

    expect(isCropAreaSimilar(a, b, 0.5)).toBe(false);
  });

  it('should return true when both are null', () => {
    expect(isCropAreaSimilar(null, null)).toBe(true);
  });

  it('should return false when one is null', () => {
    const a = createCropArea(100, 100, 200, 200);

    expect(isCropAreaSimilar(a, null)).toBe(false);
    expect(isCropAreaSimilar(null, a)).toBe(false);
  });

  it('should use custom threshold', () => {
    const a = createCropArea(100, 100, 200, 200);
    const b = createCropArea(100.8, 100, 200, 200);

    expect(isCropAreaSimilar(a, b, 0.5)).toBe(false);
    expect(isCropAreaSimilar(a, b, 1.0)).toBe(true);
  });

  it('should check all dimensions', () => {
    const a = createCropArea(100, 100, 200, 200);
    const b = createCropArea(100, 100, 200, 201);

    expect(isCropAreaSimilar(a, b, 0.5)).toBe(false);
  });
});

describe('isImagePositionSimilar', () => {
  const createImagePosition = (offsetX: number, offsetY: number): ImagePosition => ({
    offsetX,
    offsetY,
  });

  it('should return true for identical positions', () => {
    const a = createImagePosition(100, 100);
    const b = createImagePosition(100, 100);

    expect(isImagePositionSimilar(a, b)).toBe(true);
  });

  it('should return true for positions within threshold', () => {
    const a = createImagePosition(100, 100);
    const b = createImagePosition(100.05, 100.05);

    expect(isImagePositionSimilar(a, b, 0.1)).toBe(true);
  });

  it('should return false for positions outside threshold', () => {
    const a = createImagePosition(100, 100);
    const b = createImagePosition(100.2, 100);

    expect(isImagePositionSimilar(a, b, 0.1)).toBe(false);
  });

  it('should return true when both are null', () => {
    expect(isImagePositionSimilar(null, null)).toBe(true);
  });

  it('should return false when one is null', () => {
    const a = createImagePosition(100, 100);

    expect(isImagePositionSimilar(a, null)).toBe(false);
    expect(isImagePositionSimilar(null, a)).toBe(false);
  });

  it('should use custom threshold', () => {
    const a = createImagePosition(100, 100);
    const b = createImagePosition(100.15, 100);

    expect(isImagePositionSimilar(a, b, 0.1)).toBe(false);
    expect(isImagePositionSimilar(a, b, 0.2)).toBe(true);
  });

  it('should check both offsetX and offsetY', () => {
    const a = createImagePosition(100, 100);
    const b = createImagePosition(100, 100.2);

    expect(isImagePositionSimilar(a, b, 0.1)).toBe(false);
  });
});

