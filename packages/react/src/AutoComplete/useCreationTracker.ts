import { useCallback, useRef } from 'react';

import { SelectValue } from '../Select/typings';

type CreationTracker = {
  newlyCreatedIds: Set<string>;
  unselectedCreatedIds: Set<string>;
  allCreatedIds: Set<string>;
};

export function useCreationTracker() {
  const creationTrackerRef = useRef<CreationTracker>({
    newlyCreatedIds: new Set<string>(),
    unselectedCreatedIds: new Set<string>(),
    allCreatedIds: new Set<string>(),
  });

  const filterUnselected = useCallback(
    (options: SelectValue[]) =>
      options.filter(
        (opt) => !creationTrackerRef.current.unselectedCreatedIds.has(opt.id),
      ),
    [creationTrackerRef],
  );

  const clearUnselected = useCallback(() => {
    creationTrackerRef.current.unselectedCreatedIds.clear();
  }, []);

  const clearNewlyCreated = useCallback((ids?: string[]) => {
    if (!ids) {
      creationTrackerRef.current.newlyCreatedIds.clear();
      return;
    }

    ids.forEach((id) => {
      creationTrackerRef.current.newlyCreatedIds.delete(id);
    });
  }, []);

  const markCreated = useCallback((id: string) => {
    creationTrackerRef.current.newlyCreatedIds.add(id);
    creationTrackerRef.current.allCreatedIds.add(id);
  }, []);

  const markUnselected = useCallback((ids: string[]) => {
    ids.forEach((id) => {
      if (creationTrackerRef.current.allCreatedIds.has(id)) {
        creationTrackerRef.current.unselectedCreatedIds.add(id);
      }
    });
  }, []);

  const isNewlyCreated = useCallback(
    (id: string) => creationTrackerRef.current.newlyCreatedIds.has(id),
    [],
  );

  const isCreated = useCallback(
    (id: string) => creationTrackerRef.current.allCreatedIds.has(id),
    [],
  );

  return {
    creationTrackerRef,
    filterUnselected,
    clearUnselected,
    markCreated,
    clearNewlyCreated,
    markUnselected,
    isNewlyCreated,
    isCreated,
  };
}

