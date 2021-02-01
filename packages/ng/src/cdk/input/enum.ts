import { InputDescriptor, InputDescriptorOptions } from './input-desciptor.decorator';

export type EnumInput<T> = T | '' | null | undefined;

export function toEnum<T>(value: EnumInput<T>, defaultValue: T): T {
  return value != null && value !== '' ? value : defaultValue;
}

export type InputEnumOptions<V, T = any> =
  Required<Pick<InputDescriptorOptions<V, T>, 'fallback'>> & Pick<InputDescriptorOptions<V, T>, 'get'>;

export function InputEnum<V, T = any>(options: InputEnumOptions<V, T>) {
  return InputDescriptor({
    ...options,
    coercion: toEnum,
  }, 'InputEnum');
}
