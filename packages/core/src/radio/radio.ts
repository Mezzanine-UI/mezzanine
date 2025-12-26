import {
  InputCheckGroupOrientation,
  InputCheckSize,
} from '../_internal/input-check';

export type RadioSize = InputCheckSize;

export type RadioGroupOrientation = InputCheckGroupOrientation;

export type RadioType = 'radio' | 'segment';

export const radioPrefix = 'mzn-radio';

export const radioClasses = {
  host: radioPrefix,
  size: (size: RadioSize) => `${radioPrefix}--${size}`,
  checked: `${radioPrefix}--checked`,
  focused: `${radioPrefix}--focused`,
  error: `${radioPrefix}--error`,
  segmented: `${radioPrefix}--segmented`,
  segmentedContainer: `${radioPrefix}__segmented-container`,
  segmentedContainerHaveMinWidth: `${radioPrefix}__segmented-container--have-min-width`,
  segmentedContainerWithIconText: `${radioPrefix}__segmented-container--with-icon-text`,
  wrapper: `${radioPrefix}__wrapper`,
} as const;
