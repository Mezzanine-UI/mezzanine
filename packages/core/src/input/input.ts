import { Size } from '@mezzanine-ui/system/size';

export type InputSize = Size;

export const inputPrefix = 'mzn-input';

export const inputClasses = {
  host: inputPrefix,
  tagsMode: `${inputPrefix}__tags-mode`,
  tagsModeInputOnTop: `${inputPrefix}__tags-mode__input-on-top`,
} as const;
