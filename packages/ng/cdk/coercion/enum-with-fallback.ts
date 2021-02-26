import { InputCoercion } from './input-coercion.decorator';

export type EnumWithFallbackInput<T> = T | '' | null | undefined;

export function toEnumWithFallback<T>(value: EnumWithFallbackInput<T>, defaultValue: T): T {
  return value != null && value !== '' ? value : defaultValue;
}

export function InputEnumWithFallback<T>(fallbackValue: T) {
  return InputCoercion((value: EnumWithFallbackInput<T>) => toEnumWithFallback(value, fallbackValue), 'InputEnum');
}

