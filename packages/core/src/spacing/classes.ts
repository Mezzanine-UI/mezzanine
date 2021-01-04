import { MznSpacingLevel } from './typings';
import { prefix } from './constants';

export const classes = {
  level: (level: MznSpacingLevel) => `${prefix}--${level}`,
};
