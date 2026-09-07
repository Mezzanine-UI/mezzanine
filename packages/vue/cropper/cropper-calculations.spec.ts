import {
  calculateInitialCropArea,
  constrainImagePosition,
  getBaseDisplaySize,
  getBaseScale,
  isCropAreaSimilar,
  isImagePositionSimilar,
} from './cropper-calculations';

const rect = (width: number, height: number): DOMRect =>
  ({
    bottom: height,
    height,
    left: 0,
    right: width,
    toJSON: () => ({}),
    top: 0,
    width,
    x: 0,
    y: 0,
  }) as DOMRect;

const image = (width: number, height: number): HTMLImageElement =>
  ({ height, width }) as HTMLImageElement;

describe('getBaseScale', () => {
  it('should take the smaller of the two ratios so the image covers the canvas', () => {
    expect(getBaseScale(rect(800, 600), image(1600, 900))).toBe(1.5);
  });

  it('should return 1 when the rect has no height', () => {
    expect(getBaseScale(rect(800, 0), image(1600, 900))).toBe(1);
  });

  it('should return 1 when the rect has no width', () => {
    expect(getBaseScale(rect(0, 600), image(1600, 900))).toBe(1);
  });
});

describe('getBaseDisplaySize', () => {
  it('should divide the image by the base scale', () => {
    expect(getBaseDisplaySize(rect(800, 600), image(1600, 900))).toEqual({
      height: 600,
      width: 1066.6666666666667,
    });
  });

  it('should fall back to the image size when the rect has no height', () => {
    expect(getBaseDisplaySize(rect(800, 0), image(1600, 900))).toEqual({
      height: 900,
      width: 1600,
    });
  });
});

describe('calculateInitialCropArea', () => {
  it('should fill the whole canvas when no aspect ratio is given', () => {
    const { cropArea } = calculateInitialCropArea(
      image(1600, 900),
      rect(800, 600),
    );

    expect(cropArea).toEqual({ height: 600, width: 800, x: 0, y: 0 });
  });

  it('should centre the image over the canvas', () => {
    const { baseDisplayHeight, baseDisplayWidth, imagePosition } =
      calculateInitialCropArea(image(1600, 900), rect(800, 600));

    expect(baseDisplayWidth).toBeCloseTo(1066.667, 3);
    expect(baseDisplayHeight).toBe(600);
    expect(imagePosition.offsetX).toBeCloseTo(-133.333, 3);
    expect(imagePosition.offsetY).toBe(0);
  });

  it('should fill the canvas height when the ratio is height limited', () => {
    const { cropArea } = calculateInitialCropArea(
      image(1600, 900),
      rect(800, 600),
      1,
    );

    expect(cropArea).toEqual({ height: 600, width: 600, x: 100, y: 0 });
  });

  it('should fill the canvas width when the ratio is width limited', () => {
    const { cropArea } = calculateInitialCropArea(
      image(1600, 900),
      rect(800, 600),
      16 / 9,
    );

    expect(cropArea.width).toBe(800);
    expect(cropArea.height).toBe(450);
    expect(cropArea.x).toBe(0);
    expect(cropArea.y).toBe(75);
  });
});

describe('constrainImagePosition', () => {
  const cropArea = { height: 100, width: 100, x: 50, y: 50 };

  it('should leave a position that already covers the crop area alone', () => {
    expect(constrainImagePosition(0, 0, 400, 400, cropArea)).toEqual({
      offsetX: 0,
      offsetY: 0,
    });
  });

  it('should stop the image at the crop area on the way right', () => {
    expect(constrainImagePosition(999, 0, 400, 400, cropArea)).toEqual({
      offsetX: 50,
      offsetY: 0,
    });
  });

  it('should stop the image at the crop area on the way left', () => {
    expect(constrainImagePosition(-999, 0, 400, 400, cropArea)).toEqual({
      offsetX: -250,
      offsetY: 0,
    });
  });

  it('should stop the image at the crop area vertically', () => {
    expect(constrainImagePosition(0, 999, 400, 400, cropArea)).toEqual({
      offsetX: 0,
      offsetY: 50,
    });
    expect(constrainImagePosition(0, -999, 400, 400, cropArea)).toEqual({
      offsetX: 0,
      offsetY: -250,
    });
  });

  it('should pin the image when it is exactly the crop area size', () => {
    expect(constrainImagePosition(0, 0, 100, 100, cropArea)).toEqual({
      offsetX: 50,
      offsetY: 50,
    });
  });
});

describe('isCropAreaSimilar', () => {
  const base = { height: 100, width: 100, x: 10, y: 10 };

  it('should treat a sub-threshold difference as the same area', () => {
    expect(isCropAreaSimilar(base, { ...base, x: 10.4 })).toBe(true);
  });

  it('should treat a difference at the threshold as a change', () => {
    expect(isCropAreaSimilar(base, { ...base, x: 10.5 })).toBe(false);
  });

  it('should look at every dimension', () => {
    expect(isCropAreaSimilar(base, { ...base, height: 101 })).toBe(false);
    expect(isCropAreaSimilar(base, { ...base, width: 101 })).toBe(false);
    expect(isCropAreaSimilar(base, { ...base, y: 11 })).toBe(false);
  });

  it('should honour a custom threshold', () => {
    expect(isCropAreaSimilar(base, { ...base, x: 12 }, 5)).toBe(true);
  });

  it('should compare by identity when either side is null', () => {
    expect(isCropAreaSimilar(null, null)).toBe(true);
    expect(isCropAreaSimilar(base, null)).toBe(false);
    expect(isCropAreaSimilar(null, base)).toBe(false);
  });
});

describe('isImagePositionSimilar', () => {
  const base = { offsetX: 10, offsetY: 20 };

  it('should treat a sub-threshold difference as the same position', () => {
    expect(isImagePositionSimilar(base, { ...base, offsetX: 10.05 })).toBe(
      true,
    );
  });

  it('should look at both offsets', () => {
    expect(isImagePositionSimilar(base, { ...base, offsetX: 11 })).toBe(false);
    expect(isImagePositionSimilar(base, { ...base, offsetY: 21 })).toBe(false);
  });

  it('should honour a custom threshold', () => {
    expect(isImagePositionSimilar(base, { ...base, offsetY: 20.5 }, 1)).toBe(
      true,
    );
  });

  it('should compare by identity when either side is null', () => {
    expect(isImagePositionSimilar(null, null)).toBe(true);
    expect(isImagePositionSimilar(base, null)).toBe(false);
  });
});
