import { DependencyList } from 'react';
import { useDocumentEvents } from './useDocumentEvents';

export type DocumentTabKeyDownHandlerFactory = () =>
  | ((event: KeyboardEvent) => void)
  | undefined;

export function useDocumentTabKeyDown(
  factory: DocumentTabKeyDownHandlerFactory,
  deps?: DependencyList,
) {
  useDocumentEvents(() => {
    const handler = factory();

    if (!handler) {
      return;
    }

    return {
      keydown(event) {
        if (event.key === 'Tab') {
          handler(event);
        }
      },
    };
  }, deps);
}
