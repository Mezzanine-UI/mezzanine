import { MznSize } from '../size';
import { MainColor } from '../palette';

export type CheckboxSize = MznSize;
export type CheckboxColor = Extract<MainColor, 'primary' | 'secondary' | 'error'>;

export interface CheckboxCssVars {
  color?: CheckboxColor;
}
