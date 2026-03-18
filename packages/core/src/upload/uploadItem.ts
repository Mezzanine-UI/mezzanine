export const uploadItemPrefix = 'mzn-upload-item';

/**
 * 上傳項目的狀態。
 * - `'done'` — 上傳完成
 * - `'error'` — 上傳錯誤
 * - `'loading'` — 上傳中
 */
export type UploadItemStatus = 'done' | 'error' | 'loading';

/**
 * 上傳項目的尺寸規格。
 * - `'main'` — 主要尺寸（較大）
 * - `'sub'` — 次要尺寸（較小）
 */
export type UploadItemSize = 'main' | 'sub';

/**
 * 上傳項目的預覽類型。
 * - `'icon'` — 以圖示呈現
 * - `'thumbnail'` — 以縮圖呈現
 */
export type UploadItemType = 'icon' | 'thumbnail';

export const uploadItemClasses = {
  host: uploadItemPrefix,
  singleLineContent: `${uploadItemPrefix}--single-line-content`,
  container: `${uploadItemPrefix}__container`,
  icon: `${uploadItemPrefix}__icon`,
  thumbnail: `${uploadItemPrefix}__thumbnail`,
  contentWrapper: `${uploadItemPrefix}__content-wrapper`,
  content: `${uploadItemPrefix}__content`,
  name: `${uploadItemPrefix}__name`,
  fontSize: `${uploadItemPrefix}__font-size`,
  size: (size: UploadItemSize) => `${uploadItemPrefix}__size--${size}`,
  actions: `${uploadItemPrefix}__actions`,
  closeIcon: `${uploadItemPrefix}__close-icon`,
  errorMessage: `${uploadItemPrefix}__error-message`,
  errorIcon: `${uploadItemPrefix}__error-icon`,
  errorMessageText: `${uploadItemPrefix}__error-message-text`,
  error: `${uploadItemPrefix}--error`,
  alignCenter: `${uploadItemPrefix}--align-center`,
  loadingIcon: `${uploadItemPrefix}__loading-icon`,
  downloadIcon: `${uploadItemPrefix}__download-icon`,
  deleteContent: `${uploadItemPrefix}__delete-content`,
  deleteIcon: `${uploadItemPrefix}__delete-icon`,
  resetIcon: `${uploadItemPrefix}__reset-icon`,
  disabled: `${uploadItemPrefix}--disabled`,
} as const;
