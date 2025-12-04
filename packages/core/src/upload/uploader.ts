export const uploadPrefix = 'mzn-uploader';

export type UploadType = 'base' | 'button';
export type UploadMode = 'list' | 'card' | 'card-wall';
export type UploadHintPosition = 'top' | 'bottom';

export type UploadPictureControl = {
  getData: () => void;
};

export const uploadClasses = {
  host: uploadPrefix,
  input: `${uploadPrefix}__input`,
  label: `${uploadPrefix}__label`,
  type: (type: UploadType) => `${uploadPrefix}--${type}`,
  mode: (mode: UploadMode) => `${uploadPrefix}--${mode}`,
  fillWidth: `${uploadPrefix}--fill-width`,
  dragging: `${uploadPrefix}--dragging`,
  disabled: `${uploadPrefix}--disabled`,
  // label
  uploadContent: `${uploadPrefix}__upload-content`,
  uploadLabel: `${uploadPrefix}__upload-label`,
  uploadLabelRow: `${uploadPrefix}__upload-label-row`,
  clickToUpload: `${uploadPrefix}__click-to-upload`,
  fillWidthHints: `${uploadPrefix}__fill-width-hints`,
  // icon
  uploadIcon: `${uploadPrefix}__upload-icon`,
} as const;
