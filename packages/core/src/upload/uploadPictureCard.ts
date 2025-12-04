import type { UploadItemStatus } from './uploadItem';

export const uploadPictureCardPrefix = 'mzn-upload-picture-card';

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
  image: `${uploadPictureCardPrefix}__image`,
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
  error: `${uploadPictureCardPrefix}--error`,
  disabled: `${uploadPictureCardPrefix}--disabled`,
} as const;
