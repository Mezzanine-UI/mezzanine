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

type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];

/**
 * Resolves the file type from a File object or URL.
 * Prefers file.type if available, otherwise infers from URL extension.
 *
 * @param file - The File object (optional)
 * @param url - The URL string (optional)
 * @returns The resolved MIME type string, or empty string if unable to determine
 */
export function resolveFileType(file?: File, url?: string): string {
  if (file?.type) {
    return file.type;
  }

  if (url) {
    const extension = url.split('.').pop()?.toLowerCase();

    if (extension && IMAGE_EXTENSIONS.includes(extension as ImageExtension)) {
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
 */
export function isImageFile(file?: File, url?: string): boolean {
  return resolveFileType(file, url).startsWith('image/');
}

/**
 * Extracts a file name from a URL string.
 *
 * @param url - The URL string
 * @returns The file name extracted from the URL path, or empty string if unavailable
 */
export function extractFileNameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);

    return parsed.pathname.split('/').pop() ?? '';
  } catch {
    const withoutQuery = url.split('?')[0].split('#')[0];

    return withoutQuery.split('/').pop() ?? '';
  }
}
