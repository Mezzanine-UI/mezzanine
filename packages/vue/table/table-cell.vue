<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import type { CSSProperties, VNodeChild } from 'vue';
import {
  getCellAlignClass,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import clsx from 'clsx';
import MznSkeleton from '../skeleton/skeleton.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import { useTableContext } from './table-context';
import type { TableCellProps } from './table-cell.types';

/**
 * 表格的一般資料儲存格。
 *
 * 值取自 `column.render(record, index)`，沒有 render 就取 `record[dataIndex]`；
 * `ellipsis` 預設開啟，內容真的被截斷時（`scrollWidth > offsetWidth`）滑過才會跳出
 * tooltip。固定欄的位移以 `--fixed-start-offset` / `--fixed-end-offset` 交給 CSS。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableCell :column="column" :column-index="0" :record="record" :row-index="0" />
 * </template>
 * ```
 *
 * @see MznTableRow 渲染它的元件
 */
const props = withDefaults(defineProps<TableCellProps<TableDataSource>>(), {
  colSpan: 1,
  fixed: undefined,
  fixedOffset: 0,
  record: undefined,
  showShadow: false,
  width: undefined,
});

const table = useTableContext();

const ellipsisEl = shallowRef<HTMLElement | null>(null);

const setEllipsis = (element: unknown): void => {
  ellipsisEl.value = (element as HTMLElement | null) ?? null;
};

const cellValue = computed((): VNodeChild => {
  // Skeleton row: the loading branch discards the value anyway, and there is
  // no record to hand to the consumer's render().
  if (!props.record) return null;

  const dataIndex = props.column.dataIndex ?? props.column.key;

  if (props.column.render) {
    return props.column.render(props.record, props.rowIndex);
  }

  return props.record[dataIndex] as VNodeChild;
});

const hasCellValue = computed(
  (): boolean => cellValue.value !== null && cellValue.value !== undefined,
);

// Width is managed by colgroup, set fixed position offset via CSS variable
// When width is provided (dragging state), apply it directly
const cellStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  // Apply explicit width for dragging state
  if (props.width !== undefined) {
    style.width = `${props.width}px`;
    style.minWidth = `${props.width}px`;
    style.maxWidth = `${props.width}px`;
    style.flexShrink = 0;
  }

  // Set CSS variable for fixed column positioning
  if (props.fixed === 'start') {
    (style as Record<string, string>)['--fixed-start-offset'] =
      `${props.fixedOffset}px`;
  } else if (props.fixed === 'end') {
    (style as Record<string, string>)['--fixed-end-offset'] =
      `${props.fixedOffset}px`;
  }

  return style;
});

const alignClass = computed((): string =>
  getCellAlignClass(props.column.align),
);

/** default to true if undefined */
const isColumnEllipsis = computed((): boolean => props.column.ellipsis ?? true);

const isCellHighlighted = computed((): boolean => {
  const { highlight } = table.value;

  if (!highlight) return false;

  const { columnIndex: hoveredColumn, mode, rowIndex: hoveredRow } = highlight;

  if (hoveredRow === null || hoveredColumn === null) return false;

  switch (mode) {
    case 'cell':
      return (
        hoveredRow === props.rowIndex && hoveredColumn === props.columnIndex
      );
    case 'column':
      return hoveredColumn === props.columnIndex;
    case 'cross':
      return hoveredColumn === props.columnIndex;
    case 'row':
    default:
      return false;
  }
});

const cellClasses = computed((): string =>
  clsx(classes.cell, {
    [classes.cellFixed]: !!props.fixed,
    [classes.cellFixedEnd]: props.fixed === 'end',
    [classes.cellFixedShadow]: props.showShadow,
    [classes.cellFixedStart]: props.fixed === 'start',
    [classes.cellHighlight]: isCellHighlighted.value,
  }),
);

const contentClasses = computed((): string =>
  clsx(classes.cellContent, alignClass.value, {
    [classes.cellEllipsis]: isColumnEllipsis.value,
  }),
);

function handleMouseEnter(): void {
  table.value.highlight?.setHoveredCell(props.rowIndex, props.columnIndex);
}

/** Only open the tooltip when the content is actually being truncated. */
function handleEllipsisEnter(
  event: MouseEvent,
  forward: (event: MouseEvent) => void,
): void {
  const element = ellipsisEl.value;

  if (!element) return;

  if (element.scrollWidth > element.offsetWidth) forward(event);
}
</script>

<template>
  <td
    :class="cellClasses"
    :colspan="colSpan > 1 ? colSpan : undefined"
    :style="cellStyle"
    @mouseenter="handleMouseEnter"
  >
    <MznSkeleton v-if="table.loading" width="100%" variant="body-highlight" />
    <MznTooltip
      v-else-if="isColumnEllipsis"
      :anchor="ellipsisEl"
      :options="{ placement: 'top-start' }"
    >
      <template v-if="hasCellValue" #title>
        <component :is="() => cellValue" />
      </template>
      <template #default="{ onMouseenter, onMouseleave }">
        <!-- "display: grid" for feature ellipsis to work properly -->
        <div style="display: grid; width: 100%">
          <div
            :ref="setEllipsis"
            :class="contentClasses"
            @mouseenter="handleEllipsisEnter($event, onMouseenter)"
            @mouseleave="onMouseleave"
          >
            <component :is="() => cellValue" />
          </div>
        </div>
      </template>
    </MznTooltip>
    <!-- "display: grid" for feature ellipsis to work properly -->
    <div v-else style="display: grid; width: 100%">
      <div :class="clsx(classes.cellContent, alignClass)">
        <component :is="() => cellValue" />
      </div>
    </div>
  </td>
</template>
