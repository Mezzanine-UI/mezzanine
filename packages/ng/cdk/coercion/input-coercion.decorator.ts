export type InputCoercionFn<RawValue, Value> = (rawValue: RawValue) => Value;

export type InputCoercionDecorator = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object,
  key: string,
  originalDescriptor?: TypedPropertyDescriptor<any>
) => any;

export function InputCoercion<RawValue, Value>(
  corercion: InputCoercionFn<RawValue, Value>,
  name = 'InputCoercion',
): InputCoercionDecorator {
  return function InputCoercionDecorator(target, key, originalDescriptor) {
    const valueKey = `@${name}__${key}`;
    const { get: originalGet, set: originalSet } = originalDescriptor || {};

    if (!originalGet) {
      if (Object.prototype.hasOwnProperty.call(target, valueKey)) {
        throw new Error(`
          The this.${valueKey} is already exist,
          it will be overrided by @${name}() on this.${key}.
        `);
      }

      Object.defineProperty(target, valueKey, {
        configurable: true,
        writable: true,
      });
    }

    return {
      get: originalGet || function get(this: any) {
        return this[valueKey];
      },
      set(rawValue: RawValue): void {
        const value = corercion(rawValue);

        if (originalSet) {
          originalSet.call(this, value);
        }

        this[valueKey] = value;
      },
    };
  };
}
