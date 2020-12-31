import { prefix } from './constants';

export const classes = {
  prop: (prop: string) => `${prefix}--${prop}`,
};
