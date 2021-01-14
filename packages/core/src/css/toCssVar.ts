import { CssVarInterpolation } from './typings';

export function toCssVar(varname: string, fallback?: CssVarInterpolation) {
  return `var(--${varname}${fallback ? `, ${fallback}` : ''})`;
}
