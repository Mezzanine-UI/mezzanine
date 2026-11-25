<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import type { TableColumn } from './table.types';
import type { TableResizeHandleProps } from './table-resize-handle.types';

/**
 * 表頭欄位右緣的拖曳把手，負責調整欄寬。
 *
 * `resizeStrategy='preserve-table-width'`（預設）時寬度是零和的：拉寬這一欄的量優先從
 * **最後一欄**扣，扣不完才回頭找右邊相鄰的那一欄，最後一欄自己沒有把手。
 * `'grow-table'` 時只改被拖的那一欄，表格隨之變寬並水平捲動，最後一欄也有把手。
 * 所有寬度都從 DOM 的 colgroup 實際量出來，而不是用宣告值。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableResizeHandle :column="column" :column-index="index" />
 * </template>
 * ```
 *
 * @see MznTableHeader 渲染它的元件
 * @see useTableResizedColumns 記住拖曳結果的 composable
 */
const props = defineProps<TableResizeHandleProps>();

const table = useTableContext();
const data = useTableDataContext();

type SetColumnWidth = (key: string, width: number) => void;

/**
 * Applies the drag distance `diff` (px, relative to mousedown) to the widths.
 * Returns false when the move violates a constraint and was ignored.
 */
type ResizeMoveHandler = (diff: number) => boolean;

// Detaches the document listeners of an in-progress drag (null when idle)
let stopDraggingFn: (() => void) | null = null;

// A drag still in progress when the handle unmounts must not report later
onBeforeUnmount(() => {
  if (!stopDraggingFn) return;

  stopDraggingFn();
  stopDraggingFn = null;
  table.value.columnState?.discardResizedColumnWidths();
});

const isGrowTable = computed(
  (): boolean => table.value.resizeStrategy === 'grow-table',
);

// Calculate action columns offset. Must mirror the leading cols rendered
// by MznTableColGroup: drag and pin share a single handle column.
const actionColumnsOffset = computed((): number => {
  const { draggable, expansion, pinnable, selection } = table.value;
  let offset = 0;

  if (draggable?.enabled || pinnable?.enabled) offset += 1;
  if (expansion) offset += 1;
  if (selection) offset += 1;

  return offset;
});

// Preserving the table width needs a column to the right to borrow from;
// growing the table does not, so the last column keeps its handle.
const isHandleHidden = computed(
  (): boolean =>
    !isGrowTable.value && props.columnIndex >= data.value.columns.length - 1,
);

/** Whether `width` is within `[minWidth, maxWidth]` and non-negative. */
function isWithinBounds(
  width: number,
  minWidth?: number,
  maxWidth?: number,
): boolean {
  if (width < 0) return false;
  if (minWidth !== undefined && width < minWidth) return false;
  if (maxWidth !== undefined && width > maxWidth) return false;

  return true;
}

// Get the actual rendered width of a column from the DOM
function getColumnActualWidth(colIndex: number): number {
  const colElements = table.value.scrollContainerRef?.value?.querySelectorAll(
    'table > colgroup > col',
  );
  const targetCol = colElements?.[actionColumnsOffset.value + colIndex];

  return targetCol ? targetCol.getBoundingClientRect().width : 0;
}

/**
 * `'grow-table'`: only the dragged column changes, so the table widens or
 * narrows by the drag distance (spreadsheet-style resizing).
 */
function createGrowTableMove(
  column: TableColumn,
  startWidth: number,
  setWidth: SetColumnWidth,
): ResizeMoveHandler {
  return (diff) => {
    const newWidth = startWidth + diff;

    if (!isWithinBounds(newWidth, column.minWidth, column.maxWidth)) {
      return false;
    }

    setWidth(column.key, newWidth);

    return true;
  };
}

/**
 * `'preserve-table-width'`: the table keeps its total width. The width the
 * dragged column gains or loses is taken from (or given to) the last column
 * first, within its min/max, and the overflow from the adjacent column.
 */
function createPreserveTableWidthMove(
  column: TableColumn,
  startWidth: number,
  setWidth: SetColumnWidth,
): ResizeMoveHandler | null {
  const { columns } = data.value;
  const nextColumn = columns[props.columnIndex + 1];
  const lastColumnIndex = columns.length - 1;
  const lastColumn = columns[lastColumnIndex];

  if (!nextColumn) return null;

  // When resizing the second-to-last column, nextColumn === lastColumn:
  // collapse to plain adjacent compensation to avoid double-writing a key.
  const isAdjacentToLast = props.columnIndex + 1 === lastColumnIndex;
  const nextStartWidth = getColumnActualWidth(props.columnIndex + 1);
  const lastStartWidth = isAdjacentToLast
    ? nextStartWidth
    : getColumnActualWidth(lastColumnIndex);

  if (nextStartWidth === 0 || lastStartWidth === 0) return null;

  // Slack the last column can absorb (signed against `diff`):
  // - positive `diff` shrinks last → capped by lastShrinkBudget
  // - negative `diff` grows last → capped by lastGrowBudget
  const lastShrinkBudget = lastStartWidth - (lastColumn.minWidth ?? 0);
  const lastGrowBudget =
    lastColumn.maxWidth !== undefined
      ? lastColumn.maxWidth - lastStartWidth
      : Infinity;

  return (diff) => {
    const newWidth = startWidth + diff;

    if (!isWithinBounds(newWidth, column.minWidth, column.maxWidth)) {
      return false;
    }

    const toLast = isAdjacentToLast
      ? 0
      : diff >= 0
        ? Math.min(diff, lastShrinkBudget)
        : Math.max(diff, -lastGrowBudget);
    // Always write N+1 too — when the overflow returns to 0 on the return
    // drag, this restores N+1 to its start width (LIFO donor restoration).
    const newNextWidth = nextStartWidth - (diff - toLast);

    if (
      !isWithinBounds(newNextWidth, nextColumn.minWidth, nextColumn.maxWidth)
    ) {
      return false;
    }

    setWidth(column.key, newWidth);

    if (!isAdjacentToLast) {
      setWidth(lastColumn.key, lastStartWidth - toLast);
    }

    setWidth(nextColumn.key, newNextWidth);

    return true;
  };
}

// Builds the move handler of the active strategy (null = cannot resize)
function createMoveHandler(): ResizeMoveHandler | null {
  const setWidth: SetColumnWidth = (key, width) =>
    table.value.columnState?.setResizedColumnWidth(key, width);
  const startWidth = getColumnActualWidth(props.columnIndex);

  if (startWidth === 0) return null;

  return isGrowTable.value
    ? createGrowTableMove(props.column, startWidth, setWidth)
    : createPreserveTableWidthMove(props.column, startWidth, setWidth);
}

function handleMouseDown(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();

  const applyMove = createMoveHandler();

  if (!applyMove) return;

  const { commitResizedColumnWidths, discardResizedColumnWidths } =
    table.value.columnState ?? {};
  const startX = event.clientX;
  // Net drag distance last written to the widths; 0 means no visible change
  let appliedDiff = 0;

  const handleMouseMove = (moveEvent: MouseEvent): void => {
    const diff = moveEvent.clientX - startX;

    if (applyMove(diff)) appliedDiff = diff;
  };

  const stopDragging = (): void => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    stopDraggingFn = null;
  };

  const handleMouseUp = (): void => {
    stopDragging();

    // A drag that ends where it started only re-wrote measured start
    // widths; dropping them avoids reporting (and pinning) a no-op.
    if (appliedDiff === 0) {
      discardResizedColumnWidths?.();
    } else {
      commitResizedColumnWidths?.();
    }
  };

  stopDraggingFn = stopDragging;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}
</script>

<template>
  <div
    v-if="!isHandleHidden"
    aria-hidden="true"
    :class="classes.resizeHandle"
    role="presentation"
    @mousedown="handleMouseDown"
  />
</template>
