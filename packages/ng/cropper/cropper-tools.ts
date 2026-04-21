import type { CropArea } from './cropper-element.component';

export interface CropToBlobOptions {
  /**
   * The image source (URL, File, or Blob).
   */
  readonly imageSrc: string | File | Blob;
  /**
   * The crop area coordinates and dimensions in image pixel space.
   */
  readonly cropArea: CropArea;
  /**
   * The canvas element used for cropping.
   * If not provided, a temporary canvas will be created.
   */
  readonly canvas?: HTMLCanvasElement;
  /**
   * The output image format.
   * @default 'image/png'
   */
  readonly format?: string;
  /**
   * The output image quality (0-1).
   * Only applies to 'image/jpeg' and 'image/webp' formats.
   * @default 0.92
   */
  readonly quality?: number;
  /**
   * The output image width in pixels.
   * If not provided, uses the crop area width.
   */
  readonly outputWidth?: number;
  /**
   * The output image height in pixels.
   * If not provided, uses the crop area height.
   */
  readonly outputHeight?: number;
}

/**
 * Load an image from a URL, File, or Blob.
 */
export function loadImage(
  src: string | File | Blob,
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    let objectUrl: string | null = null;
    img.crossOrigin = 'anonymous';

    img.onload = (): void => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      resolve(img);
    };

    img.onerror = (error): void => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(error);
    };

    if (typeof src === 'string') {
      img.src = src;
    } else {
      objectUrl = URL.createObjectURL(src);
      img.src = objectUrl;
    }
  });
}

/**
 * Converts a cropped image area to a Blob.
 *
 * @param options - The cropping options
 * @returns A Promise that resolves to a Blob of the cropped image
 *
 * @example
 * ```ts
 * import { cropToBlob } from '@mezzanine-ui/ng/cropper';
 *
 * const blob = await cropToBlob({
 *   imageSrc: 'https://example.com/image.jpg',
 *   cropArea: { x: 100, y: 100, width: 200, height: 200 },
 *   format: 'image/jpeg',
 *   quality: 0.9,
 * });
 * ```
 */
export async function cropToBlob(options: CropToBlobOptions): Promise<Blob> {
  const {
    canvas: providedCanvas,
    cropArea,
    format = 'image/png',
    imageSrc,
    outputHeight,
    outputWidth,
    quality = 0.92,
  } = options;

  const img = await loadImage(imageSrc);
  const canvas = providedCanvas ?? document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const finalWidth = outputWidth ?? cropArea.width;
  const finalHeight = outputHeight ?? cropArea.height;

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    finalWidth,
    finalHeight,
  );

  return new Promise<Blob>((resolve, reject) => {
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
 * ```ts
 * import { cropToFile } from '@mezzanine-ui/ng/cropper';
 *
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
 * ```ts
 * import { cropToDataURL } from '@mezzanine-ui/ng/cropper';
 *
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
    canvas: providedCanvas,
    cropArea,
    format = 'image/png',
    imageSrc,
    outputHeight,
    outputWidth,
    quality = 0.92,
  } = options;

  const img = await loadImage(imageSrc);
  const canvas = providedCanvas ?? document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const finalWidth = outputWidth ?? cropArea.width;
  const finalHeight = outputHeight ?? cropArea.height;

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    finalWidth,
    finalHeight,
  );

  return canvas.toDataURL(format, quality);
}
