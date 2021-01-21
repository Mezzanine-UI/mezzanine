import {
  coerceBooleanProperty,
  coerceCssPixelValue,
  _isNumberValue,
} from '@angular/cdk/coercion';
import type {
  BooleanInput,
  NonNullEnumInput,
  NumberInput,
} from './input-types';

export function toBoolean(value: BooleanInput): boolean {
  return coerceBooleanProperty(value);
}

export function toNumber(value: NumberInput): number;
export function toNumber<T>(value: NumberInput, fallback: T): number | T;
export function toNumber(value: NumberInput, fallbackValue = 0): number {
  return _isNumberValue(value) ? Number(value) : fallbackValue;
}

export function toCssPixel(value: NumberInput): string {
  return coerceCssPixelValue(value);
}

export function toNotEmptyEnum<T>(value: NonNullEnumInput<T>, fallback: T): T {
  return value || fallback;
}

function createInputDecorator<T, D>(
  name: string,
  corercion: (v: T) => D,
): (target: any, propName: string, originalDescriptor?: TypedPropertyDescriptor<any>) => void {
  function InputDecorator(target: any, propName: string, originalDescriptor?: TypedPropertyDescriptor<any>): any {
    const privatePropName = `$$${name}__${propName}`;

    if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
      // eslint-disable-next-line no-console
      console.warn(`The prop '${privatePropName}' is already exist, it will be overrided by ${name} decorator.`);
    }

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true,
    });

    return {
      get(): string {
        if (originalDescriptor && originalDescriptor.get) {
          return originalDescriptor.get.call(this);
        }

        return this[privatePropName];
      },
      set(rawValue: T): void {
        const value = corercion(rawValue);

        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.call(this, value);
        }

        this[privatePropName] = value;
      },
    };
  }

  return InputDecorator;
}

/**
 * Input decorator that handle a prop to do get/set automatically with toBoolean
 *
 * Why not using @InputBoolean alone without @Input? AOT needs @Input to be visible
 *
 * @example
 * ```
 * @Input()
 * @InputBoolean()
 * visible: boolean = false;
 *
 * // Act as below:
 * // @Input()
 * // get visible() { return this.__visible; }
 * // set visible(value) { this.__visible = value; }
 * // __visible = false;
 * ```
 */
export function InputBoolean() {
  return createInputDecorator('InputBoolean', toBoolean);
}

export function InputNumber(fallback?: number) {
  return createInputDecorator('InputNumber', (value: string | number) => toNumber(value, fallback));
}

export function InputCssPixel() {
  return createInputDecorator('InputCssPixel', toCssPixel);
}

export function InputNotEmptyEnum<T>(fallback: T) {
  return createInputDecorator('InputNotEmptyEnum', (value: NonNullEnumInput<T>) => toNotEmptyEnum(value, fallback));
}
