import { ReactElement, Ref } from 'react';

/**
 * Helper type for a ReactElement whose props may carry a `ref`.
 * Since React 19, `ref` is a regular prop.
 */
export type ReactElementWithRef<
  P,
  E extends Element = HTMLElement,
> = ReactElement<P & { ref?: Ref<E> }>;

/**
 * Extracts the ref from a ReactElement.
 *
 * Since React 19, `ref` lives in `element.props.ref`. Reading the legacy
 * `element.ref` logs "Accessing element.ref was removed in React 19.", so
 * it is never accessed here.
 */
export function getElementRef<E extends Element = HTMLElement>(
  element: ReactElementWithRef<unknown, E>,
): Ref<E> | undefined {
  return element.props?.ref;
}
