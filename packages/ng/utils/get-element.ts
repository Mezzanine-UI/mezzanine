import { ElementRef } from '@angular/core';

export type ElementGetter =
  | HTMLElement
  | (() => HTMLElement)
  | ElementRef<HTMLElement>
  | null;

export function getElement(elementGetter?: ElementGetter): HTMLElement | null {
  if (elementGetter && typeof window !== 'undefined') {
    if (elementGetter instanceof HTMLElement) {
      return elementGetter;
    }

    if (typeof elementGetter === 'function') {
      return elementGetter();
    }

    return elementGetter.nativeElement;
  }

  return null;
}
