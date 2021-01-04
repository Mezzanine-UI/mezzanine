import { toCssVar } from '../css';
import { MznSpacingLevel } from './typings';
import { spacingPrefix } from './constants';

export function toSpacingCssVar(level: MznSpacingLevel) {
  return toCssVar(`${spacingPrefix}-${level}`);
}
