import { HostBinding } from '@angular/core';

export function HostBindingClass(className: string) {
  function HostBindingClassDecorator(target: any, propName: string) {
    if (!className) {
      return;
    }

    HostBinding(`class.${className}`)(target, propName);
  }

  return HostBindingClassDecorator;
}
