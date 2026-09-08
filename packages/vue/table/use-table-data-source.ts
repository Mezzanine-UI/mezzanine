import { computed, onBeforeUnmount, shallowRef } from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { getRowKey, type TableDataSource } from '@mezzanine-ui/core/table';
import type { TableTransitionState } from './table.types';

export interface UseTableDataSourceOptions<T extends TableDataSource> {
  /** Initial data source */
  initialData?: T[];
  /**
   * Duration of highlight animation in ms (stay phase)
   * @default 700 — matches `long` motion token
   */
  highlightDuration?: number;
  /**
   * Duration of fade out animation in ms (exit phase)
   * @default 150 — matches `fast` motion token
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
   * The composable will temporarily keep them for animation, then remove after
   * animation completes.
   */
  removedKeys?: string[];
}

export interface UseTableDataSourceReturn<T extends TableDataSource> {
  /** Current data source to pass to the Table component */
  dataSource: ShallowRef<T[]>;
  /** Transition state for the Table component */
  transitionState: ComputedRef<TableTransitionState>;
  /**
   * Update the data source with optional animation support.
   * This is the recommended method for the GraphQL refetch pattern.
   */
  updateDataSource: (data: T[], options?: UpdateDataSourceOptions) => void;
}

/**
 * 讓資料列的新增與刪除帶動畫的資料來源。
 *
 * 新增的 key 會亮起 `highlightDuration` 毫秒；刪除的 key 先亮紅
 * `highlightDuration`、再淡出 `fadeOutDuration`，這段期間該列仍然留在
 * `dataSource` 裡（即使 refetch 回來的資料已經沒有它），淡完才真的移除。
 * 適合「mutation 之後 refetch」的流程。
 *
 * @example
 * ```ts
 * const { dataSource, transitionState, updateDataSource } =
 *   useTableDataSource<DataType>({ initialData: rows });
 *
 * // 新增之後
 * updateDataSource(next, { addedKeys: [created.id] });
 *
 * // 刪除之後
 * updateDataSource(next, { removedKeys: [deleted.id] });
 * ```
 *
 * @see MznTable 接收 `dataSource` 與 `transitionState` 的元件
 */
export function useTableDataSource<T extends TableDataSource>(
  options: UseTableDataSourceOptions<T> = {},
): UseTableDataSourceReturn<T> {
  const {
    initialData = [],
    highlightDuration = 700,
    fadeOutDuration = 150,
  } = options;

  // Internal data source that includes items being deleted (for animation)
  const internalData = shallowRef<T[]>(initialData);

  // Track adding keys
  const addingKeys = shallowRef<Set<string>>(new Set());

  // Track deleting keys (red highlight phase)
  const deletingKeys = shallowRef<Set<string>>(new Set());

  // Track fading out keys
  const fadingOutKeys = shallowRef<Set<string>>(new Set());

  /**
   * React keeps these three in `useRef`, so writing one never re-renders.
   * Plain bindings are the Vue equivalent.
   */
  const pendingRemoval = new Set<string>();
  const removingItems = new Map<string, T>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  onBeforeUnmount(() => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  });

  const clearTimerForKey = (key: string): void => {
    const existingTimer = timers.get(key);

    if (existingTimer) {
      clearTimeout(existingTimer);
      timers.delete(key);
    }
  };

  const withoutKey = (source: Set<string>, key: string): Set<string> => {
    const next = new Set(source);

    next.delete(key);

    return next;
  };

  // Helper to start adding animation for a key
  const startAddingAnimation = (key: string): void => {
    clearTimerForKey(key);
    addingKeys.value = new Set(addingKeys.value).add(key);

    const timer = setTimeout(() => {
      addingKeys.value = withoutKey(addingKeys.value, key);
      timers.delete(key);
    }, highlightDuration);

    timers.set(key, timer);
  };

  // Helper to start removing animation for a key
  const startRemovingAnimation = (
    keyStr: string,
    onComplete: () => void,
  ): void => {
    clearTimerForKey(keyStr);
    clearTimerForKey(`${keyStr}-fade`);

    pendingRemoval.add(keyStr);
    deletingKeys.value = new Set(deletingKeys.value).add(keyStr);

    const highlightTimer = setTimeout(() => {
      deletingKeys.value = withoutKey(deletingKeys.value, keyStr);
      fadingOutKeys.value = new Set(fadingOutKeys.value).add(keyStr);

      const fadeTimer = setTimeout(() => {
        fadingOutKeys.value = withoutKey(fadingOutKeys.value, keyStr);

        pendingRemoval.delete(keyStr);
        removingItems.delete(keyStr);
        timers.delete(`${keyStr}-fade`);

        onComplete();
      }, fadeOutDuration);

      timers.set(`${keyStr}-fade`, fadeTimer);
      timers.delete(keyStr);
    }, highlightDuration);

    timers.set(keyStr, highlightTimer);
  };

  const updateDataSource = (
    data: T[],
    updateOptions?: UpdateDataSourceOptions,
  ): void => {
    const { addedKeys = [], removedKeys = [] } = updateOptions || {};

    // Convert to string keys for comparison
    const addedKeyStrs = new Set(addedKeys.map(String));
    const removedKeyStrs = new Set(removedKeys.map(String));

    // Get current data keys for comparison
    const currentData = internalData.value;
    const currentKeys = new Set(currentData.map((item) => getRowKey(item)));
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
      if (pendingRemoval.has(keyStr)) {
        // Already animating, keep the stored item
        const storedItem = removingItems.get(keyStr);

        if (storedItem) {
          itemsToKeepForAnimation.push(storedItem);
        }

        return;
      }

      // Find in current data
      const item = currentData.find((i) => getRowKey(i) === keyStr);

      if (item && !newKeys.has(keyStr)) {
        removingItems.set(keyStr, item);
        itemsToKeepForAnimation.push(item);

        // Start remove animation
        startRemovingAnimation(keyStr, () => {
          // After animation, remove from internal data
          internalData.value = internalData.value.filter(
            (i) => getRowKey(i) !== keyStr,
          );
        });
      }
    });

    // Clear adding animations for items no longer in data
    const nextAdding = new Set(addingKeys.value);

    addingKeys.value.forEach((key) => {
      if (!newKeys.has(key) && !keysToAnimateRemove.has(key)) {
        nextAdding.delete(key);
        clearTimerForKey(key);
      }
    });
    addingKeys.value = nextAdding;

    // Build final data: new data + items being animated for removal
    const finalData = [...data];

    // Add items being removed (for animation) that aren't already in new data
    itemsToKeepForAnimation.forEach((item) => {
      const key = getRowKey(item);

      if (!newKeys.has(key)) {
        // Find original position or add at the end
        const originalIndex = currentData.findIndex(
          (i) => getRowKey(i) === key,
        );

        if (originalIndex !== -1) {
          // Try to maintain relative position
          finalData.splice(Math.min(originalIndex, finalData.length), 0, item);
        } else {
          finalData.push(item);
        }
      }
    });

    // Also keep any currently animating items that aren't in the removedKeys
    pendingRemoval.forEach((keyStr) => {
      if (
        !keysToAnimateRemove.has(keyStr) &&
        !finalData.some((i) => getRowKey(i) === keyStr)
      ) {
        const storedItem = removingItems.get(keyStr);

        if (storedItem) {
          finalData.push(storedItem);
        }
      }
    });

    internalData.value = finalData;

    // Start adding animations for new items
    keysToAnimateAdd.forEach((keyStr) => {
      if (newKeys.has(keyStr) && !currentKeys.has(keyStr)) {
        startAddingAnimation(keyStr);
      } else if (newKeys.has(keyStr)) {
        // Item exists, still animate it
        startAddingAnimation(keyStr);
      }
    });
  };

  const transitionState = computed(
    (): TableTransitionState => ({
      addingKeys: addingKeys.value,
      deletingKeys: deletingKeys.value,
      fadingOutKeys: fadingOutKeys.value,
    }),
  );

  return {
    dataSource: internalData,
    transitionState,
    updateDataSource,
  };
}
