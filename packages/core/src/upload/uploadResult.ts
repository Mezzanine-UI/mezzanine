import { CssVarInterpolations } from '@mezzanine-ui/system/css';
import { Size } from '@mezzanine-ui/system/size';

export type UploadResultSize = Size;
export type UploadResultStatus = 'done' | 'error' | 'loading';

export interface UploadResultCssVars {
  percentage?: number;
}

export const uploadResultPrefix = 'mzn-upload-result';

export const uploadResultClasses = {
  host: uploadResultPrefix,
  size: (size: UploadResultSize) => `${uploadResultPrefix}--${size}`,
  error: `${uploadResultPrefix}--error`,
  loading: `${uploadResultPrefix}--loading`,
  name: `${uploadResultPrefix}__name`,
  actions: `${uploadResultPrefix}__actions`,
} as const;

export function toUploadResultCssVars(variables: UploadResultCssVars): CssVarInterpolations {
  const {
    percentage,
  } = variables;

  return {
    [`--${uploadResultPrefix}-percentage`]: percentage,
  };
}
