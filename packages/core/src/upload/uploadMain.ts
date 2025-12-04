export const uploadMainPrefix = 'mzn-upload';

export const uploadMainClasses = {
  host: uploadMainPrefix,
  hostCards: `${uploadMainPrefix}__host--cards`,
  uploadList: `${uploadMainPrefix}__upload-list`,
  uploadListCards: `${uploadMainPrefix}__upload-list--cards`,
  hints: `${uploadMainPrefix}__hints`,
  hint: (type: 'error' | 'info') => `${uploadMainPrefix}__hint--${type}`,
  fillWidthHints: `${uploadMainPrefix}__fill-width-hints`,
} as const;
