export interface InputDescriptorOptions<V, T> {
  coercion?: (value: any, fallback?: V) => V,
  fallback?: V | ((this: T) => V);
  get?: (this: T, value: V) => V;
}

export function InputDescriptor<V, T = any>(
  options: InputDescriptorOptions<V, T> = {},
  name = 'InputDescriptor',
) {
  const {
    coercion,
    fallback,
    get,
  } = options;

  return function InputDescriptorDecorator(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    key: string,
    originalDescriptor?: TypedPropertyDescriptor<V>,
  ): any {
    const valueKey = `@InputDescriptor__${key}`;

    if (Object.prototype.hasOwnProperty.call(target, valueKey)) {
      throw new Error(`
        The this.${valueKey} is already exist,
        it will be overrided by @${name}() on this.${valueKey}.
      `);
    }

    Object.defineProperty(target, key, {
      configurable: false,
      enumerable: false,
      writable: true,
    });

    const { get: originalGet, set: originalSet } = originalDescriptor || {};

    if (originalGet) {
      throw new Error(`
        The @${name}() on this.${key} can not be used with getter.
      `);
    }

    return {
      get(this: T) {
        let value = this[valueKey as keyof T] as any as V;

        if (get) {
          value = get.call(this, value);
        }

        return value;
      },
      set(this: T, rawValue: any) {
        let value: V = rawValue;

        if (coercion) {
          const fallbackValue = typeof fallback !== 'function'
            ? fallback
            : (fallback as (this: T) => V).call(this);

          value = coercion(value, fallbackValue);
        }

        if (originalSet) {
          originalSet.call(this, value);
        }

        this[valueKey as keyof T] = value as any;
      },
    } as TypedPropertyDescriptor<V>;
  };
}
