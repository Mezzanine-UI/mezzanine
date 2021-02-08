import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { InputCoercion } from './input-coercion.decorator';
import type { NumberInput } from './number';

export function toCssPixel(value: NumberInput): string {
  return coerceCssPixelValue(value);
}

export function InputCssPixel() {
  return InputCoercion(toCssPixel, 'InputCssPixel');
}
