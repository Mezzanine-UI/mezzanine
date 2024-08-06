import { DependencyList } from 'react';
import { useDocumentEvents } from './useDocumentEvents';

export type DocumentEscapeKeyDownHandlerFactory = () =>
  | ((event: KeyboardEvent) => void)
  | undefined;

export function useDocumentEscapeKeyDown(
  factory: DocumentEscapeKeyDownHandlerFactory,
  deps?: DependencyList,
) {
  useDocumentEvents(() => {
    const handler = factory();

    if (!handler) {
      return;
    }

    return {
      keydown(event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          handler(event);
        }
      },
    };
  }, deps);
}
