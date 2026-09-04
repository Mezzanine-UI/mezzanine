import type { ComponentPublicInstance } from 'vue';

/**
 * The DOM element behind a template ref.
 *
 * A ref on a component hands back its public instance, not its element —
 * React's refs reach the node either way — so anything that measures or
 * animates what a consumer passed in has to unwrap it first.
 */
export function resolveElement(
  value: Element | ComponentPublicInstance | null | undefined,
): HTMLElement | null {
  if (!value) return null;

  const element = value instanceof Element ? value : value.$el;

  return element instanceof HTMLElement ? element : null;
}
