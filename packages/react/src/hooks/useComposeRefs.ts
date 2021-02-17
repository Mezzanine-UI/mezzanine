import { useMemo } from 'react';
import { ComposableRef, ComposedRef, composeRefs } from '../utils/composeRefs';

export function useComposeRefs<T>(refs: ComposableRef<T>[]): ComposedRef<T> {
  return useMemo(() => composeRefs(refs), refs);
}
