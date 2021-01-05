import { TextColor, MainColor, Color } from '../palette';
import { MznSize } from '../size';

export type InputTextColor = Extract<TextColor, `text-${'primary' | 'secondary' | 'disabled'}`>;
export type InputBoarderColor = Extract<Color, MainColor | 'border' | 'primary' | 'error'>;

export type InputSize = MznSize;
