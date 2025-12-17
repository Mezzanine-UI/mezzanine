/**
 * Supported image file extensions.
 */
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'] as const;

/**
 * Resolves the file type from a File object or URL.
 * Prefers file.type if available, otherwise infers from URL extension.
 *
 * @param file - The File object (optional)
 * @param url - The URL string (optional)
 * @returns The resolved MIME type string, or empty string if unable to determine
 *
 * @example
 * ```ts
 * // From file object
 * resolveFileType(file, undefined) // 'image/jpeg'
 *
 * // From URL
 * resolveFileType(undefined, 'https://example.com/image.jpg') // 'image/jpeg'
 *
 * // Neither provided
 * resolveFileType(undefined, undefined) // ''
 * ```
 */
export function resolveFileType(file?: File, url?: string): string {
  // Prefer file.type if available
  if (file?.type) {
    return file.type;
  }

  // Infer from URL extension if URL is provided
  if (url) {
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension && IMAGE_EXTENSIONS.includes(extension as typeof IMAGE_EXTENSIONS[number])) {
      // Normalize jpg to jpeg
      return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    }
  }

  return '';
}

/**
 * Checks if a file is an image based on File object or URL.
 *
 * @param file - The File object (optional)
 * @param url - The URL string (optional)
 * @returns true if the file is an image, false otherwise
 *
 * @example
 * ```ts
 * // From file object
 * isImageFile(file, undefined) // true if file.type starts with 'image/'
 *
 * // From URL
 * isImageFile(undefined, 'https://example.com/image.jpg') // true
 *
 * // Neither provided
 * isImageFile(undefined, undefined) // false
 * ```
 */
export function isImageFile(file?: File, url?: string): boolean {
  const fileType = resolveFileType(file, url);
  return fileType.startsWith('image/');
}

