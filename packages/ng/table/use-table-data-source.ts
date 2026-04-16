import { DestroyRef, Signal, computed, inject, signal } from '@angular/core';
import type { TableDataSource, TableTransitionState } from './table-types';
import { getRowKey } from './table-types';

/** 設定 useTableDataSource 的選項，對齊 React `UseTableDataSourceOptions`。 */
export interface UseTableDataSourceOptions<T extends TableDataSource> {
  /** 初始 dataSource。 */
  readonly initialData?: readonly T[];
  /**
   * 新增列的高亮動畫持續時間（毫秒）。
   * @default 700  // 對應 `long` motion token
   */
  readonly highlightDuration?: number;
  /**
   * 刪除列的淡出動畫持續時間（毫秒）。
   * @default 150  // 對應 `fast` motion token
   */
  readonly fadeOutDuration?: number;
}

/** `updateDataSource` 的呼叫選項。 */
export interface UpdateDataSourceOptions {
  /** 希望套上「新增」動畫的列 key。 */
  readonly addedKeys?: readonly string[];
  /**
   * 希望套上「刪除」動畫的列 key。
   * 這些 key 不會出現在新的 data array 中；
   * hook 會暫時保留，等動畫完成後再移除。
   */
  readonly removedKeys?: readonly string[];
}

/** useTableDataSource 的回傳值。 */
export interface UseTableDataSourceReturn<T extends TableDataSource> {
  /** 目前的 dataSource signal，綁到 `<div mznTable [dataSource]>`。 */
  readonly dataSource: Signal<readonly T[]>;
  /** 過渡狀態 signal，綁到 `<div mznTable [transitionState]>`。 */
  readonly transitionState: Signal<TableTransitionState>;
  /** 更新 dataSource，可選擇指定 addedKeys / removedKeys 觸發動畫。 */
  readonly updateDataSource: (
    data: readonly T[],
    options?: UpdateDataSourceOptions,
  ) => void;
}

/**
 * Angular 版 `useTableDataSource`，對齊 React hook。
 *
 * 必須在 Angular injection context（component field initializer 或
 * constructor）中呼叫以取得 `DestroyRef` 自動清理 timer。
 *
 * @example
 * ```ts
 * class MyComponent {
 *   private readonly ds = useTableDataSource<Row>({
 *     initialData: initialRows,
 *     highlightDuration: 1000,
 *     fadeOutDuration: 200,
 *   });
 *
 *   readonly dataSource = this.ds.dataSource;
 *   readonly transitionState = this.ds.transitionState;
 *
 *   onCreate(row: Row): void {
 *     this.ds.updateDataSource([row, ...this.dataSource()], {
 *       addedKeys: [row.key],
 *     });
 *   }
 *
 *   onDelete(key: string): void {
 *     this.ds.updateDataSource(
 *       this.dataSource().filter((r) => r.key !== key),
 *       { removedKeys: [key] },
 *     );
 *   }
 * }
 * ```
 */
export function useTableDataSource<T extends TableDataSource>(
  options: UseTableDataSourceOptions<T> = {},
): UseTableDataSourceReturn<T> {
  const {
    initialData = [],
    highlightDuration = 700,
    fadeOutDuration = 150,
  } = options;

  const internalData = signal<readonly T[]>([...initialData]);
  const addingKeys = signal<ReadonlySet<string>>(new Set());
  const deletingKeys = signal<ReadonlySet<string>>(new Set());
  const fadingOutKeys = signal<ReadonlySet<string>>(new Set());

  const pendingRemoval = new Set<string>();
  const removingItems = new Map<string, T>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  inject(DestroyRef).onDestroy(() => {
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
  });

  const clearTimerForKey = (key: string): void => {
    const t = timers.get(key);

    if (t !== undefined) {
      clearTimeout(t);
      timers.delete(key);
    }
  };

  const addKey = (
    s: { update: (fn: (prev: ReadonlySet<string>) => Set<string>) => void },
    key: string,
  ): void => {
    s.update((prev) => new Set(prev).add(key));
  };

  const removeKey = (
    s: { update: (fn: (prev: ReadonlySet<string>) => Set<string>) => void },
    key: string,
  ): void => {
    s.update((prev) => {
      const next = new Set(prev);

      next.delete(key);

      return next;
    });
  };

  const startAddingAnimation = (key: string): void => {
    clearTimerForKey(key);
    addKey(addingKeys, key);

    const t = setTimeout(() => {
      removeKey(addingKeys, key);
      timers.delete(key);
    }, highlightDuration);

    timers.set(key, t);
  };

  const startRemovingAnimation = (
    key: string,
    onComplete: () => void,
  ): void => {
    clearTimerForKey(key);
    clearTimerForKey(`${key}-fade`);
    pendingRemoval.add(key);
    addKey(deletingKeys, key);

    const highlightTimer = setTimeout(() => {
      removeKey(deletingKeys, key);
      addKey(fadingOutKeys, key);

      const fadeTimer = setTimeout(() => {
        removeKey(fadingOutKeys, key);
        pendingRemoval.delete(key);
        removingItems.delete(key);
        timers.delete(`${key}-fade`);
        onComplete();
      }, fadeOutDuration);

      timers.set(`${key}-fade`, fadeTimer);
      timers.delete(key);
    }, highlightDuration);

    timers.set(key, highlightTimer);
  };

  const updateDataSource = (
    data: readonly T[],
    updateOptions?: UpdateDataSourceOptions,
  ): void => {
    const addedKeyStrs = new Set(
      (updateOptions?.addedKeys ?? []).map((k) => String(k)),
    );
    const removedKeyStrs = new Set(
      (updateOptions?.removedKeys ?? []).map((k) => String(k)),
    );
    const currentKeys = new Set(internalData().map(getRowKey));
    const newKeys = new Set(data.map(getRowKey));

    // For removed items, temporarily keep them in finalData for animation.
    const itemsToKeep: T[] = [];

    removedKeyStrs.forEach((keyStr) => {
      if (pendingRemoval.has(keyStr)) {
        const stored = removingItems.get(keyStr);

        if (stored) itemsToKeep.push(stored);

        return;
      }

      const item = internalData().find((i) => getRowKey(i) === keyStr);

      if (item && !newKeys.has(keyStr)) {
        removingItems.set(keyStr, item);
        itemsToKeep.push(item);

        startRemovingAnimation(keyStr, () => {
          internalData.update((prev) =>
            prev.filter((i) => getRowKey(i) !== keyStr),
          );
        });
      }
    });

    // Cancel stale adding animations.
    addingKeys.update((prev) => {
      const next = new Set(prev);

      prev.forEach((k) => {
        if (!newKeys.has(k) && !removedKeyStrs.has(k)) {
          next.delete(k);
          clearTimerForKey(k);
        }
      });

      return next;
    });

    const finalData: T[] = [...data];

    itemsToKeep.forEach((item) => {
      const k = getRowKey(item);

      if (!newKeys.has(k)) {
        const originalIdx = internalData().findIndex((i) => getRowKey(i) === k);

        if (originalIdx !== -1) {
          finalData.splice(Math.min(originalIdx, finalData.length), 0, item);
        } else {
          finalData.push(item);
        }
      }
    });

    pendingRemoval.forEach((keyStr) => {
      if (
        !removedKeyStrs.has(keyStr) &&
        !finalData.some((i) => getRowKey(i) === keyStr)
      ) {
        const stored = removingItems.get(keyStr);

        if (stored) finalData.push(stored);
      }
    });

    internalData.set(finalData);

    addedKeyStrs.forEach((keyStr) => {
      if (newKeys.has(keyStr)) {
        // React 行為：即使 key 已在舊資料中仍重播動畫。
        void currentKeys;
        startAddingAnimation(keyStr);
      }
    });
  };

  const transitionState = computed(
    (): TableTransitionState => ({
      addingKeys: addingKeys(),
      deletingKeys: deletingKeys(),
      fadingOutKeys: fadingOutKeys(),
    }),
  );

  return {
    dataSource: internalData,
    transitionState,
    updateDataSource,
  };
}
