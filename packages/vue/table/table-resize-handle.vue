<script setup lang="ts">
import { computed } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import type { TableResizeHandleProps } from './table-resize-handle.types';

/**
 * 表頭欄位右緣的拖曳把手，負責調整欄寬。
 *
 * 寬度是零和的：拉寬這一欄的量優先從**最後一欄**扣，扣不完才回頭找右邊相鄰的那一欄；
 * 當這一欄本來就緊鄰最後一欄時退回單純的相鄰補償。最後一欄自己沒有把手（右邊沒有欄位
 * 可以補償）。所有寬度都從 DOM 的 colgroup 實際量出來，而不是用宣告值。
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

/** React keeps these three in refs; a drag is short-lived, so plain bindings do. */
let startWidth = 0;
let nextStartWidth = 0;
let startX = 0;

// Calculate action columns offset
const actionColumnsOffset = computed((): number => {
  const { draggable, expansion, selection } = table.value;
  let offset = 0;

  if (draggable?.enabled) offset += 1;
  if (expansion) offset += 1;
  if (selection) offset += 1;

  return offset;
});

const isLastColumn = computed(
  (): boolean => props.columnIndex >= data.value.columns.length - 1,
);

// Get the actual rendered width of a column from the DOM
function getColumnActualWidth(colIndex: number): number {
  const container = table.value.scrollContainerRef?.value;

  if (!container) return 0;

  const tableElement = container.querySelector('table');

  if (!tableElement) return 0;

  const colGroup = tableElement.querySelector('colgroup');

  if (!colGroup) return 0;

  const colElements = colGroup.querySelectorAll('col');
  const targetCol = colElements[actionColumnsOffset.value + colIndex];

  if (!targetCol) return 0;

  return targetCol.getBoundingClientRect().width;
}

function handleMouseDown(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();

  const { columns } = data.value;
  const { setResizedColumnWidth } = table.value.columnState ?? {};

  // Get next column (the one to the right)
  const nextColumn = columns[props.columnIndex + 1];

  if (!nextColumn) {
    // If there's no next column, we can't do adjacent resize
    return;
  }

  const lastColumnIndex = columns.length - 1;
  const lastColumn = columns[lastColumnIndex];
  // When resizing the second-to-last column, nextColumn === lastColumn.
  // We collapse to the legacy adjacent-compensation path to avoid
  // double-writing the same key.
  const isAdjacentToLast = props.columnIndex + 1 === lastColumnIndex;

  // Get the actual rendered widths from the DOM
  const currentWidth = getColumnActualWidth(props.columnIndex);
  const nextWidth = getColumnActualWidth(props.columnIndex + 1);
  const lastWidth = isAdjacentToLast
    ? nextWidth
    : getColumnActualWidth(lastColumnIndex);

  if (currentWidth === 0 || nextWidth === 0 || lastWidth === 0) {
    return;
  }

  startX = event.clientX;
  startWidth = currentWidth;
  nextStartWidth = nextWidth;

  const { maxWidth, minWidth } = props.column;
  const { maxWidth: nextMaxWidth, minWidth: nextMinWidth } = nextColumn;
  const { maxWidth: lastMaxWidth, minWidth: lastMinWidth } = lastColumn;

  // Slack the last column can absorb (signed against `diff`):
  // - positive `diff` shrinks last → capped by lastShrinkBudget
  // - negative `diff` grows last → capped by lastGrowBudget
  const lastShrinkBudget = lastWidth - (lastMinWidth ?? 0);
  const lastGrowBudget =
    lastMaxWidth !== undefined ? lastMaxWidth - lastWidth : Infinity;

  const handleMouseMove = (moveEvent: MouseEvent): void => {
    const diff = moveEvent.clientX - startX;
    const newWidth = startWidth + diff;

    // Current column constraint checks
    if (minWidth !== undefined && newWidth < minWidth) return;
    if (maxWidth !== undefined && newWidth > maxWidth) return;
    if (newWidth < 0) return;

    if (isAdjacentToLast) {
      // Legacy adjacent compensation: donor === N+1 === last
      const newNextWidth = nextStartWidth - diff;

      if (nextMinWidth !== undefined && newNextWidth < nextMinWidth) return;
      if (nextMaxWidth !== undefined && newNextWidth > nextMaxWidth) return;
      if (newNextWidth < 0) return;

      setResizedColumnWidth?.(props.column.key, newWidth);
      setResizedColumnWidth?.(nextColumn.key, newNextWidth);

      return;
    }

    // Last-column donor strategy:
    // Project `diff` onto the last column first (clamped to its budget).
    // Any overflow falls back to the adjacent column (N+1).
    let toLast: number;

    if (diff >= 0) {
      toLast = Math.min(diff, lastShrinkBudget);
    } else {
      toLast = Math.max(diff, -lastGrowBudget);
    }

    const overflow = diff - toLast;
    const newLastWidth = lastWidth - toLast;
    // Always write N+1 too — when overflow returns to 0 on the return
    // drag, this restores N+1 to its start width (LIFO donor restoration).
    const newNextWidth = nextStartWidth - overflow;

    if (nextMinWidth !== undefined && newNextWidth < nextMinWidth) return;
    if (nextMaxWidth !== undefined && newNextWidth > nextMaxWidth) return;
    if (newNextWidth < 0) return;

    setResizedColumnWidth?.(props.column.key, newWidth);
    setResizedColumnWidth?.(lastColumn.key, newLastWidth);
    setResizedColumnWidth?.(nextColumn.key, newNextWidth);
  };

  const handleMouseUp = (): void => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}
</script>

<template>
  <!-- Don't show resize handle for the last column (no adjacent column to resize) -->
  <div
    v-if="!isLastColumn"
    aria-hidden="true"
    :class="classes.resizeHandle"
    role="presentation"
    @mousedown="handleMouseDown"
  />
</template>
