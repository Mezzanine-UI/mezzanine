'use client';

import { useCallback } from 'react';
import type {
  SortDirection,
  TableV2Column,
  TableV2DataSource,
} from '@mezzanine-ui/core/tableV2';
import type { TableV2SortingState } from '../TableV2Context';

export interface UseTableV2SortingOptions<T extends TableV2DataSource> {
  columns: TableV2Column<T>[];
}

export function useTableV2Sorting<T extends TableV2DataSource>({
  columns,
}: UseTableV2SortingOptions<T>): TableV2SortingState {
  const onSort = useCallback(
    (key: string) => {
      const column = columns.find((col) => col.key === key);

      if (!column || !column.onSort) return;

      const sortedKey = column.key;
      const sortedDirection = column.sortOrder;
      let nextDirection: SortDirection;

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
