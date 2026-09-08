import type { ComputedRef, InjectionKey } from 'vue';
import type { SeverityWithInfo } from '@mezzanine-ui/system/severity';

/**
 * The form-level state a field inherits from its surrounding form control.
 *
 * Mirrors React's `FormControlContext`. A field reads it only as a fallback:
 * its own prop always wins, and the context fills in when the prop is absent.
 */
export interface FormControl {
  /**
   * Whether every field inside the form control is disabled.
   */
  disabled: boolean;
  /**
   * Whether every field inside the form control takes the full width.
   */
  fullWidth: boolean;
  /**
   * Whether the form control is marked as required.
   */
  required: boolean;
  /**
   * The severity the form control is currently reporting.
   */
  severity?: SeverityWithInfo;
}

/**
 * Provided by `MznFormField` once Form is ported; injected by every field that
 * inherits from it. It carries a `ComputedRef` rather than a plain object so a
 * field re-renders when the form control's own state changes — React gets that
 * for free by re-rendering the provider's subtree.
 */
export const formControlKey: InjectionKey<ComputedRef<FormControl>> =
  Symbol('MznFormControl');
