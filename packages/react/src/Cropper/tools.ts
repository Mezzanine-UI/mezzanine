import { CropArea } from './typings';

export interface CropToBlobOptions {
  /**
   * The image source (URL, File, or Blob).
   */
  imageSrc: string | File | Blob;
  /**
   * The crop area coordinates and dimensions in image pixel space.
   */
  cropArea: CropArea;
  /**
   * The canvas element used for cropping.
   * If not provided, a temporary canvas will be created.
   */
  canvas?: HTMLCanvasElement;
  /**
   * The output image format.
   * @default 'image/png'
   */
  format?: string;
  /**
   * The output image quality (0-1).
   * Only applies to 'image/jpeg' and 'image/webp' formats.
   * @default 0.92
   */
  quality?: number;
  /**
   * The output image width in pixels.
   * If not provided, uses the crop area width.
   */
  outputWidth?: number;
  /**
   * The output image height in pixels.
   * If not provided, uses the crop area height.
   */
  outputHeight?: number;
}

/**
 * Converts a cropped image area to a Blob.
 *
 * @param options - The cropping options
 * @returns A Promise that resolves to a Blob of the cropped image
 *
 * @example
 * ```tsx
 * const blob = await cropToBlob({
 *   imageSrc: 'https://example.com/image.jpg',
 *   cropArea: { x: 100, y: 100, width: 200, height: 200 },
 *   format: 'image/jpeg',
 *   quality: 0.9,
 * });
 * ```
 */
export async function cropToBlob(
  options: CropToBlobOptions,
): Promise<Blob> {
  const {
    imageSrc,
    cropArea,
    canvas: providedCanvas,
    format = 'image/png',
    quality = 0.92,
    outputWidth,
    outputHeight,
  } = options;

  // Load image
  const img = await loadImage(imageSrc);

  // Create or use provided canvas
  const canvas = providedCanvas || document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Crop area is already in image pixel space
  const actualCropX = cropArea.x;
  const actualCropY = cropArea.y;
  const actualCropWidth = cropArea.width;
  const actualCropHeight = cropArea.height;

  // Set canvas size to output dimensions or crop area dimensions
  const finalWidth = outputWidth || cropArea.width;
  const finalHeight = outputHeight || cropArea.height;

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Draw the cropped portion of the image
  ctx.drawImage(
    img,
    actualCropX,
    actualCropY,
    actualCropWidth,
    actualCropHeight,
    0,
    0,
    finalWidth,
    finalHeight,
  );

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      format,
      quality,
    );
  });
}

/**
 * Converts a cropped image area to a File.
 *
 * @param options - The cropping options
 * @param filename - The filename for the output file
 * @returns A Promise that resolves to a File of the cropped image
 *
 * @example
 * ```tsx
 * const file = await cropToFile(
 *   {
 *     imageSrc: fileInput.files[0],
 *     cropArea: { x: 100, y: 100, width: 200, height: 200 },
 *   },
 *   'cropped-image.jpg',
 * );
 * ```
 */
export async function cropToFile(
  options: CropToBlobOptions,
  filename: string,
): Promise<File> {
  const blob = await cropToBlob(options);
  return new File([blob], filename, { type: blob.type });
}

/**
 * Converts a cropped image area to a data URL.
 *
 * @param options - The cropping options
 * @returns A Promise that resolves to a data URL string of the cropped image
 *
 * @example
 * ```tsx
 * const dataUrl = await cropToDataURL({
 *   imageSrc: 'https://example.com/image.jpg',
 *   cropArea: { x: 100, y: 100, width: 200, height: 200 },
 *   format: 'image/jpeg',
 *   quality: 0.9,
 * });
 * ```
 */
export async function cropToDataURL(
  options: CropToBlobOptions,
): Promise<string> {
  const {
    imageSrc,
    cropArea,
    canvas: providedCanvas,
    format = 'image/png',
    quality = 0.92,
    outputWidth,
    outputHeight,
  } = options;

  // Load image
  const img = await loadImage(imageSrc);

  // Create or use provided canvas
  const canvas = providedCanvas || document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Crop area is already in image pixel space
  const actualCropX = cropArea.x;
  const actualCropY = cropArea.y;
  const actualCropWidth = cropArea.width;
  const actualCropHeight = cropArea.height;

  // Set canvas size to output dimensions or crop area dimensions
  const finalWidth = outputWidth || cropArea.width;
  const finalHeight = outputHeight || cropArea.height;

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Draw the cropped portion of the image
  ctx.drawImage(
    img,
    actualCropX,
    actualCropY,
    actualCropWidth,
    actualCropHeight,
    0,
    0,
    finalWidth,
    finalHeight,
  );

  return canvas.toDataURL(format, quality);
}

/**
 * Helper function to load an image from various sources.
 */
async function loadImage(
  src: string | File | Blob,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = reject;

    if (typeof src === 'string') {
      img.src = src;
    } else {
      const url = URL.createObjectURL(src);
      img.src = url;
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
    }
  });
}

