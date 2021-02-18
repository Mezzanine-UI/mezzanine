import { DependencyList } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type DocumentEventHandlersFactory = () =>
| {
  [event in keyof DocumentEventMap]?: (event: DocumentEventMap[event]) => void;
}
| undefined;

export function useDocumentEvents(factory: DocumentEventHandlersFactory, deps?: DependencyList) {
  useIsomorphicLayoutEffect(() => {
    const handlers = factory();

    if (!handlers) {
      return;
    }

    const entries = Object.entries(handlers);

    entries.forEach(([event, handler]) => {
      document.addEventListener(event, handler as any);
    });

    return () => {
      entries.forEach(([event, handler]) => {
        document.removeEventListener(event, handler as any);
      });
    };
  }, deps);
}
