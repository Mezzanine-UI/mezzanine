import { InjectionToken } from '@angular/core';
import { ButtonColor, ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';

export interface MznButtonGroupControlInputs {
  color?: ButtonColor;
  danger?: boolean;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const MznButtonGroupControlInputsToken = new InjectionToken<MznButtonGroupControlInputs>('MznButtonGroupToken');
