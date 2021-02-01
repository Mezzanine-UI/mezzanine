import { NumberInput, _isNumberValue } from '@angular/cdk/coercion';
import { InputDescriptor, InputDescriptorOptions } from './input-desciptor.decorator';

export type { NumberInput };

export function toNumber(value: NumberInput, fallbackValue?: number): number {
  return _isNumberValue(value) ? Number(value) : (fallbackValue ?? NaN);
}

export type InputNumberOptions<T> = Pick<InputDescriptorOptions<number, T>, 'fallback' | 'get'>;

export function InputNumber<T>(options?: InputNumberOptions<T>) {
  return InputDescriptor({
    ...options,
    coercion: toNumber,
  }, 'InputNumber');
}
