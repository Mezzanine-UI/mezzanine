import type { ComputedRef, InjectionKey } from 'vue';
import type { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import type { RadioType } from '@mezzanine-ui/core/radio';
import type { RadioGroupControlContextValue } from '../_internal/use-radio-control-value';

export interface RadioGroupContextValue extends RadioGroupControlContextValue {
  /** Whether every radio in the group is disabled. */
  disabled?: boolean;
  /** The name every radio in the group shares. */
  name?: string;
  /** The size every radio in the group takes. */
  size?: InputCheckSize;
  /** The type every radio in the group renders as. */
  type?: RadioType;
}

/**
 * Provided by `MznRadioGroup`, injected by every radio inside it.
 *
 * Carries a `ComputedRef` rather than a plain object so a radio re-renders when
 * the group's selection moves; React gets that from re-rendering the provider.
 */
export const radioGroupKey: InjectionKey<ComputedRef<RadioGroupContextValue>> =
  Symbol('MznRadioGroup');
