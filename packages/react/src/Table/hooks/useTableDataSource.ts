'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TableDataSource } from '@mezzanine-ui/core/table';
import { getRowKey } from '@mezzanine-ui/core/table';

export interface TableTransitionState {
  /** Keys of rows that are currently in "adding" state (highlighted) */
  addingKeys: Set<string>;
  /** Keys of rows that are currently in "deleting" state (red highlight before fade) */
  deletingKeys: Set<string>;
  /** Keys of rows that are currently fading out */
  fadingOutKeys: Set<string>;
}

export interface UseTableDataSourceOptions<T extends TableDataSource> {
  /** Initial data source */
  initialData?: T[];
  /** Duration of highlight animation in ms
   * @default 1000
   */
  highlightDuration?: number;
  /** Duration of fade out animation in ms
   * @default 200
   */
  fadeOutDuration?: number;
}

export interface UpdateDataSourceOptions {
  /**
   * Keys of newly added items that should be animated.
   * If provided, these items will show the adding animation.
   * If not provided, new items will appear without animation.
   */
  addedKeys?: string[];
  /**
   * Keys of items being removed that should be animated.
   * These items should NOT be in the new data array.
   * The hook will temporarily keep them for animation, then remove after animation completes.
   */
  removedKeys?: string[];
}

export interface UseTableDataSourceReturn<T extends TableDataSource> {
  /** Current data source to pass to Table component */
  dataSource: T[];
  /**
   * Update the data source with optional animation support.
   * This is the recommended method for GraphQL refetch pattern.
   *
   * @example
   * // After create mutation + refetch
   * const { data } = await refetch();
   * updateDataSource(data.items, { addedKeys: [newItem.id] });
   *
   * @example
   * // After delete mutation + refetch
   * const { data } = await refetch();
   * updateDataSource(data.items, { removedKeys: [deletedId] });
   */
  updateDataSource: (data: T[], options?: UpdateDataSourceOptions) => void;
  /** Transition state for Table component */
  transitionState: TableTransitionState;
}

export function useTableDataSource<T extends TableDataSource>(
  options: UseTableDataSourceOptions<T> = {},
): UseTableDataSourceReturn<T> {
  const {
    initialData = [],
    highlightDuration = 1000,
    fadeOutDuration = 200,
  } = options;

  // Internal data source that includes items being deleted (for animation)
  const [internalData, setInternalData] = useState<T[]>(initialData);

  // Track adding keys
  const [addingKeys, setAddingKeys] = useState<Set<string>>(new Set());

  // Track deleting keys (red highlight phase)
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());

  // Track fading out keys
  const [fadingOutKeys, setFadingOutKeys] = useState<Set<string>>(new Set());

  // Keep track of items pending removal (after fade out completes)
  const pendingRemovalRef = useRef<Set<string>>(new Set());

  // Store items being animated for removal (needed when refetch returns data without these items)
  const removingItemsRef = useRef<Map<string, T>>(new Map());

  // Timers ref for cleanup
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      const { current: timers } = timersRef;

      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const clearTimerForKey = useCallback((key: string) => {
    const existingTimer = timersRef.current.get(key);

    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(key);
    }
  }, []);

  // Helper to start adding animation for a key
  const startAddingAnimation = useCallback(
    (key: string) => {
      clearTimerForKey(key);
      setAddingKeys((prev) => new Set(prev).add(key));

      const timer = setTimeout(() => {
        setAddingKeys((prev) => {
          const next = new Set(prev);

          next.delete(key);

          return next;
        });
        timersRef.current.delete(key);
      }, highlightDuration);

      timersRef.current.set(key, timer);
    },
    [highlightDuration, clearTimerForKey],
  );

  // Helper to start removing animation for a key, returns cleanup function
  const startRemovingAnimation = useCallback(
    (keyStr: string, onComplete: () => void) => {
      clearTimerForKey(keyStr);
      clearTimerForKey(`${keyStr}-fade`);

      pendingRemovalRef.current.add(keyStr);
      setDeletingKeys((prev) => new Set(prev).add(keyStr));

      const highlightTimer = setTimeout(() => {
        setDeletingKeys((prev) => {
          const next = new Set(prev);

          next.delete(keyStr);

          return next;
        });

        setFadingOutKeys((prev) => new Set(prev).add(keyStr));

        const fadeTimer = setTimeout(() => {
          setFadingOutKeys((prev) => {
            const next = new Set(prev);

            next.delete(keyStr);

            return next;
          });

          pendingRemovalRef.current.delete(keyStr);
          removingItemsRef.current.delete(keyStr);
          timersRef.current.delete(`${keyStr}-fade`);

          onComplete();
        }, fadeOutDuration);

        timersRef.current.set(`${keyStr}-fade`, fadeTimer);
        timersRef.current.delete(keyStr);
      }, highlightDuration);

      timersRef.current.set(keyStr, highlightTimer);
    },
    [highlightDuration, fadeOutDuration, clearTimerForKey],
  );

  const updateDataSource = useCallback(
    (data: T[], updateOptions?: UpdateDataSourceOptions) => {
      const { addedKeys = [], removedKeys = [] } = updateOptions || {};

      // Convert to string keys for comparison
      const addedKeyStrs = new Set(addedKeys.map(String));
      const removedKeyStrs = new Set(removedKeys.map(String));

      // Get current data keys for comparison
      const currentKeys = new Set(internalData.map((item) => getRowKey(item)));
      const newKeys = new Set(data.map((item) => getRowKey(item)));

      // Items to animate as added (either explicitly specified or auto-detected)
      const keysToAnimateAdd = addedKeyStrs;

      // Items to animate as removed
      const keysToAnimateRemove = removedKeyStrs;

      // For removed items, we need to keep them temporarily for animation
      // Find items that are being removed and store them
      const itemsToKeepForAnimation: T[] = [];

      keysToAnimateRemove.forEach((keyStr) => {
        // Check if already animating
        if (pendingRemovalRef.current.has(keyStr)) {
          // Already animating, keep the stored item
          const storedItem = removingItemsRef.current.get(keyStr);

          if (storedItem) {
            itemsToKeepForAnimation.push(storedItem);
          }

          return;
        }

        // Find in current data
        const item = internalData.find((i) => getRowKey(i) === keyStr);

        if (item && !newKeys.has(keyStr)) {
          removingItemsRef.current.set(keyStr, item);
          itemsToKeepForAnimation.push(item);

          // Start remove animation
          startRemovingAnimation(keyStr, () => {
            // After animation, remove from internal data
            setInternalData((prev) =>
              prev.filter((i) => getRowKey(i) !== keyStr),
            );
          });
        }
      });

      // Clear adding animations for items no longer in data
      setAddingKeys((prev) => {
        const next = new Set(prev);

        prev.forEach((key) => {
          if (!newKeys.has(key) && !keysToAnimateRemove.has(key)) {
            next.delete(key);
            clearTimerForKey(key);
          }
        });

        return next;
      });

      // Build final data: new data + items being animated for removal
      const finalData = [...data];

      // Add items being removed (for animation) that aren't already in new data
      itemsToKeepForAnimation.forEach((item) => {
        const key = getRowKey(item);

        if (!newKeys.has(key)) {
          // Find original position or add at the end
          const originalIndex = internalData.findIndex(
            (i) => getRowKey(i) === key,
          );

          if (originalIndex !== -1) {
            // Try to maintain relative position
            finalData.splice(
              Math.min(originalIndex, finalData.length),
              0,
              item,
            );
          } else {
            finalData.push(item);
          }
        }
      });

      // Also keep any currently animating items that aren't in the removedKeys
      pendingRemovalRef.current.forEach((keyStr) => {
        if (
          !keysToAnimateRemove.has(keyStr) &&
          !finalData.some((i) => getRowKey(i) === keyStr)
        ) {
          const storedItem = removingItemsRef.current.get(keyStr);

          if (storedItem) {
            finalData.push(storedItem);
          }
        }
      });

      setInternalData(finalData);

      // Start adding animations for new items
      keysToAnimateAdd.forEach((keyStr) => {
        if (newKeys.has(keyStr) && !currentKeys.has(keyStr)) {
          startAddingAnimation(keyStr);
        } else if (newKeys.has(keyStr)) {
          // Item exists, still animate it
          startAddingAnimation(keyStr);
        }
      });
    },
    [
      internalData,
      clearTimerForKey,
      startAddingAnimation,
      startRemovingAnimation,
    ],
  );

  const transitionState = useMemo<TableTransitionState>(
    () => ({
      addingKeys,
      deletingKeys,
      fadingOutKeys,
    }),
    [addingKeys, deletingKeys, fadingOutKeys],
  );

  return {
    dataSource: internalData,
    transitionState,
    updateDataSource,
  };
}
