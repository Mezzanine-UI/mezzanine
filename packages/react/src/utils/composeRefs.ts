import { Ref } from 'react';

export type ComposableRef<T> = Ref<T> | null | undefined;
export type ComposedRef<T> = Extract<Ref<T>, (...args: any[]) => any>;

/**
 * Compose all refs to single one.
 * It's helpful if you want to use useRef alongside a `ref` prop.
 *
 * @example
 *
 * function Some({ ref, ...props }: SomeProps & RefAttributes<HTMLDivElement>) {
 *   const refFromHook = useRef(null);
 *   const composedRef = composeRefs([ref, refFromHook]);
 *
 *   return (
 *     <div ref={composedRef}>
 *       ...
 *     </div>
 *   );
 * }
 */
export function composeRefs<T>(refs: ComposableRef<T>[]): ComposedRef<T> {
  return (element) => {
    const cleanups: Array<() => void> = [];

    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(element);
        if (typeof cleanup === 'function') {
          cleanups.push(cleanup);
        }
      } else if (ref) {
        (ref as { current: T | null }).current = element;
      }
    });

    if (cleanups.length > 0) {
      return () => cleanups.forEach((c) => c());
    }
  };
}
