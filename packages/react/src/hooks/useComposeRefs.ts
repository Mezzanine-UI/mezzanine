import { useCallback, useRef } from 'react';
import { ComposableRef, ComposedRef, composeRefs } from '../utils/composeRefs';

export function useComposeRefs<T>(refs: ComposableRef<T>[]): ComposedRef<T> {
  const refsRef = useRef<ComposableRef<T>[]>(refs);
  refsRef.current = refs;

  return useCallback<ComposedRef<T>>(
    (element) => composeRefs(refsRef.current)(element),
    [],
  );
}
