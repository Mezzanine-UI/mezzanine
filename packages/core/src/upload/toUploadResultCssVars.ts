import { CssVarInterpolations } from '../css';
import { uploadResultPrefix } from './constants';
import { UploadResultCssVars } from './typings';

export function toUploadResultCssVars(variables: UploadResultCssVars): CssVarInterpolations {
  const {
    percentage,
  } = variables;

  return {
    [`--${uploadResultPrefix}-percentage`]: percentage,
  };
}
