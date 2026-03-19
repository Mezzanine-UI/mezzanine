import type { UploadItemStatus } from './uploadItem';

export const uploadPictureCardPrefix = 'mzn-upload-picture-card';

/**
 * 圖片上傳卡片的尺寸規格。
 * - `'main'` — 主要尺寸（最大）
 * - `'sub'` — 次要尺寸（中）
 * - `'minor'` — 最小尺寸
 */
export type UploadPictureCardSize = 'main' | 'sub' | 'minor';

export type UploadSize = Exclude<UploadPictureCardSize, 'minor'>;

export type UploadPictureCardImageFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'none'
  | 'scale-down';

export const uploadPictureCardClasses = {
  host: uploadPictureCardPrefix,
  container: `${uploadPictureCardPrefix}__container`,
  content: `${uploadPictureCardPrefix}__content`,
  name: `${uploadPictureCardPrefix}__name`,
  size: (size: UploadPictureCardSize) =>
    `${uploadPictureCardPrefix}__size--${size}`,
  actions: `${uploadPictureCardPrefix}__actions`,
  actionsStatus: (status: UploadItemStatus) =>
    `${uploadPictureCardPrefix}__actions--${status}`,
  clearActionsIcon: `${uploadPictureCardPrefix}__clear-actions-icon`,
  tools: `${uploadPictureCardPrefix}__tools`,
  toolsContent: `${uploadPictureCardPrefix}__tools-content`,
  loadingIcon: `${uploadPictureCardPrefix}__loading-icon`,
  errorMessage: `${uploadPictureCardPrefix}__error-message`,
  errorMessageText: `${uploadPictureCardPrefix}__error-message-text`,
  errorIcon: `${uploadPictureCardPrefix}__error-icon`,
  error: `${uploadPictureCardPrefix}--error`,
  disabled: `${uploadPictureCardPrefix}--disabled`,
  readable: `${uploadPictureCardPrefix}--readable`,
  replaceMode: `${uploadPictureCardPrefix}--replace-mode`,
  replaceLabel: `${uploadPictureCardPrefix}__replace-label`,
} as const;

/**
 * Default error message for upload picture card when upload fails.
 */
export const defaultUploadPictureCardErrorMessage = 'Upload error';
