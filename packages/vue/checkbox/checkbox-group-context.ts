import type { ComputedRef, InjectionKey } from 'vue';
import type { CheckboxGroupControlContextValue } from '../_internal/use-checkbox-control-value';

export interface CheckboxGroupContextValue
  extends CheckboxGroupControlContextValue {
  /** Whether every checkbox in the group is disabled. */
  disabled?: boolean;
  /** The name every checkbox in the group shares. */
  name?: string;
}

/**
 * Provided by `MznCheckboxGroup`, injected by every checkbox inside it.
 */
export const checkboxGroupKey: InjectionKey<
  ComputedRef<CheckboxGroupContextValue>
> = Symbol('MznCheckboxGroup');
