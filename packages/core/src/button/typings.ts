import { MznOrientation } from '../orientation';
import { MainColor } from '../palette';
import { MznSize } from '../size';
import { MznSpacingLevel } from '../spacing';

export type ButtonColor = Extract<MainColor, 'primary' | 'secondary' | 'error'>;
export type ButtonGroupOrientation = MznOrientation;
export type ButtonGroupSpacing = MznSpacingLevel;
export type ButtonSize = MznSize;
export type ButtonVariant = 'contained' | 'outlined' | 'text';

export interface ButtonGroupCssVars {
  size: ButtonSize;
  spacing?: ButtonGroupSpacing;
}
