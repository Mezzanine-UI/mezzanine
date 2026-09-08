import type { CSSProperties } from 'vue';
import type { TableDataSource } from '@mezzanine-ui/core/table';
import type { TableDraggableProvided } from './table-drag-and-drop.types';

export interface TableRowProps<T extends TableDataSource = TableDataSource> {
  /** What the drag implementation hands this row, when dragging is on. */
  draggableProvided?: TableDraggableProvided;
  /**
   * Receives the row element, so the virtualizer can measure it. React passes
   * a plain `ref` here; Vue's function refs on a component hand back the
   * instance, so the row calls this with its own element instead.
   */
  measureRef?: (element: HTMLElement | null) => void;
  /**
   * Row record. Omitted for loading skeleton rows — a placeholder row has no
   * record, so every consumer callback that would receive one is skipped.
   */
  record?: T;
  /** Where the row sits. */
  rowIndex: number;
  /** Extra inline style, merged under the drag transform. */
  style?: CSSProperties;
}
