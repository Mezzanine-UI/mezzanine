'use client';

import { memo, useRef } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  DRAG_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  tableV2Classes,
} from '@mezzanine-ui/core/tableV2';
import { useTableV2Context } from '../TableV2Context';

export interface TableV2ColGroupProps {
  className?: string;
}

const TableV2ColGroupInner = memo(function TableV2ColGroup(
  props: TableV2ColGroupProps,
) {
  const { className } = props;

  const { columnState, columns, draggable, expansion, selection } =
    useTableV2Context();
  const { getResizedColumnWidth } = columnState || {};

  // Refs for measuring action column widths
  const dragHandleRef = useRef<HTMLTableColElement>(null);
  const selectionRef = useRef<HTMLTableColElement>(null);
  const expansionRef = useRef<HTMLTableColElement>(null);

  const renderCols = () => {
    const cols: React.ReactNode[] = [];

    // Drag handle column (must be first)
    if (draggable?.enabled) {
      cols.push(
        <col
          ref={dragHandleRef}
          className={tableV2Classes.dragHandleCell}
          key={DRAG_HANDLE_KEY}
          style={{
            width: DRAG_HANDLE_COLUMN_WIDTH,
            minWidth: DRAG_HANDLE_COLUMN_WIDTH,
          }}
        />,
      );
    }

    // Selection column
    if (selection) {
      cols.push(
        <col
          ref={selectionRef}
          className={tableV2Classes.selectionColumn}
          key={SELECTION_KEY}
          style={{
            width: SELECTION_COLUMN_WIDTH,
            minWidth: SELECTION_COLUMN_WIDTH,
          }}
        />,
      );
    }

    // Expand column
    if (expansion) {
      cols.push(
        <col
          ref={expansionRef}
          className={tableV2Classes.expandCell}
          key={EXPANSION_KEY}
          style={{
            width: EXPANSION_COLUMN_WIDTH,
            minWidth: EXPANSION_COLUMN_WIDTH,
          }}
        />,
      );
    }

    // Data columns
    columns.forEach((column) => {
      const width = getResizedColumnWidth?.(column.key) ?? column.width;

      cols.push(
        <col
          key={column.key}
          style={width ? { width, minWidth: width } : undefined}
        />,
      );
    });

    return cols;
  };

  return <colgroup className={className}>{renderCols()}</colgroup>;
});

export const TableV2ColGroup = TableV2ColGroupInner;
