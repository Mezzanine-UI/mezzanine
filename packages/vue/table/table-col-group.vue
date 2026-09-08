<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  DRAG_OR_PIN_HANDLE_COLUMN_WIDTH,
  DRAG_OR_PIN_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
} from '@mezzanine-ui/core/table';
import {
  calculateColumnWidths,
  shouldCalculateWidths,
} from './calculate-column-widths';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import { useTableSuperContext } from './table-super-context';

/**
 * 表格的 colgroup，欄寬統一在這裡決定，儲存格自己不設寬度。
 *
 * 根層表格會依容器寬度把沒宣告寬度的欄位平分剩餘空間；巢狀表格不算，改用外層拖曳過的
 * 寬度，讓子表的欄位與父表對齊。
 *
 * @see MznTable 渲染它的元件
 * @see calculateColumnWidths 分配寬度的純函式
 */
const table = useTableContext();
const data = useTableDataContext();
const superContext = useTableSuperContext();

// For nested tables, use parent's resized widths; for root tables, use own
const getResizedColumnWidth = computed(
  (): ((key: string) => number | undefined) | undefined =>
    table.value.isInsideExpandedContentArea
      ? superContext.value.getResizedColumnWidth
      : table.value.columnState?.getResizedColumnWidth,
);

// Check if we should calculate explicit widths
const enableWidthCalculation = computed((): boolean =>
  shouldCalculateWidths(
    !!table.value.isInsideExpandedContentArea,
    superContext.value.containerWidth,
  ),
);

const hasDragOrPinHandle = computed(
  (): boolean =>
    Boolean(table.value.draggable?.enabled) ||
    Boolean(table.value.pinnable?.enabled),
);

// Calculate action columns total width
const actionColumnsWidth = computed((): number => {
  let width = 0;

  if (hasDragOrPinHandle.value) width += DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;
  if (table.value.selection) width += SELECTION_COLUMN_WIDTH;
  if (table.value.expansion) width += EXPANSION_COLUMN_WIDTH;

  return width;
});

// Calculate resolved widths for all columns (only for root tables)
const resolvedWidths = computed((): Map<string, number> => {
  if (!enableWidthCalculation.value) {
    return new Map<string, number>();
  }

  return calculateColumnWidths({
    actionColumnsWidth: actionColumnsWidth.value,
    columns: data.value.columns,
    containerWidth: superContext.value.containerWidth ?? 0,
    getResizedColumnWidth: getResizedColumnWidth.value,
  });
});

const fixedColStyle = (width: number): CSSProperties => ({
  maxWidth: `${width}px`,
  minWidth: `${width}px`,
  width: `${width}px`,
});

const columnStyle = (key: string): CSSProperties => {
  const column = data.value.columns.find((col) => col.key === key);
  const style: CSSProperties = {};

  if (!column) return style;

  // For root tables with width calculation enabled, use resolved widths
  // For nested tables, sync with parent's resized widths
  if (enableWidthCalculation.value) {
    const resolvedWidth = resolvedWidths.value.get(column.key);

    if (resolvedWidth !== undefined) {
      style.width = `${resolvedWidth}px`;
    }
  } else {
    // Nested table: check if parent has resized this column
    const parentResizedWidth =
      getResizedColumnWidth.value?.(column.key) ?? column.width;

    if (parentResizedWidth !== undefined) {
      style.width = `${parentResizedWidth}px`;
    }
  }

  if (column.minWidth !== undefined) {
    style.minWidth = `${column.minWidth}px`;
  }

  if (column.maxWidth !== undefined) {
    style.maxWidth = `${column.maxWidth}px`;
  }

  return style;
};

const DRAG_OR_PIN_HANDLE_STYLE = fixedColStyle(DRAG_OR_PIN_HANDLE_COLUMN_WIDTH);
const EXPANSION_STYLE = fixedColStyle(EXPANSION_COLUMN_WIDTH);
const SELECTION_STYLE = fixedColStyle(SELECTION_COLUMN_WIDTH);
</script>

<template>
  <colgroup>
    <col
      v-if="hasDragOrPinHandle"
      :key="DRAG_OR_PIN_HANDLE_KEY"
      :style="DRAG_OR_PIN_HANDLE_STYLE"
    />
    <col v-if="table.expansion" :key="EXPANSION_KEY" :style="EXPANSION_STYLE" />
    <col v-if="table.selection" :key="SELECTION_KEY" :style="SELECTION_STYLE" />
    <col
      v-for="column in data.columns"
      :key="column.key"
      :style="columnStyle(column.key)"
    />
  </colgroup>
</template>
