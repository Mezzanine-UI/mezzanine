export const uploaderPrefix = 'mzn-uploader';

/**
 * 上傳器的觸發類型。
 * - `'base'` — 基本拖放區域
 * - `'button'` — 按鈕觸發
 */
export type UploadType = 'base' | 'button';

/**
 * 上傳器提示訊息的類型。
 * - `'error'` — 錯誤提示
 * - `'info'` — 一般資訊提示
 */
export type UploaderHintType = 'error' | 'info';

export type UploadPictureControl = {
  getData: () => void;
};

export const uploaderClasses = {
  host: uploaderPrefix,
  input: `${uploaderPrefix}__input`,
  type: (type: UploadType) => `${uploaderPrefix}--${type}`,
  fillWidth: `${uploaderPrefix}--fill-width`,
  dragging: `${uploaderPrefix}--dragging`,
  disabled: `${uploaderPrefix}--disabled`,
  uploadContent: `${uploaderPrefix}__upload-content`,
  uploadLabel: `${uploaderPrefix}__upload-label`,
  clickToUpload: `${uploaderPrefix}__click-to-upload`,
  fillWidthHints: `${uploaderPrefix}__fill-width-hints`,
  uploadIcon: `${uploaderPrefix}__upload-icon`,
} as const;
