'use client';

import { useCallback } from 'react';
import type {
  SortOrder,
  TableColumn,
  TableDataSource,
} from '@mezzanine-ui/core/table';
import type { TableSortingState } from '../TableContext';

export interface UseTableSortingOptions<T extends TableDataSource> {
  columns: TableColumn<T>[];
}

export function useTableSorting<T extends TableDataSource>({
  columns,
}: UseTableSortingOptions<T>): TableSortingState {
  const onSort = useCallback(
    (key: string) => {
      const column = columns.find((col) => col.key === key);

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
    },
    [columns],
  );

  return {
    onSort,
  };
}
