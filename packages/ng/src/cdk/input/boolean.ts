import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { InputDescriptor, InputDescriptorOptions } from './input-desciptor.decorator';

export type { BooleanInput };

export function toBoolean(value: BooleanInput): boolean {
  return coerceBooleanProperty(value);
}

export type InputBooleanOptions<T> = Pick<InputDescriptorOptions<boolean, T>, 'get'>;

export function InputBoolean<T>(options?: InputBooleanOptions<T>) {
  return InputDescriptor({
    ...options,
    coercion: toBoolean,
  }, 'InputBoolean');
}
