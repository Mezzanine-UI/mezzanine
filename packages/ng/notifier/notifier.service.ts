import { Injectable, signal } from '@angular/core';

/** Notifier 設定。 */
export interface NotifierConfig {
  /** 自動關閉時間（毫秒）。設為 `false` 時不自動關閉。 */
  readonly duration?: number | false;
  /** 最多同時顯示數量。超出的進入排隊。 */
  readonly maxCount?: number;
}

/** 單筆通知資料。 */
export interface NotifierData {
  /** 唯一識別 key。 */
  readonly key: string;
  /** 顯示內容（文字或自訂 template 資料）。 */
  readonly message?: string;
  /** 關閉回呼。 */
  readonly onClose?: (key: string) => void;
  /** 覆蓋此筆的 duration。 */
  readonly duration?: number | false;
  /** 附加屬性（各元件自行定義）。 */
  readonly [prop: string]: unknown;
}

/**
 * 排序函式型別。在每次更新前對通知列表排序。
 * 對應 React 版 `createNotifier` 的 `sortBeforeUpdate` 參數。
 */
export type SortBeforeUpdate<N extends NotifierData = NotifierData> = (
  notifiers: ReadonlyArray<N>,
) => ReadonlyArray<N>;

let nextKey = 0;

function generateKey(): string {
  return `mzn-notifier-${++nextKey}`;
}

/**
 * 通用通知管理 service，管理全域通知列表的新增、移除與排隊邏輯。
 *
 * 對應 React 版的 `createNotifier` 工廠函式。
 * 由 `MznMessageService` 與 `MznAlertBannerService` 等高層 service 組合使用。
 *
 * 可透過 `setSortBeforeUpdate` 設定排序邏輯，每次更新前都會依此排序顯示清單。
 *
 * @example
 * ```ts
 * const notifier = inject(MznNotifierService);
 * notifier.config({ maxCount: 4, duration: 3000 });
 * const key = notifier.add({ message: 'Hello' });
 * notifier.remove(key);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MznNotifierService {
  private currentConfig: NotifierConfig = {
    duration: 3000,
    maxCount: 4,
  };

  private sortFn: SortBeforeUpdate | null = null;

  /** 目前顯示中的通知列表（signal）。 */
  readonly displayed = signal<ReadonlyArray<NotifierData>>([]);

  /** 排隊中的通知列表（signal）。 */
  readonly queued = signal<ReadonlyArray<NotifierData>>([]);

  /** 更新設定。 */
  config(config: Partial<NotifierConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...config };
  }

  /** 取得目前設定。 */
  getConfig(): Readonly<NotifierConfig> {
    return this.currentConfig;
  }

  /**
   * 設定排序函式。每次 `displayed` 更新前都會呼叫此函式對列表排序。
   * 對應 React 版 `createNotifier` 的 `sortBeforeUpdate` 參數。
   *
   * @example
   * ```ts
   * notifier.setSortBeforeUpdate((items) =>
   *   [...items].sort((a, b) => (a.severity === 'error' ? -1 : 1))
   * );
   * ```
   */
  setSortBeforeUpdate(fn: SortBeforeUpdate | null): void {
    this.sortFn = fn;
  }

  private sort(
    items: ReadonlyArray<NotifierData>,
  ): ReadonlyArray<NotifierData> {
    return this.sortFn ? this.sortFn(items) : items;
  }

  /** 新增通知。回傳唯一 key。 */
  add(data: Omit<NotifierData, 'key'> & { key?: string }): string {
    const key = data.key ?? generateKey();
    const entry: NotifierData = { ...data, key };

    const current = this.displayed();
    const maxCount = this.currentConfig.maxCount ?? Infinity;

    // If key already exists, update in place
    const existingIndex = current.findIndex((n) => n.key === key);

    if (existingIndex >= 0) {
      const updated = [
        ...current.slice(0, existingIndex),
        entry,
        ...current.slice(existingIndex + 1),
      ];

      this.displayed.set(this.sort(updated));

      return key;
    }

    if (current.length >= maxCount) {
      if (this.sortFn) {
        // When a sort function is set, merge all items and sort,
        // keeping the top maxCount displayed and queuing the rest.
        const all = this.sort([...current, entry]);
        const toDisplay = all.slice(0, maxCount);
        const toQueue = all.slice(maxCount);

        this.displayed.set(toDisplay);

        if (toQueue.length > 0) {
          this.queued.set([...this.queued(), ...toQueue]);
        }
      } else {
        this.queued.set([...this.queued(), entry]);
      }
    } else {
      this.displayed.set(this.sort([...current, entry]));
    }

    return key;
  }

  /** 移除指定通知。若排隊中有通知，會自動遞補。 */
  remove(key: string): void {
    const current = this.displayed();
    const filtered = current.filter((n) => n.key !== key);

    if (filtered.length === current.length) {
      // Might be in queue
      this.queued.set(this.queued().filter((n) => n.key !== key));

      return;
    }

    const queue = this.queued();
    const maxCount = this.currentConfig.maxCount ?? Infinity;

    if (queue.length > 0 && filtered.length < maxCount) {
      const availableSlots = maxCount - filtered.length;
      const toDisplay = queue.slice(0, availableSlots);
      const remaining = queue.slice(availableSlots);

      this.displayed.set(this.sort([...filtered, ...toDisplay]));
      this.queued.set(remaining);
    } else {
      this.displayed.set(this.sort([...filtered]));
    }
  }

  /** 移除所有通知。 */
  destroy(): void {
    this.displayed.set([]);
    this.queued.set([]);
  }
}
