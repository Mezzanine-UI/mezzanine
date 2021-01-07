import { MainColor } from '../palette';
import { MznSize } from '../size';

export type SelectionColor = Extract<MainColor, 'primary' | 'secondary' | 'error'>;
export type SelectionSize = MznSize;
