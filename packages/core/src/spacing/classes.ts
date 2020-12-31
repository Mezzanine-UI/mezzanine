import { MznspacingLevel } from './typings';
import { prefix } from './constants';

export const classes = {
  level: (level: MznspacingLevel) => `${prefix}--${level}`,
};
