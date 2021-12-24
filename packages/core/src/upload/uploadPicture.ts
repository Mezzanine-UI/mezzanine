import { CssVarInterpolations } from '@mezzanine-ui/system/css';

export const uploadPicturePrefix = 'mzn-upload-picture';
export interface UploadPictureCssVars {
  percentage?: number;
}

export const uploadPictureClasses = {
  host: uploadPicturePrefix,
  disabled: `${uploadPicturePrefix}--disabled`,
  error: `${uploadPicturePrefix}--error`,
  loading: `${uploadPicturePrefix}--loading`,
  group: `${uploadPicturePrefix}__group`,
  status: `${uploadPicturePrefix}__status`,
  preview: `${uploadPicturePrefix}__preview`,
  delete: `${uploadPicturePrefix}__delete`,
};

export function toUploadPictureCssVars(variables: UploadPictureCssVars): CssVarInterpolations {
  const {
    percentage,
  } = variables;

  return {
    [`--${uploadPicturePrefix}-percentage`]: percentage,
  };
}
