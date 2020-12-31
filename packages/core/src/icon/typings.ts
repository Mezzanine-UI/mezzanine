import { MainColor } from '../palette';

export type IconColor =
  | 'inherit'
  | MainColor
  | 'disabled';

export interface IconCssVars {
  color?: IconColor;
}
