import type { TableColumn } from './table.types';

export interface TableResizeHandleProps {
  /** The column this resize handle belongs to */
  column: TableColumn;
  /** Index of the column in the columns array */
  columnIndex: number;
}
