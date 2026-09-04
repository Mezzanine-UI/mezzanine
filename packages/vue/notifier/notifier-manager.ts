import { shallowRef } from 'vue';
import type { ShallowRef } from 'vue';
import type { NotifierData, NotifierKey } from './notifier.types';

export interface NotifierManagerOptions<N extends NotifierData> {
  maxCount?: number;
  /**
   * Sorting hook to enforce display/queue ordering before updates.
   */
  sortBeforeUpdate?: (
    notifiers: (N & { key: NotifierKey })[],
  ) => (N & { key: NotifierKey })[];
}

export interface NotifierManager<N extends NotifierData> {
  add: (notifier: N & { key: NotifierKey }) => void;
  /**
   * What is on screen right now, in display order.
   */
  displayed: ShallowRef<(N & { key: NotifierKey })[]>;
  /**
   * What is waiting for a free slot.
   */
  queued: ShallowRef<(N & { key: NotifierKey })[]>;
  remove: (key: NotifierKey) => void;
}

/**
 * The display/queue state machine behind a notifier, ported from React's
 * `NotifierManager`.
 *
 * React holds this in component state and drains the queue from an effect;
 * here it is plain reactive state that drains right after each mutation. The
 * two are equivalent because the queue can only gain room when something is
 * removed and can only grow when something is added — the observable
 * invariant, `displayed.length <= maxCount`, holds either way.
 */
export function createNotifierManager<N extends NotifierData>(
  options: NotifierManagerOptions<N> = {},
): NotifierManager<N> {
  type Entry = N & { key: NotifierKey };

  const displayed = shallowRef<Entry[]>([]);
  const queued = shallowRef<Entry[]>([]);

  // 只有在呼叫端有提供 sortBeforeUpdate 時才執行排序，否則維持原本順序。
  const sort = (notifiers: Entry[]): Entry[] =>
    options.sortBeforeUpdate ? options.sortBeforeUpdate(notifiers) : notifiers;

  // 當有空位時，從 queue 中補上
  function drain(): void {
    if (queued.value.length === 0) return;

    const hasMaxCount = typeof options.maxCount === 'number';
    const availableSlots = hasMaxCount
      ? (options.maxCount as number) - displayed.value.length
      : Infinity;

    if (availableSlots <= 0) return;

    displayed.value = sort([
      ...displayed.value,
      ...queued.value.slice(0, availableSlots),
    ]);
    queued.value = queued.value.slice(availableSlots);
  }

  function add(notifier: Entry): void {
    const index = displayed.value.findIndex(({ key }) => key === notifier.key);

    // 如果已存在，則更新該訊息
    if (index !== -1) {
      const next = [...displayed.value];

      next[index] = notifier;
      displayed.value = sort(next);

      return;
    }

    const hasMaxCount = typeof options.maxCount === 'number';

    // 新訊息：檢查是否超過 maxCount
    if (hasMaxCount && displayed.value.length >= (options.maxCount as number)) {
      if (options.sortBeforeUpdate) {
        // 需要排序時，先把舊有與新增併在一起排序，
        // 取前 maxCount 個顯示，其餘補進 queue。
        const all = sort([...displayed.value, notifier]);

        displayed.value = all.slice(0, options.maxCount);
        queued.value = [...queued.value, ...all.slice(options.maxCount)];

        return;
      }

      // 超過上限，加入 queue
      queued.value = [...queued.value, notifier];

      return;
    }

    // 未超過上限，直接加入並依需求排序。
    displayed.value = sort([...displayed.value, notifier]);
  }

  function remove(key: NotifierKey): void {
    displayed.value = displayed.value.filter((n) => n.key !== key);
    queued.value = queued.value.filter((n) => n.key !== key);
    drain();
  }

  return { add, displayed, queued, remove };
}
