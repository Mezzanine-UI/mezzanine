import { InjectionToken } from '@angular/core';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

/**
 * 表單控制狀態，由 MznFormField 提供給子元件。
 */
export interface FormControl {
  readonly disabled: boolean;
  readonly fullWidth: boolean;
  readonly required: boolean;
  readonly severity?: SeverityWithInfo;
}

/**
 * 表單控制狀態 InjectionToken。
 *
 * 在 MznFormField 中透過 providers 注入，
 * 子元件可 `inject(MZN_FORM_CONTROL, { optional: true })` 取得父層狀態。
 *
 * @example
 * ```typescript
 * const formControl = inject(MZN_FORM_CONTROL, { optional: true });
 * const isDisabled = formControl?.disabled ?? false;
 * ```
 */
export const MZN_FORM_CONTROL = new InjectionToken<FormControl>(
  'MZN_FORM_CONTROL',
);
