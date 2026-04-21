import { InjectionToken, Signal } from '@angular/core';
import { RadioType } from '@mezzanine-ui/core/radio';
import { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';

/** RadioGroup 提供給子 Radio 的共享狀態。 */
export interface RadioGroupContextValue {
  readonly disabled: Signal<boolean>;
  readonly name: Signal<string>;
  readonly size: Signal<InputCheckSize>;
  readonly type: Signal<RadioType>;
  readonly value: Signal<string>;
  readonly select: (val: string) => void;
}

/**
 * RadioGroup → Radio 的 DI token。
 */
export const MZN_RADIO_GROUP = new InjectionToken<RadioGroupContextValue>(
  'MZN_RADIO_GROUP',
);
