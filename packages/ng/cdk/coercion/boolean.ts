import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { InputCoercion } from './input-coercion.decorator';

export type { BooleanInput };

export function toBoolean(value: BooleanInput): boolean {
  return coerceBooleanProperty(value);
}

export function InputBoolean() {
  return InputCoercion(toBoolean, 'InputBoolean');
}
