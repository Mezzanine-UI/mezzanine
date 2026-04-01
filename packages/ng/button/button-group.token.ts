import { InjectionToken } from '@angular/core';
import { ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';

export interface MznButtonGroupContext {
  readonly disabled: boolean;
  readonly size: ButtonSize;
  readonly variant: ButtonVariant;
}

/**
 * ButtonGroup 透過此 token 向子 MznButton 提供預設 variant / size / disabled。
 * 子元件可透過 `inject(MZN_BUTTON_GROUP, { optional: true })` 取得。
 */
export const MZN_BUTTON_GROUP = new InjectionToken<MznButtonGroupContext>(
  'MznButtonGroup',
);
