import type { IconDefinition } from '@mezzanine-ui/icons';
import { Size } from '@mezzanine-ui/system/size';

export type ToggleSize = Extract<Size, 'medium' | 'large'>;

export const togglePrefix = 'mzn-toggle';

export const ToggleSpinnerIcon: IconDefinition = {
  name: 'toggle-spinner-icon',
  definition: {
    svg: {
      viewBox: '0 0 24 24',
    },
    path: {
      fill: 'currentColor',
      fillRule: 'evenodd',
      d: 'M 12 3 L12 2 A10 10, 0 0 1 22 12 L21 12 A10 10, 0 0 0 12 3Z',
    },
  },
};

export const toggleClasses = {
  host: togglePrefix,
  checked: `${togglePrefix}--checked`,
  disabled: `${togglePrefix}--disabled`,
  large: `${togglePrefix}--large`,
  control: `${togglePrefix}__control`,
  input: `${togglePrefix}__input`,
} as const;
