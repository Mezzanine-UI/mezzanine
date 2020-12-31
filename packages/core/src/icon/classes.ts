import { classes as cssClasses } from '../css';
import { prefix } from './constants';

export const classes = {
  host: prefix,
  color: cssClasses.prop('color'),
  spin: `${prefix}--spin`,
};
