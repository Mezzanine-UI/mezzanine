import { DependencyList, RefObject } from 'react';
import { useDocumentTabKeyDown } from '../hooks/useDocumentTabKeyDown';

export function useTabKeyClose(
  onClose: VoidFunction,
  lastElementRefInFlow: RefObject<HTMLElement>,
  deps?: DependencyList,
) {
  useDocumentTabKeyDown(() => () => {
    const { activeElement } = document;

    if (activeElement === lastElementRefInFlow.current) {
      onClose();
    }
  }, deps);
}
