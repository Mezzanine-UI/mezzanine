import { HostBindingClass } from './host-binding-class';

export function HostBindingEnumClass<T>(getClass: (value: T) => string, values: T[]) {
  function HostBindingEnumClassDecorator(target: any, propName: string) {
    values.forEach((value) => {
      const className = getClass(value);

      if (!className) {
        return;
      }

      const privatePropName = `$$HostBindingEnumClass__${propName}_${value}`;

      if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
        throw new Error(`
          The prop '${privatePropName}' is already exist,
          it will be overrided by @HostBindingEnumClass on prop '${propName}'.
        `);
      }

      Object.defineProperty(target, privatePropName, {
        configurable: false,
        get() {
          return this[propName] === value;
        },
      });

      HostBindingClass(className)(target, privatePropName);
    });
  }

  return HostBindingEnumClassDecorator;
}
