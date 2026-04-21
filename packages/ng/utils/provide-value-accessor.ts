import { forwardRef, Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * 建立 NG_VALUE_ACCESSOR provider，用於自訂表單控制項。
 *
 * @example
 * ```ts
 * @Component({
 *   providers: [provideValueAccessor(MznToggle)],
 * })
 * export class MznToggle implements ControlValueAccessor { ... }
 * ```
 */
export function provideValueAccessor(component: Type<unknown>): {
  provide: typeof NG_VALUE_ACCESSOR;
  useExisting: Type<unknown>;
  multi: true;
} {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true,
  };
}
