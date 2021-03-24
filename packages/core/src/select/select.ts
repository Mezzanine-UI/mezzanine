import { Size } from '@mezzanine-ui/system/size';

export type SelectInputSize = Size;

export const selectPrefix = 'mzn-select';

export const selectClasses = {
  host: selectPrefix,
  overlay: `${selectPrefix}__overlay`,
  popper: `${selectPrefix}__popper`,
  suffixIconActive: `${selectPrefix}__text-field__suffix-icon--active`,
  tags: `${selectPrefix}__text-field__tags`,
  textField: `${selectPrefix}__text-field`,
} as const;
