import { toCssVar } from '../css';
import { SpacingLevel } from './typings';
import { spacingPrefix } from './constants';

/** @deprecated */
export function toSpacingCssVar(level: SpacingLevel) {
  return toCssVar(`${spacingPrefix}-${level}`);
}
