export const uploadPrefix = 'mzn-upload';

export const uploadClasses = {
  host: uploadPrefix,
  hostCards: `${uploadPrefix}__host--cards`,
  uploadButtonList: `${uploadPrefix}__upload-button-list`,
  uploadList: `${uploadPrefix}__upload-list`,
  uploadListCards: `${uploadPrefix}__upload-list--cards`,
  hints: `${uploadPrefix}__hints`,
  hint: (type: 'error' | 'info') => `${uploadPrefix}__hint--${type}`,
  fillWidthHints: `${uploadPrefix}__fill-width-hints`,
} as const;
