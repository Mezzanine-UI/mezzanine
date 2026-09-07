/**
 * Supported image file extensions.
 */
const IMAGE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'bmp',
  'ico',
] as const;

/**
 * 從 File 物件或網址解析出檔案類型。
 *
 * 有 `file.type` 就用它，否則從網址副檔名推斷；兩者都沒有時回傳空字串。
 *
 * @example
 * ```ts
 * resolveFileType(file, undefined); // 'image/jpeg'
 * resolveFileType(undefined, 'https://example.com/image.jpg'); // 'image/jpeg'
 * resolveFileType(undefined, undefined); // ''
 * ```
 *
 * @see isImageFile 只問是不是圖片時用這個
 */
export function resolveFileType(file?: File, url?: string): string {
  // Prefer file.type if available
  if (file?.type) {
    return file.type;
  }

  // Infer from URL extension if URL is provided
  if (url) {
    const extension = url.split('.').pop()?.toLowerCase();

    if (
      extension &&
      IMAGE_EXTENSIONS.includes(extension as (typeof IMAGE_EXTENSIONS)[number])
    ) {
      // Normalize jpg to jpeg
      return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    }
  }

  return '';
}

/**
 * 依 File 物件或網址判斷是不是圖片。
 *
 * @example
 * ```ts
 * isImageFile(file, undefined); // file.type 以 image/ 開頭時為 true
 * isImageFile(undefined, 'https://example.com/image.jpg'); // true
 * ```
 *
 * @see resolveFileType 需要完整型別字串時用這個
 */
export function isImageFile(file?: File, url?: string): boolean {
  return resolveFileType(file, url).startsWith('image/');
}
