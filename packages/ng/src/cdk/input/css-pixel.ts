import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { InputDescriptor, InputDescriptorOptions } from './input-desciptor.decorator';
import type { NumberInput } from './number';

export function toCssPixel(value: NumberInput): string {
  return coerceCssPixelValue(value);
}

export type InputCssPixelOptions<T> = Pick<InputDescriptorOptions<string, T>, 'fallback' | 'get'>;

export function InputCssPixel<T>(options?: InputCssPixelOptions<T>) {
  return InputDescriptor({
    ...options,
    coercion: toCssPixel,
  }, 'InputCssPixel');
}
