import { Ref } from 'react';

export type ComposableRef<T> = Ref<T> | null | undefined;
export type ComposedRef<T> = Extract<Ref<T>, (...args: any[]) => any>;

/**
 * Compose all refs to single one.
 * It's helpful if you want to use useRef in an forwardRef component.
 *
 * @example
 *
 * const Some = forwardRef((props, ref) => {
 *   const refFromHook = useRef(null);
 *   const composedRef = composeRefs([ref, refFromHook]);
 *
 *   return (
 *     <div ref{composedRef}>
 *       ...
 *     </div>
 *   );
 * });
 */
export function composeRefs<T>(refs: ComposableRef<T>[]): ComposedRef<T> {
  return (element) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as { current: T | null }).current = element;
      }
    });
  };
}
