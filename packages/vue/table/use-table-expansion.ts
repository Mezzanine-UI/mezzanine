import { computed, shallowRef } from 'vue';
import type { ComputedRef } from 'vue';
import {
  DRAG_OR_PIN_HANDLE_COLUMN_WIDTH,
  EXPANSION_COLUMN_WIDTH,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import type { TableExpansionState } from './table-context';
import type { TableExpandable } from './table.types';

export interface UseTableExpansionOptions<T extends TableDataSource> {
  /** The `expandable` prop the table was given. */
  expandable: () => TableExpandable<T> | undefined;
  /** Whether a drag or pin handle column sits before the expand column. */
  hasDragOrPinHandle: () => boolean;
}

/**
 * 管理哪些列被展開。
 *
 * 給了 `expandedRowKeys` 就是受控，沒給就由內部狀態記著；兩種情況下
 * `onExpand` 與 `onExpandedRowsChange` 都照樣回報。`expansionLeftPadding`
 * 是展開內容要讓開的左側寬度，等於前面那些把手欄位的總寬。
 *
 * @example
 * ```ts
 * const expansion = useTableExpansion({
 *   expandable: () => props.expandable,
 *   hasDragOrPinHandle: () => Boolean(props.draggable ?? props.pinnable),
 * });
 * ```
 *
 * @see MznTableExpandCell 觸發展開的儲存格
 * @see MznTableExpandedRow 展開後的內容列
 */
export function useTableExpansion<T extends TableDataSource>({
  expandable,
  hasDragOrPinHandle,
}: UseTableExpansionOptions<T>): ComputedRef<
  TableExpansionState<T> | undefined
> {
  const internalExpandedKeys = shallowRef<string[]>([]);

  const isControlled = (): boolean =>
    expandable()?.expandedRowKeys !== undefined;

  const expandedRowKeys = computed((): string[] => {
    const controlled = expandable()?.expandedRowKeys;

    return controlled ?? internalExpandedKeys.value;
  });

  const isRowExpanded = (key: string): boolean =>
    expandedRowKeys.value.includes(key);

  const toggleExpand = (key: string, record: T): void => {
    const config = expandable();
    const isExpanded = expandedRowKeys.value.includes(key);
    const newKeys = isExpanded
      ? expandedRowKeys.value.filter((k) => k !== key)
      : [...expandedRowKeys.value, key];

    if (!isControlled()) {
      internalExpandedKeys.value = newKeys;
    }

    config?.onExpand?.(!isExpanded, record);
    config?.onExpandedRowsChange?.(newKeys);
  };

  const expansionLeftPadding = computed((): number => {
    let padding = 0;

    if (hasDragOrPinHandle()) padding += DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;
    if (expandable()) padding += EXPANSION_COLUMN_WIDTH;

    return padding;
  });

  return computed((): TableExpansionState<T> | undefined => {
    const config = expandable();

    if (!config) {
      return undefined;
    }

    return {
      config,
      expansionLeftPadding: expansionLeftPadding.value,
      expandedRowKeys: expandedRowKeys.value,
      isRowExpanded,
      toggleExpand,
    };
  });
}
