'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  EXPANSION_COLUMN_WIDTH,
  SELECTION_COLUMN_WIDTH,
  type FixedType,
  type TableV2Column,
  type TableV2DataSource,
} from '@mezzanine-ui/core/tableV2';
import type { TableV2ColumnState } from '../TableV2Context';
import { ActionColumnConfig } from './typings';

export interface UseTableV2ColumnsOptions<T extends TableV2DataSource> {
  actionConfig: ActionColumnConfig;
  columns: TableV2Column<T>[];
}

export function useTableV2Columns<T extends TableV2DataSource>({
  actionConfig,
  columns,
}: UseTableV2ColumnsOptions<T>): TableV2ColumnState {
  const { dragHandleFixed, expansionFixed, selectionFixed } = actionConfig;

  const [resizedColumnWidths, setResizedColumnWidths] = useState<
    Map<string, number>
  >(new Map());

  const parseFixed = (fixed: FixedType | undefined): 'start' | 'end' | null => {
    if (fixed === true || fixed === 'start') return 'start';
    if (fixed === 'end') return 'end';

    return null;
  };

  const { fixedEndColumns, fixedStartColumns, scrollableColumns } =
    useMemo(() => {
      const start: TableV2Column[] = [];
      const end: TableV2Column[] = [];
      const scrollable: TableV2Column[] = [];

      columns.forEach((col) => {
        const fixedPos = parseFixed(col.fixed);

        if (fixedPos === 'start') {
          start.push(col as TableV2Column);
        } else if (fixedPos === 'end') {
          end.push(col as TableV2Column);
        } else {
          scrollable.push(col as TableV2Column);
        }
      });

      return {
        fixedEndColumns: end,
        fixedStartColumns: start,
        scrollableColumns: scrollable,
      };
    }, [columns]);

  const totalFixedStartWidth = useMemo(() => {
    let width = 0;

    if (dragHandleFixed) {
      width += DRAG_HANDLE_COLUMN_WIDTH;
    }

    if (expansionFixed) {
      width += EXPANSION_COLUMN_WIDTH;
    }

    if (selectionFixed) {
      width += SELECTION_COLUMN_WIDTH;
    }

    fixedStartColumns.forEach((col) => {
      width += resizedColumnWidths.get(col.key) ?? col.width ?? 0;
    });

    return width;
  }, [
    selectionFixed,
    expansionFixed,
    dragHandleFixed,
    fixedStartColumns,
    resizedColumnWidths,
  ]);

  const totalFixedEndWidth = useMemo(() => {
    let width = 0;

    fixedEndColumns.forEach((col) => {
      width += resizedColumnWidths.get(col.key) ?? col.width ?? 0;
    });

    return width;
  }, [fixedEndColumns, resizedColumnWidths]);

  const getResizedColumnWidth = useCallback(
    (key: string) => {
      return resizedColumnWidths.get(key);
    },
    [resizedColumnWidths],
  );

  const setResizedColumnWidth = useCallback((key: string, width: number) => {
    setResizedColumnWidths((prev) => {
      const next = new Map(prev);

      next.set(key, width);

      return next;
    });
  }, []);

  return {
    resizedColumnWidths,
    columns: columns as TableV2Column[],
    fixedEndColumns,
    fixedStartColumns,
    getResizedColumnWidth,
    scrollableColumns,
    setResizedColumnWidth,
    totalFixedEndWidth,
    totalFixedStartWidth,
  };
}
