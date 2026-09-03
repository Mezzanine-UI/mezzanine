import { isRef } from 'vue';
import type { Ref } from 'vue';

/**
 * The ways an element can be handed to a component: the element itself, a
 * function returning it, a template ref, or nothing.
 */
export type ElementGetter =
  | HTMLElement
  | (() => HTMLElement | null)
  | Ref<HTMLElement | null>
  | null;

export function getElement(elementGetter?: ElementGetter): HTMLElement | null {
  if (elementGetter && typeof window !== 'undefined') {
    if (elementGetter instanceof HTMLElement) {
      return elementGetter;
    }

    if (typeof elementGetter === 'function') {
      return elementGetter();
    }

    if (isRef(elementGetter)) {
      return elementGetter.value;
    }
  }

  return null;
}
