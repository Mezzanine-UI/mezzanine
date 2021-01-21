import { HostBinding } from '@angular/core';

export function HostBindingEnumClass<T>(getClass: (value: T) => string, values: T[]) {
  function HostBindingEnumClassDecorator(target: any, propName: string) {
    values.forEach((value) => {
      const className = getClass(value);

      if (!className) {
        return;
      }

      const privatePropName = `$$HostBindingEnumClass__${propName}_${value}`;

      if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
        // eslint-disable-next-line no-console
        console.warn(`The prop '${privatePropName}' is already exist, it will be overrided by ${propName} decorator.`);
      }

      Object.defineProperty(target, privatePropName, {
        configurable: false,
        get() {
          return this[propName] === value;
        },
      });

      HostBinding(`class.${className}`)(target, privatePropName);
    });
  }

  return HostBindingEnumClassDecorator;
}
