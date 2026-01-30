import { Size } from '@mezzanine-ui/system/size';

export type AutoCompleteInputSize = Size;
export type AutoCompleteMode = 'single' | 'multiple';
export type AutoCompleteTriggerType = 'default' | 'error';

export type AutoCompleteSelector = 'input' | 'selection';

export const autocompletePrefix = 'mzn-autocomplete';

export const autocompleteClasses = {
  host: autocompletePrefix,
  hostFullWidth: `${autocompletePrefix}--full-width`,
  hostInsideClosed: `${autocompletePrefix}--inside-closed`,
  hostMode: (mode: AutoCompleteMode) => `${autocompletePrefix}--${mode}`,
} as const;
