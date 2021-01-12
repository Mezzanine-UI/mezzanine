import { selectionPrefix } from './constants';
import { SelectionSize } from './typings';

export const selectionClasses = {
  host: selectionPrefix,
  select: `${selectionPrefix}--select`,
  input: `${selectionPrefix}--input`,
  size: (size: SelectionSize) => `${selectionPrefix}--${size}`,
  label: (size: SelectionSize) => `${selectionPrefix}--${size}--label`,
};
