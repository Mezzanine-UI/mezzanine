<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import {
  COLLECTABLE_COLUMN_WIDTH,
  COLLECTABLE_KEY,
  DRAG_OR_PIN_HANDLE_COLUMN_WIDTH,
  DRAG_OR_PIN_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  getRowKey,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  TABLE_ACTIONS_KEY,
  tableClasses as classes,
  TOGGLEABLE_COLUMN_WIDTH,
  TOGGLEABLE_KEY,
  type FixedType,
  type TableDataSource,
  type TableRowState,
} from '@mezzanine-ui/core/table';
import clsx from 'clsx';
import { calculateColumnWidths } from './calculate-column-widths';
import MznTableActionsCell from './table-actions-cell.vue';
import MznTableCell from './table-cell.vue';
import MznTableCollectableCell from './table-collectable-cell.vue';
import MznTableDragOrPinHandleCell from './table-drag-or-pin-handle-cell.vue';
import MznTableExpandCell from './table-expand-cell.vue';
import MznTableSelectionCell from './table-selection-cell.vue';
import MznTableToggleableCell from './table-toggleable-cell.vue';
import { useTableContext } from './table-context';
import { useTableDataContext } from './table-data-context';
import { useTableSuperContext } from './table-super-context';
import type { TableColumn } from './table.types';
import type { TableRowProps } from './table-row.types';

/**
 * 表格的一列，負責把把手／展開／選取三個欄位與資料欄排在一起。
 *
 * 沒有 `record` 就是載入中的骨架列 —— 這時所有會拿到 record 的使用端回呼一律不呼叫。
 * 拖曳中的列因為改用 `position: fixed`，colgroup 的欄寬不再生效，所以每個儲存格會拿到
 * 明確的寬度。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableRow :record="record" :row-index="index" />
 * </template>
 * ```
 *
 * @see MznTableBody 渲染它的元件
 */
const props = withDefaults(defineProps<TableRowProps<TableDataSource>>(), {
  draggableProvided: undefined,
  measureRef: undefined,
  record: undefined,
  style: undefined,
});

const table = useTableContext();
const data = useTableDataContext();
const superContext = useTableSuperContext();

const resolveRowStateClass = (
  state: TableRowState | undefined,
): string | undefined => {
  switch (state) {
    case 'added':
      return classes.bodyRowStateAdded;
    case 'deleted':
      return classes.bodyRowStateDeleted;
    case 'disabled':
      return classes.bodyRowStateDisabled;
    default:
      return undefined;
  }
};

const parseFixed = (fixed: FixedType | undefined): 'end' | 'start' | null => {
  if (fixed === true || fixed === 'start') return 'start';
  if (fixed === 'end') return 'end';

  return null;
};

const isDragging = computed(
  (): boolean =>
    (props.draggableProvided?.draggableProps.style as CSSProperties | undefined)
      ?.position === 'fixed',
);

const resolvedStyle = computed((): CSSProperties => {
  const { rowHeight } = table.value;

  return {
    ...props.style,
    ...(props.draggableProvided?.draggableProps.style as CSSProperties),
    ...(rowHeight !== undefined && { height: `${rowHeight}px` }),
  };
});

const scrollLeft = computed((): number => superContext.value.scrollLeft ?? 0);
const containerWidth = computed(
  (): number => superContext.value.containerWidth ?? 0,
);

const shadowFor = (key: string, isFixed: boolean): boolean =>
  isFixed &&
  (table.value.fixedOffsets?.shouldShowShadow(
    key,
    scrollLeft.value,
    containerWidth.value,
  ) ??
    false);

/**
 * Skeleton rows get a key that cannot collide with a real row key, so
 * selection / expansion / transition lookups never match them.
 */
const rowKey = computed((): string =>
  props.record ? getRowKey(props.record) : `skeleton-${props.rowIndex}`,
);

const isSelected = computed((): boolean => {
  const { selection } = table.value;

  if (!props.record) return false;

  return (
    selection?.config?.getCheckboxProps?.(props.record)?.selected ??
    selection?.isRowSelected(rowKey.value) ??
    false
  );
});

const isIndeterminate = computed((): boolean =>
  props.record
    ? (table.value.selection?.config?.getCheckboxProps?.(props.record)
        ?.indeterminate ?? false)
    : false,
);

const isExpanded = computed((): boolean =>
  props.record
    ? (table.value.expansion?.isRowExpanded(rowKey.value) ?? false)
    : false,
);

const isAdding = computed(
  (): boolean =>
    table.value.transitionState?.addingKeys.has(rowKey.value) ?? false,
);
const isDeleting = computed(
  (): boolean =>
    table.value.transitionState?.deletingKeys.has(rowKey.value) ?? false,
);
const isFadingOut = computed(
  (): boolean =>
    table.value.transitionState?.fadingOutKeys.has(rowKey.value) ?? false,
);

const hasDragOrPinHandle = computed(
  (): boolean =>
    Boolean(table.value.draggable?.enabled) ||
    Boolean(table.value.pinnable?.enabled),
);

// Calculate column widths when dragging (since position: fixed breaks colgroup)
const draggingColumnWidths = computed((): Map<string, number> | null => {
  const { collectable, expansion, selection, toggleable } = table.value;

  if (!isDragging.value || !containerWidth.value) return null;

  // Calculate action columns total width
  let actionColumnsWidth = 0;

  if (hasDragOrPinHandle.value)
    actionColumnsWidth += DRAG_OR_PIN_HANDLE_COLUMN_WIDTH;
  if (selection) actionColumnsWidth += SELECTION_COLUMN_WIDTH;
  if (expansion) actionColumnsWidth += EXPANSION_COLUMN_WIDTH;
  if (toggleable?.enabled)
    actionColumnsWidth += toggleable.minWidth ?? TOGGLEABLE_COLUMN_WIDTH;
  if (collectable?.enabled) actionColumnsWidth += COLLECTABLE_COLUMN_WIDTH;

  return calculateColumnWidths({
    actionColumnsWidth,
    columns: data.value.columns,
    containerWidth: containerWidth.value,
    getResizedColumnWidth: superContext.value.getResizedColumnWidth,
  });
});

const isRowHighlighted = computed((): boolean => {
  const { highlight } = table.value;

  if (!highlight) return false;

  const { mode, rowIndex: hoveredRow } = highlight;

  if (hoveredRow === null) return false;

  // Row highlight: when hovering any cell in this row
  if (mode === 'row' && hoveredRow === props.rowIndex) return true;

  // Cross highlight: this row matches the hovered row
  if (mode === 'cross' && hoveredRow === props.rowIndex) return true;

  return false;
});

const dragOrPinHandle = computed(() => {
  const { draggable, fixedOffsets, pinnable } = table.value;
  const isDragMode = Boolean(draggable?.enabled);
  const isFixed = isDragMode
    ? Boolean(draggable?.fixed)
    : Boolean(pinnable?.fixed);

  return {
    dragHandleProps: isDragMode
      ? props.draggableProvided?.dragHandleProps
      : undefined,
    fixed: isFixed,
    fixedOffset: fixedOffsets?.getDragOrPinHandleOffset()?.offset ?? 0,
    mode: isDragMode ? ('drag' as const) : ('pin' as const),
    showShadow: shadowFor(DRAG_OR_PIN_HANDLE_KEY, isFixed),
    width: isDragging.value ? DRAG_OR_PIN_HANDLE_COLUMN_WIDTH : undefined,
  };
});

const selectionCell = computed(() => {
  const { fixedOffsets, selection } = table.value;
  const isFixed = Boolean(selection?.config?.fixed);

  return {
    disabled: props.record
      ? (selection?.isRowDisabled(props.record) ?? false)
      : false,
    fixed: isFixed,
    fixedOffset: fixedOffsets?.getSelectionOffset()?.offset ?? 0,
    showShadow: shadowFor(SELECTION_KEY, isFixed),
    width: isDragging.value ? SELECTION_COLUMN_WIDTH : undefined,
  };
});

const expandCell = computed(() => {
  const { expansion, fixedOffsets } = table.value;
  const config = expansion?.config;
  const isFixed = Boolean(config?.fixed);

  return {
    canExpand:
      props.record && config?.rowExpandable
        ? config.rowExpandable(props.record)
        : Boolean(props.record),
    fixed: isFixed,
    fixedOffset: fixedOffsets?.getExpansionOffset()?.offset ?? 0,
    showShadow: shadowFor(EXPANSION_KEY, isFixed),
    width: isDragging.value ? EXPANSION_COLUMN_WIDTH : undefined,
  };
});

/** One entry per column, discriminated by which kind of cell it needs. */
type RowCell = {
  column: TableColumn;
  columnIndex: number;
  fixed: boolean;
  fixedPosition?: 'end' | 'start';
  fixedOffset: number;
  kind: 'actions' | 'cell' | 'collectable' | 'toggleable';
  showShadow: boolean;
  width?: number;
};

const cells = computed((): RowCell[] =>
  data.value.columns.map((column, columnIndex) => {
    const { actions, collectable, fixedOffsets, toggleable } = table.value;
    const fixedPos = parseFixed(column.fixed);
    const offset = fixedOffsets?.getColumnOffset(column.key)?.offset ?? 0;
    const showShadow = shadowFor(column.key, !!fixedPos);
    const base = { column, columnIndex, showShadow };

    if (column.key === TOGGLEABLE_KEY && toggleable?.enabled) {
      return {
        ...base,
        fixed: Boolean(toggleable.fixed),
        fixedOffset: fixedOffsets?.getToggleableOffset()?.offset ?? 0,
        kind: 'toggleable',
        width: isDragging.value ? column.width : undefined,
      };
    }

    if (column.key === COLLECTABLE_KEY && collectable?.enabled) {
      return {
        ...base,
        fixed: Boolean(collectable.fixed),
        fixedOffset: fixedOffsets?.getCollectableOffset()?.offset ?? 0,
        kind: 'collectable',
        width: isDragging.value ? column.width : undefined,
      };
    }

    return {
      ...base,
      fixed: !!fixedPos,
      fixedPosition: fixedPos ?? undefined,
      fixedOffset: offset,
      kind:
        column.key === TABLE_ACTIONS_KEY && actions
          ? ('actions' as const)
          : ('cell' as const),
      width: draggingColumnWidths.value?.get(column.key),
    };
  }),
);

const rowStateClass = computed((): string | undefined => {
  const { rowState } = table.value;

  return resolveRowStateClass(
    typeof rowState === 'function'
      ? props.record && rowState(props.record)
      : rowState,
  );
});

const rowClasses = computed((): string =>
  clsx(
    classes.bodyRow,
    {
      [classes.bodyRowAdding]: isAdding.value,
      [classes.bodyRowDeleting]: isDeleting.value,
      [classes.bodyRowDragging]: isDragging.value,
      [classes.bodyRowFadingOut]: isFadingOut.value,
      [classes.bodyRowHighlight]: isRowHighlighted.value,
      [classes.bodyRowSelected]: isSelected.value,
      [classes.bodyRowSeparator]: table.value.separatorAtRowIndexes?.includes(
        props.rowIndex,
      ),
      [classes.bodyRowZebra]:
        table.value.zebraStriping && props.rowIndex % 2 === 1,
    },
    rowStateClass.value,
  ),
);

const setRowElement = (element: unknown): void => {
  const node = (element as HTMLElement | null) ?? null;

  props.draggableProvided?.innerRef(node);
  props.measureRef?.(node);
};

function handleMouseLeave(): void {
  table.value.highlight?.setHoveredCell(null, null);
}

function handleSelectionChange(): void {
  if (props.record) {
    table.value.selection?.toggleRow(rowKey.value, props.record);
  }
}

function handleExpandClick(): void {
  if (props.record) {
    table.value.expansion?.toggleExpand(rowKey.value, props.record);
  }
}
</script>

<template>
  <tr
    :ref="setRowElement"
    :aria-rowindex="rowIndex + 1"
    :aria-selected="isSelected"
    :class="rowClasses"
    :data-index="rowIndex"
    :data-row-key="rowKey"
    :tabindex="0"
    v-bind="draggableProvided?.draggableProps"
    :style="resolvedStyle"
    @mouseleave="handleMouseLeave"
  >
    <MznTableExpandCell
      v-if="table.expansion"
      :can-expand="expandCell.canExpand"
      :expanded="isExpanded"
      :fixed="expandCell.fixed"
      :fixed-offset="expandCell.fixedOffset"
      :show-shadow="expandCell.showShadow"
      :width="expandCell.width"
      @click="handleExpandClick"
    />
    <MznTableDragOrPinHandleCell
      v-if="hasDragOrPinHandle"
      :drag-handle-props="dragOrPinHandle.dragHandleProps"
      :fixed="dragOrPinHandle.fixed"
      :fixed-offset="dragOrPinHandle.fixedOffset"
      :mode="dragOrPinHandle.mode"
      :record="record"
      :show-shadow="dragOrPinHandle.showShadow"
      :width="dragOrPinHandle.width"
    />
    <MznTableSelectionCell
      v-if="table.selection"
      :disabled="selectionCell.disabled"
      :fixed="selectionCell.fixed"
      :fixed-offset="selectionCell.fixedOffset"
      :indeterminate="isIndeterminate"
      :mode="table.selection.mode"
      :selected="isSelected"
      :show-shadow="selectionCell.showShadow"
      :width="selectionCell.width"
      @change="handleSelectionChange"
    />
    <template v-for="cell in cells" :key="cell.column.key">
      <MznTableToggleableCell
        v-if="cell.kind === 'toggleable'"
        :fixed="cell.fixed"
        :fixed-offset="cell.fixedOffset"
        :record="record"
        :show-shadow="cell.showShadow"
        :width="cell.width"
      />
      <MznTableCollectableCell
        v-else-if="cell.kind === 'collectable'"
        :fixed="cell.fixed"
        :fixed-offset="cell.fixedOffset"
        :record="record"
        :show-shadow="cell.showShadow"
        :width="cell.width"
      />
      <MznTableActionsCell
        v-else-if="cell.kind === 'actions' && table.actions"
        :actions="table.actions"
        :class="cell.column.className"
        :column-index="cell.columnIndex"
        :fixed="cell.fixedPosition"
        :fixed-offset="cell.fixedOffset"
        :record="record"
        :row-index="rowIndex"
        :show-shadow="cell.showShadow"
        :width="cell.width"
      />
      <MznTableCell
        v-else
        :column="cell.column"
        :column-index="cell.columnIndex"
        :fixed="cell.fixedPosition"
        :fixed-offset="cell.fixedOffset"
        :record="record"
        :row-index="rowIndex"
        :show-shadow="cell.showShadow"
        :width="cell.width"
      />
    </template>
  </tr>
</template>
