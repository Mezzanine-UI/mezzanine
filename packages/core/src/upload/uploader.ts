export const uploaderPrefix = 'mzn-uploader';

export type UploadType = 'base' | 'button';

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
