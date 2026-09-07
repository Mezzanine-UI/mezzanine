import type { SelectValue } from '../select/select.types';

export interface CreationTracker {
  /** Forgets that the given ids — or all of them — were just created. */
  clearNewlyCreated: (ids?: string[]) => void;
  /** Forgets every id currently marked as created-but-unselected. */
  clearUnselected: () => void;
  /** Drops the created-but-unselected options from a list. */
  filterUnselected: (options: SelectValue[]) => SelectValue[];
  /** Whether the id was ever created through `onInsert`. */
  isCreated: (id: string) => boolean;
  /** Whether the id was created and not yet selected. */
  isNewlyCreated: (id: string) => boolean;
  /** Records an id as created through `onInsert`. */
  markCreated: (id: string) => void;
  /** Records created ids that ended up unselected. */
  markUnselected: (ids: string[]) => void;
}

/**
 * 追蹤 addable 模式下建立出來的選項的 composable。
 *
 * 記住哪些 id 是新建的、哪些建立後又被取消選取，讓下拉關閉時可以把沒被選走的
 * 建立項目清掉。純粹是幾個 Set，不需要響應式 —— React 用 ref 也是同樣的理由。
 *
 * @example
 * ```ts
 * const { isCreated, markCreated } = useCreationTracker();
 * ```
 *
 * @see MznAutoComplete 使用這個 composable 的元件
 */
export function useCreationTracker(): CreationTracker {
  const newlyCreatedIds = new Set<string>();
  const unselectedCreatedIds = new Set<string>();
  const allCreatedIds = new Set<string>();

  return {
    clearNewlyCreated: (ids?: string[]) => {
      if (!ids) {
        newlyCreatedIds.clear();

        return;
      }

      ids.forEach((id) => newlyCreatedIds.delete(id));
    },
    clearUnselected: () => unselectedCreatedIds.clear(),
    filterUnselected: (options: SelectValue[]) =>
      options.filter((option) => !unselectedCreatedIds.has(option.id)),
    isCreated: (id: string) => allCreatedIds.has(id),
    isNewlyCreated: (id: string) => newlyCreatedIds.has(id),
    markCreated: (id: string) => {
      newlyCreatedIds.add(id);
      allCreatedIds.add(id);
    },
    markUnselected: (ids: string[]) => {
      ids.forEach((id) => {
        if (allCreatedIds.has(id)) unselectedCreatedIds.add(id);
      });
    },
  };
}
