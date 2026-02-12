/**
 * File type categories for thumbnail card filetype display
 */
export type FileTypeCategory =
  | 'archive'
  | 'code'
  | 'document'
  | 'image'
  | 'media'
  | 'system';

/**
 * Mapping of file extensions to their corresponding category
 * Extensions not in this list will default to 'default' styling
 * Extensions list are defined in Figma.
 */
export const fileExtensionToCategory: Record<string, FileTypeCategory> = {
  // Image
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  bmp: 'image',
  tiff: 'image',
  svg: 'image',
  webp: 'image',
  heic: 'image',

  // Media (video & audio)
  mp4: 'media',
  avi: 'media',
  mov: 'media',
  mkv: 'media',
  wmv: 'media',
  flv: 'media',
  webm: 'media',
  mpeg: 'media',
  mp3: 'media',
  wav: 'media',
  aac: 'media',
  flac: 'media',
  ogg: 'media',
  m4a: 'media',
  wma: 'media',

  // Document
  doc: 'document',
  docx: 'document',
  xls: 'document',
  xlsx: 'document',
  ppt: 'document',
  pptx: 'document',
  pdf: 'document',
  txt: 'document',
  rtf: 'document',
  odt: 'document',
  ods: 'document',
  odp: 'document',

  // Archive
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive',
  iso: 'archive',

  // Code
  py: 'code',
  js: 'code',
  ts: 'code',
  java: 'code',
  cpp: 'code',
  c: 'code',
  h: 'code',
  cs: 'code',
  rb: 'code',
  html: 'code',
  htm: 'code',
  css: 'code',
  json: 'code',
  xml: 'code',
  yaml: 'code',
  yml: 'code',
  exe: 'code',
  bat: 'code',
  sh: 'code',
  app: 'code',

  // System
  ini: 'system',
  cfg: 'system',
  log: 'system',
  tmp: 'system',
  dat: 'system',
  dll: 'system',
  sys: 'system',
};

/**
 * Get the file type category for a given file extension
 * @param extension - File extension (with or without leading dot)
 * @returns The file type category, or undefined if not in whitelist
 */
export function getFileTypeCategory(
  extension: string,
): FileTypeCategory | undefined {
  const normalizedExtension = extension.replace(/^\./, '').toLowerCase();

  return fileExtensionToCategory[normalizedExtension];
}
