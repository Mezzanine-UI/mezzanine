import { NumberInput, _isNumberValue } from '@angular/cdk/coercion';
import { InputCoercion } from './input-coercion.decorator';

export type { NumberInput };

export function toNumber<T extends number = number>(value: NumberInput, fallbackValue?: T): T {
  return (_isNumberValue(value) ? Number(value) : (fallbackValue ?? NaN)) as T;
}

export function InputNumber<T extends number = number>(fallbackValue?: T) {
  return InputCoercion((value: NumberInput) => toNumber(value, fallbackValue), 'InputNumber');
}
