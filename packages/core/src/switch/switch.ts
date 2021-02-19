import type { IconDefinition } from '@mezzanine-ui/icons';
import { MznSize } from '../size';

export type SwitchSize = Extract<MznSize, 'medium' | 'large'>;

export const switchPrefix = 'mzn-switch';

export const SwitchSpinnerIcon: IconDefinition = {
  name: 'switch-spinner-icon',
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

export const switchClasses = {
  host: switchPrefix,
  checked: `${switchPrefix}--checked`,
  disabled: `${switchPrefix}--disabled`,
  large: `${switchPrefix}--large`,
  control: `${switchPrefix}__control`,
  input: `${switchPrefix}__input`,
} as const;
