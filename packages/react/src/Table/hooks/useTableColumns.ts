'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  EXPANSION_COLUMN_WIDTH,
  SELECTION_COLUMN_WIDTH,
  type FixedType,
  type TableColumn,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import type { TableColumnState } from '../TableContext';
import { ActionColumnConfig } from './typings';

export interface UseTableColumnsOptions<T extends TableDataSource> {
  actionConfig: ActionColumnConfig;
  columns: TableColumn<T>[];
}

export function useTableColumns<T extends TableDataSource>({
  actionConfig,
  columns,
}: UseTableColumnsOptions<T>): TableColumnState {
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
      const start: TableColumn[] = [];
      const end: TableColumn[] = [];
      const scrollable: TableColumn[] = [];

      columns.forEach((col) => {
        const fixedPos = parseFixed(col.fixed);

        if (fixedPos === 'start') {
          start.push(col as TableColumn);
        } else if (fixedPos === 'end') {
          end.push(col as TableColumn);
        } else {
          scrollable.push(col as TableColumn);
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
    columns: columns as TableColumn[],
    fixedEndColumns,
    fixedStartColumns,
    getResizedColumnWidth,
    scrollableColumns,
    setResizedColumnWidth,
    totalFixedEndWidth,
    totalFixedStartWidth,
  };
}
