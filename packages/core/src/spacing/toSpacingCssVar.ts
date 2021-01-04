import { toCssVar } from '../css';
import { MznSpacingLevel } from './typings';
import { prefix } from './constants';

export function toSpacingCssVar(level: MznSpacingLevel) {
  return toCssVar(`${prefix}-${level}`);
}
