import { InjectionToken, Signal } from '@angular/core';
import { CheckboxMode, CheckboxSize } from '@mezzanine-ui/core/checkbox';

/** CheckboxGroup 提供給子 Checkbox 的共享狀態。 */
export interface CheckboxGroupContextValue {
  readonly disabled: Signal<boolean>;
  readonly mode: Signal<CheckboxMode>;
  readonly name: Signal<string>;
  readonly size: Signal<CheckboxSize>;
  readonly value: Signal<ReadonlyArray<string>>;
  readonly toggle: (val: string) => void;
}

/**
 * CheckboxGroup → Checkbox 的 DI token。
 * 子 Checkbox 透過 `inject(MZN_CHECKBOX_GROUP, { optional: true })` 讀取群組狀態。
 */
export const MZN_CHECKBOX_GROUP = new InjectionToken<CheckboxGroupContextValue>(
  'MZN_CHECKBOX_GROUP',
);
