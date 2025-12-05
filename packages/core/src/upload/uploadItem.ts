export const uploadItemPrefix = 'mzn-upload-item';

export type UploadItemStatus = 'done' | 'error' | 'loading';

export type UploadItemSize = 'main' | 'sub';

export const uploadItemClasses = {
  host: uploadItemPrefix,
  container: `${uploadItemPrefix}__container`,
  icon: `${uploadItemPrefix}__icon`,
  contentWrapper: `${uploadItemPrefix}__content-wrapper`,
  content: `${uploadItemPrefix}__content`,
  name: `${uploadItemPrefix}__name`,
  fontSize: `${uploadItemPrefix}__font-size`,
  size: (size: UploadItemSize) => `${uploadItemPrefix}__size--${size}`,
  actions: `${uploadItemPrefix}__actions`,
  closeIcon: `${uploadItemPrefix}__close-icon`,
  error: `${uploadItemPrefix}--error`,
  alignCenter: `${uploadItemPrefix}--align-center`,
  loadingIcon: `${uploadItemPrefix}__loading-icon`,
  downloadIcon: `${uploadItemPrefix}__download-icon`,
  deleteContent: `${uploadItemPrefix}__delete-content`,
  deleteIconIcon: `${uploadItemPrefix}__delete-icon`,
  resetIcon: `${uploadItemPrefix}__reset-icon`,
  disabled: `${uploadItemPrefix}--disabled`,
} as const;
