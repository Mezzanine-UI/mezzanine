import type { DropdownOption } from '@mezzanine-ui/core/dropdown';

/**
 * 追蹤 Autocomplete `addable` 模式下使用者建立的項目。
 *
 * 內部維護三個 id 集合,對齊 MznAutocomplete 元件原先內聯的
 * `creationTracker` 物件與 React `useCreationTracker` hook 語義:
 * - `newly`:剛建立、尚未被選取(於選項列顯示「New」徽章)。
 * - `unselected`:建立後至 dropdown 關閉期間從未被選取
 *   (用於 `onRemoveCreated` 清理)。
 * - `all`:整個生命週期中曾建立過的 id 集合(判斷「這個 id 是使用者
 *   建立的」)。
 *
 * API 刻意與原本的直覺 Set 操作一對一,避免破壞既有呼叫點語義;消費
 * 端不需反應式追蹤,因為實際渲染變動由 `MznAutocomplete` 自己持有的
 * signal(`internalValue` / `searchText`)驅動 change detection。
 */
export class AutocompleteCreationTracker {
  private readonly newly = new Set<string>();
  private readonly unselected = new Set<string>();
  private readonly all = new Set<string>();

  /** 已建立的項目總數(含已取消選取的)。 */
  get allSize(): number {
    return this.all.size;
  }

  /** 未選取集合目前的大小。 */
  get unselectedSize(): number {
    return this.unselected.size;
  }

  /** 是否已建立過指定 id 的項目。 */
  hasCreated(id: string): boolean {
    return this.all.has(id);
  }

  /** 是否屬於「未曾選取」集合。 */
  isUnselected(id: string): boolean {
    return this.unselected.has(id);
  }

  /**
   * 建立新項目:同步加入 `newly` 與 `all`。對應原先兩行的
   * `newlyCreatedIds.add(id) + allCreatedIds.add(id)` 組合。
   */
  addNewly(id: string): void {
    this.newly.add(id);
    this.all.add(id);
  }

  /**
   * 從 `newly` 移除(選取後不再顯示 New 徽章);`all` 保留,因為後續
   * 仍需判斷「此 id 是使用者建立的」。
   */
  removeNewly(id: string): void {
    this.newly.delete(id);
  }

  /** 若該 id 是使用者建立的,加入 unselected 集合。 */
  markUnselected(id: string): void {
    if (this.all.has(id)) {
      this.unselected.add(id);
    }
  }

  /**
   * 從 options 中剔除所有 unselected 項目。若沒有未選取項目,原樣返回
   * 避免無謂 array allocation。本方法不清空集合 — 清空交給 `clearUnselected`
   * 以保留呼叫端對時機的控制。
   */
  filterOutUnselected(
    options: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> {
    if (this.unselected.size === 0) return options;

    return options.filter((o) => !this.unselected.has(o.id));
  }

  /** 清空 `unselected` 集合。 */
  clearUnselected(): void {
    this.unselected.clear();
  }
}
