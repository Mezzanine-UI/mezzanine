import { RefObject } from 'react';

export type ElementGetter =
  | HTMLElement
  | (() => HTMLElement)
  | RefObject<HTMLElement>
  | null;

export function getElement(elementGetter?: ElementGetter): HTMLElement | null {
  if (!elementGetter) {
    return null;
  }

  if (typeof elementGetter === 'function') {
    return elementGetter();
  }

  if (elementGetter instanceof HTMLElement) {
    return elementGetter;
  }

  if ('current' in elementGetter) {
    return elementGetter.current;
  }

  return null;
}
