import type { SortOrder, TableDataSource } from '@mezzanine-ui/core/table';
import type { TableSortingState } from './table-context';
import type { TableColumn } from './table.types';

export interface UseTableSortingOptions<T extends TableDataSource> {
  /** The columns whose `onSort` may be called. */
  columns: () => TableColumn<T>[];
}

/**
 * 把表頭的點擊換算成下一個排序方向，再交還給欄位自己的 `onSort`。
 *
 * 排序狀態完全由使用端持有（`column.sortOrder` 是受控的），這裡只負責
 * ascend → descend → 不排序的循環。沒有給 `onSort` 的欄位點了不會有任何事。
 *
 * @example
 * ```ts
 * const sorting = useTableSorting({ columns: () => props.columns });
 *
 * sorting.onSort('name');
 * ```
 *
 * @see MznTableHeader 呼叫它的元件
 */
export function useTableSorting<T extends TableDataSource>({
  columns,
}: UseTableSortingOptions<T>): TableSortingState {
  const onSort = (key: string): void => {
    const column = columns().find((col) => col.key === key);

    if (!column || !column.onSort) return;

    const sortedKey = column.key;
    const sortedDirection = column.sortOrder;
    let nextDirection: SortOrder;

    if (sortedKey !== key) {
      nextDirection = 'ascend';
    } else if (!sortedDirection) {
      nextDirection = 'ascend';
    } else if (sortedDirection === 'ascend') {
      nextDirection = 'descend';
    } else {
      nextDirection = null;
    }

    column.onSort?.(key, nextDirection);
  };

  return {
    onSort,
  };
}
