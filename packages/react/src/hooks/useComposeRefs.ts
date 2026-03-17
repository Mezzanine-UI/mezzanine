import { useCallback, useRef } from 'react';
import { ComposableRef, ComposedRef, composeRefs } from '../utils/composeRefs';

/**
 * 將多個 React ref 合併成單一 callback ref 的 Hook。
 *
 * 回傳一個穩定的 callback ref（依賴陣列永遠為空），
 * 每次渲染時仍能正確呼叫最新的 ref 集合，適用於需要同時傳遞 forwardRef 與內部 ref 的情境。
 *
 * @example
 * ```tsx
 * import { useComposeRefs } from '@mezzanine-ui/react';
 *
 * const internalRef = useRef<HTMLDivElement>(null);
 * const composedRef = useComposeRefs([internalRef, forwardedRef]);
 * return <div ref={composedRef} />;
 * ```
 */
export function useComposeRefs<T>(refs: ComposableRef<T>[]): ComposedRef<T> {
  const refsRef = useRef<ComposableRef<T>[]>(refs);
  refsRef.current = refs;

  return useCallback<ComposedRef<T>>(
    (element) => composeRefs(refsRef.current)(element),
    [],
  );
}
