import { MainColor } from '../palette';
import { MznSize } from '../size';

export type ButtonColor = Extract<MainColor, 'primary' | 'secondary' | 'error'>;
export type ButtonSize = MznSize;
export type ButtonVariant = 'contained' | 'outlined' | 'text';
